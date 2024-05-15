"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleOauth = (provider: string) => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-center  gap-2">
      <Button
        className="outline outline-2 w-full flex gap-5  outline-gray-700"
        variant="ghost"
        size="lg"
        onClick={() => handleOauth("google")}
      >
        <Image
          src="https://utfs.io/f/eb04033a-a0af-402c-b691-1ffeadec8c91-c3fgyx.svg"
          alt="google"
          width={20}
          height={20}
          className="w-6 h-6"
        />
        Continue with Google
      </Button>

      <Button
        className="outline outline-2 w-full flex gap-5 outline-gray-700"
        variant="ghost"
        size="lg"
        onClick={() => handleOauth("github")}
      >
        <Image
          src="https://utfs.io/f/d3274ee5-df7a-467b-a974-6b4197ee1aa5-n8iwbn.svg"
          alt="google"
          width={20}
          height={20}
          className="w-6 h-6"
        />
        Continue with Github
      </Button>
    </div>
  );
};
