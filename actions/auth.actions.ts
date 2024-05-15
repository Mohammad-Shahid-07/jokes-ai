"use server"
//[imports] 
 import { LoginSchema, NewPasswordSchema, RegisterSchema, ResetSchema } from "@/validations";
 import * as z from "zod";
 import bcrypt from "bcryptjs";
 import EmailVerification from "@/models/email_verify.model";
 import { v4 as uuidv4 } from "uuid";
 import { sendResetEmail,  sendVerificationEmail } from "@/lib/mail";
 import ForgotPassword from "@/models/forgot_pass.model";
import { signIn } from "@/auth";
 import crypto from "crypto" 
 import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getProfileUrl } from "@/lib/constant";

import {sendTwoFactorTokenEmail} from "@/lib/mail";
import TwoFactorToken, { TwoFactorConfirmation } from "@/models/two_factor_token.model";


 
 
import User from "@/models/user.model"; import { connectToDatabase } from "@/lib/database";import { currentUser } from "@/lib/utils/currentUser";
import { AuthError } from "next-auth";
 

 export async function RegisterUser(values: z.infer<typeof RegisterSchema>) {
  try {
    connectToDatabase();
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Please provide a valid email and password" };
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ $or: [{ email }]})
    if (existingUser) {
      return { error: "User already exists" };
    }
    const image = getProfileUrl(); 
    const newUser = new User({
      name,
      image,
      email,
      password: hashedPassword,
   //[RegisterUsername]
  });
 await newUser.save(); 
    const Verificationtoken = await generateVerificationToken(email);
    await sendVerificationEmail(name, email, Verificationtoken.token);
    return { success: "Verification Email Sent!" };
  } catch (error: any) {
    return error.message;
  }
}
export async function LoginUser(values: z.infer<typeof LoginSchema>) {
  try {
    connectToDatabase();
      const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Please provide a valid email and password" };
    }
    const { email, password, code } = validatedFields.data;
    const callbackUrl = "/";

    
    const existingLoginUser = await User.findOne({ email })
    if (!existingLoginUser || !existingLoginUser.email || !existingLoginUser.password) {
      return { error: "User not found" };
    }
    if (!existingLoginUser.emailVerified) {
      const Verificationtoken = await generateVerificationToken(email);
      await sendVerificationEmail(
existingLoginUser.name,
        Verificationtoken.email,
        Verificationtoken.token,
      );
      return { success: "Confimation email sent" };
    }
    
       if (existingLoginUser.twoFactorEnabled && existingLoginUser.email) {
      if (code) {
        const twoFactorToken = await TwoFactorToken.findOne({ token: code });

        if (!twoFactorToken || twoFactorToken.token !== code) {
          return { error: "Invalid code" };
        }
        if (twoFactorToken.expiresAt.getTime() < new Date().getTime()) {
          return { error: "Code expired" };
        }

        await twoFactorToken.deleteOne();
        const existingConfirmation = await TwoFactorConfirmation.findOne({
          _id: existingLoginUser._id,
        });

        if (existingConfirmation) {
          await existingConfirmation.deleteOne();
        }
        await TwoFactorConfirmation.create({
          user: existingLoginUser._id,
          expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
        });
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingLoginUser.email);
        await sendTwoFactorTokenEmail(existingLoginUser.name, existingLoginUser.email, twoFactorToken.token);

        return { twoFactor: true };
      }
      } 
       

    await signIn("credentials", {
      email: existingLoginUser.email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}
export async function getVerificationTokenByEmail(email: string) {
  try {
    connectToDatabase();
    const Verificationtoken = await EmailVerification.findOne({ email });
    if (!Verificationtoken) {
      return { error: "Token not found" };
    }
    return Verificationtoken;
  } catch (error) {
    console.log(error);
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    connectToDatabase();
    const Verificationtoken = await EmailVerification.findOne({ token });
    if (!Verificationtoken) {
      return { error: "Token not found" };
    }
    return Verificationtoken;
  } catch (error) {
    console.log(error);
  }
}

export const generateVerificationToken = async (email: string) => {
  try {
    connectToDatabase();
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
    const existingToken = await EmailVerification.findOneAndDelete({ email });

    const newVerificationToken = new EmailVerification({
      email,
      token,
      expiresAt,
    });
    await newVerificationToken.save();
    return newVerificationToken;
  } catch (error) {
    console.log(error);
  }
};

export async function verifyToken(token: string) {
  try {
    connectToDatabase();
    const existingToken = await EmailVerification.findOne({ token });

    if (!existingToken) {
      return { error: "Token not found" };
    }
    const hasExpired = new Date().getTime() > existingToken.expiresAt.getTime();
    if (hasExpired) {
      await existingToken.deleteOne();
      return { error: "Token expired" };
    }
    const { email } = existingToken;
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }

    user.emailVerified = new Date();
    user.email = email;
    await user.save();
    await existingToken.deleteOne();
    return { success: "Email Verified!" };
  } catch (error) {
    console.log(error);
  }
}

