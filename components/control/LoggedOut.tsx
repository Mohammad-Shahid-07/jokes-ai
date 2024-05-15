import React from "react";
import { currentUser } from "@/lib/utils/currentUser";
 interface LoggedOutProps {
  children: React.ReactNode;
}
const LoggedOut = async ({ children }: LoggedOutProps) => {
  const user = await currentUser();
  if (user) {
    return;
  }
  return <div>{children}</div>;
};

export default LoggedOut;