//[imports] 
 import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/validations";
import bcrypt from "bcryptjs";
import { GetUserByEmail } from "@/actions/auth.actions";

 import Github from "next-auth/providers/github";


 import Google from "next-auth/providers/google"; 


import type { NextAuthConfig } from "next-auth";
export default {
  providers: [
                 Google({
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
                //[Github]
                 Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await GetUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        return null;
      },
    })
              ],
} satisfies NextAuthConfig;