export const generatePasswordResetToken = async (email: string) => {
  try {
    connectToDatabase();
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000);
    const existingToken = await ForgotPassword.findOneAndDelete({ email });

    const newPasswordResetToken = new ForgotPassword({
      email,
      token,
      expiresAt,
    });
    await newPasswordResetToken.save();
    return newPasswordResetToken;
  } catch (error) {
    console.log(error);
  }
};
export async function resetPassword(values: z.infer<typeof ResetSchema>) {
  try {
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Please provide a valid email" };
    }
    const { email } = validatedFields.data;
    connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }
    const Verificationtoken = await generatePasswordResetToken(email);
    await sendResetEmail(user.name, Verificationtoken.email, Verificationtoken.token);
    return { success: "Password reset email sent" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function resetPasswordWithToken(
  values: z.infer<typeof NewPasswordSchema>,
  token: string,
) {
  try {
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Please provide a valid email" };
    }
    const { password } = validatedFields.data;
    connectToDatabase();

    const existingToken = await ForgotPassword.findOne({ token });
    if (!existingToken) {
      return { error: "Token not found" };
    }
    const user = await User.findOne({ email: existingToken.email });
    const hasExpired = new Date().getTime() > existingToken.expiresAt.getTime();
    if (hasExpired) {
      await existingToken.deleteOne();
      return { error: "Token expired" };
    }
    const hashedPassword = await bcrypt.hash(values.password, 10);
    user.password = hashedPassword;
    await user.save();
    await existingToken.deleteOne();
    return { success: "Password reset" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
} 
 
 

 export const generateTwoFactorToken = async (email: string) => {
  try {
    connectToDatabase();
    const token = crypto.randomInt(100_100, 999_999).toString();
    const expiresAt = new Date(new Date().getTime() + 15 * 60 * 1000);
    const existingToken = await TwoFactorToken.findOneAndDelete({ email });

    const newTwoFactorToken = new TwoFactorToken({
      email,
      token,
      expiresAt,
    });
    await newTwoFactorToken.save();
    return newTwoFactorToken;
  } catch (error) {
    console.log(error);
  }
};
export async function getTwoFactorConfirmationByUserId(userId: string) {
  try {
    const twoFactorConfimation = await TwoFactorConfirmation.findOne({
      user: userId,
    });
    if (!twoFactorConfimation) {
      return { error: "Token not found" };
    }
    return twoFactorConfimation;
  } catch (error) {
    console.log(error);
  }
} 
 
 

 export async function LoginWithOAuth({ user, account }: any) {
  try {
    connectToDatabase();
    const { email, name, image } = user;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      existingUser.accounts = [
        {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          access_token: account.access_token,
          expires_at: account.expires_at,
          expires_in: account.expires_in,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
        },
      ];

      await existingUser.save();
      return true;
    } else {
//[DefUsername]  
      const newUser = new User({
        name,
//[OauthUsername]        
        image,
        email,
        emailVerified: Date.now(),
        accounts: [
          {
            provider: account.provider,
            providerAccountId: account.id,
            access_token: account.accessToken,
            expires_at: account.expiresAt,
            token_type: account.tokenType,
            scope: account.scope,
            id_token: account.idToken,
            providerId: account.id,
          },
        ],
      });
      await newUser.save();
    }

    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthSignInError":
          return { error: "Please Try Again" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
} 
 
export async function GetUserByEmail(email: string) {
  try {
    connectToDatabase();
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
  }
} 
 export async function GetUserById(id: string) {
  try {
    connectToDatabase();

    const user = await User.findOne({ _id: id });
    if (!user) {
      return { error: "User not found" };
    }
    return user;
  } catch (error) {
    console.log(error);
  }
}
 export async function getdbUser() {
 try {
  connectToDatabase();
  const sessionUser = await currentUser();
  if (!sessionUser) {
    return { error: "User not found" };
  }

  const user = await User.findOne({
    email: sessionUser.email,
  });
  return JSON.parse(JSON.stringify(user));
} catch (error) {
  console.log(error);
} 
}  