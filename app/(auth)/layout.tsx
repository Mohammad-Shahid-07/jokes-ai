import { currentUser } from "@/lib/utils/currentUser";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const user = await currentUser();
      
if (user) {
        redirect("/");
      
}
   return (
      <main
      className="flex h-screen flex-col items-center justify-center "
    >
      {children}
    </main>
  );
}