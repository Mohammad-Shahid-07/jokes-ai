//[imports] 
 import {getTwoFactorConfirmationByUserId} from "@/actions/auth.actions";


 
 import {LoginWithOAuth} from "@/actions/auth.actions";


import NextAuth, { DefaultSession } from "next-auth";
import {GetUserByEmail,
GetUserById,
} from "@/actions/auth.actions";
import authConfig from "@/auth.config";

type ExtenededUser = DefaultSession["user"] & {
  id: string;
  role: string;
 //[UsernameType]
  twoFactorEnabled: boolean;
};
declare module "next-auth" {
  interface Session {
    user: ExtenededUser;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      
           if (account?.provider !== "credentials") {
            await LoginWithOAuth({ user, account });
            return true;
          } 
           
    
      
           const existingUser = await GetUserById(user.id);

            
          if (!existingUser?.emailVerified) return false; 
           
     
      
           if (existingUser?.twoFactorEnabled) {
              const twoFactorConfimation = await getTwoFactorConfirmationByUserId(
                existingUser._id,
              );

              if (!twoFactorConfimation) return false;
              await twoFactorConfimation.deleteOne();
            } 
           
     

      return true;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token?.id.toString();
      }
      if (token.role && session.user) {
        session.user.role = token.role.toString();
      }
      if (session.user) {
        session.user.name = token?.name;
        session.user.email = token?.email;
 //[AddUsernameInSession]
        session.user.image = token?.image as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const dbUser = await GetUserByEmail(token.email);
      if (!dbUser) return token;
      token.name = dbUser.name;
      token.email = dbUser.email;
//[AddUsernameInToken]
      token.image = dbUser?.image;
      token.id = dbUser._id;
      token.role = dbUser.role;

      return token;
    },
  },

  ...authConfig,
  session: {
    strategy: "jwt",
  },
});