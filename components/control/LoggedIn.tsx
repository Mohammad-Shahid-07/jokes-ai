import React from "react";
import { currentUser } from "@/lib/utils/currentUser";
 interface LoggedInProps {
  children: React.ReactNode;
}
const LoggedIn = async ({ children }: LoggedInProps) => {
  const user = await currentUser();
  if (!user) {
    return;
  }
  return <div>{children}</div>;
};

export default LoggedIn;