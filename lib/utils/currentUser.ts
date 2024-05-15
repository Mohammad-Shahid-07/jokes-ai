
 import { auth } from "@/auth";
export async function currentUser() {
  try {
    const session = await auth();
    if (session) {
      return session.user;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
}  