"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import AccountContent from "@/components/user/AccountContent";
import SecuityContent from "@/components/user/SecurityContent";
import DangerContent from "@/components/user/DangerContent";

const UserSettings = () => {
  return (
    <div>
      <Tabs
        defaultValue="account"
        className="w-[400px] bg-primary shadow-md drop-shadow-lg rounded-md"
      >
        <TabsList className="flex justify-between bg-[#27272a]  items-center w-full grid-cols-3">
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-[#09090b] flex-1 data-[state=active]:text-white"
          >
            Account
          </TabsTrigger>

          <TabsTrigger
            value="password"
            className="data-[state=active]:bg-[#09090b] flex-1 border-r  data-[state=active]:text-white "
          >
            Security
          </TabsTrigger>

          <TabsTrigger
            value="danger"
            className="data-[state=active]:bg-rose-500 flex-1 data-[state=active]:text-white "
          >
            Danger
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountContent />
        </TabsContent>
        <TabsContent value="password">
          <SecuityContent />
        </TabsContent>
        <TabsContent value="danger">
          <DangerContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
