"use server";
import { connectToDatabase } from "@/lib/database";
import { currentUser } from "@/lib/utils/currentUser";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { signOut } from "@/auth";
import * as z from "zod";
import { SetPasswordSchema, UpdateUserSchema } from "@/validations";
type updateUserImageProps = {
  image: string;
  path: string;
};
export async function updateUserImage(params: updateUserImageProps) {
  try {
    const { image, path } = params;
    connectToDatabase();
    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }
    const user = await User.findOne({ email: userSession?.email });
    if (!user) {
      throw new Error("User not found");
    }
    user.image = image;

    await user.save();
    userSession.image = image;
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUserNameUser(
  values: z.infer<typeof UpdateUserSchema>,
  pathname: string,
) {
  try {
    const validatedFields = UpdateUserSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Something went wrong" };
    }
    const { name } = values;    
    connectToDatabase();
    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }
    const user = await User.findOneAndUpdate(
      { email: userSession?.email },
      {name: name},
      { new: true },
    );
    if (!user) {
      return { error: "User not found" };
    }
    userSession.name = user.name;
    revalidatePath(pathname);
    return { success: "User updated" };
  } catch (error) {
    console.log(error);
  }
}

export async function setNewPassword(
  values: z.infer<typeof SetPasswordSchema>,
  email: string,
  pathname: string,
) {
  try {
    const validatedFields = SetPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Something went wrong" };
    }
    const { newPassword } = values;
    connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "User Not Found" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    revalidatePath(pathname);
    return {
      success:
        "Password Created Now You can Login With Email & Password As Well",
    };
  } catch (error) {
    console.log(error);
    return { error: "Something Went Wrong" };
  }
}

export async function changePassword(
  values: z.infer<typeof SetPasswordSchema>,
  email: string,
  pathname: string,
) {
  try {
    const validatedFields = SetPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Something went wrong" };
    }
    const { oldPassword, newPassword } = values;
    if (!oldPassword) return { error: "Please enter your old password" };
    connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return { error: "User Not Found" };
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return { error: "Old password is incorrect" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    revalidatePath(pathname);
    return { success: "Password Updated" };
  } catch (error) {
    return { error: "Something Went Wrong" };
  }
}

export async function deleteUser(password: string) {
  try {
    connectToDatabase();
    const userSession = await currentUser();

    const user = await User.findOne({ email: userSession?.email });
    if (!user) {
      return { error: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Password is incorrect" };
    }

    await User.findOneAndDelete({ email: user.email });
    await signOut();
    return { success: "User deleted successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


 export async function TwoFactorSystem(params: {
  path: string;
  twoFactorEnabled: boolean;
}) {
  try {
    connectToDatabase();
    const { path, twoFactorEnabled } = params;
    const userSession = await currentUser();
    if (!userSession) {
      return { error: "User session not found" };
    }
    const user = await User.findOne({ email: userSession.email });

    if (!user) {
      return { error: "User not found" };
    }
    if (user.password) {
      user.twoFactorEnabled = twoFactorEnabled;
      await user.save();
      revalidatePath(path);
    }

    return {
      success: `Two Factor Authentication is ${
        user.twoFactorEnabled ? "Enabled" : "Disabled"
      }`,
    };
  } catch (error) {
    console.error("Error in TwoFactorSystem:", error);

    throw error;
  }
} 
 