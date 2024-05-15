import React from "react";
import Link from "next/link";
import UserMenu from "./user/UserMenu";
import LoggedOut from "./control/LoggedOut";
import LoggedIn from "./control/LoggedIn";

const Navbar = () => {
  return (
    <>
      <LoggedIn>
        <div className="p-5">
          <UserMenu />
        </div>
      </LoggedIn>
    </>
  );
};

export default Navbar;
