"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}
const LoginButton = ({ children, mode, asChild }: LoginButtonProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-gray-500/50 border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <span onClick={handleClick} className="cursor-pointer">
        {children}
      </span>
    );
  }
};

export default LoginButton;