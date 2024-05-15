"use client";
//[imports]
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/validations";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { LoginUser } from "@/actions/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import error from "next/error";
import Loader from "@/components/auth/Loader";

import { CardWrapper } from "@/components/auth/CardWrapper";

export const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email aleady in use. Please login with diffrent Provider!"
      : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formFieldLabels = {
    label: "Email",
    type: "email",
    placeholder: "jogn.doe@example.com",
  };

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setSuccess("");
    setError("");
    startTransition(() => {
      LoginUser(values)
        .then((res) => {
          if (res?.error) {
            form.reset();
            setError(res?.error);
          }
          if (res?.success) {
            form.reset();
            setSuccess(res?.success!);

            if (res?.twoFactor) {
              setShowTwoFactor(true);
            }
          }
        })
        .catch((err) => {
          setError(err?.message);
        });
    });
  }

  if (showTwoFactor) {
    return (
      <CardWrapper
        headerLabel="Welcome back!"
        BackButtonLabel="Don't have an account?"
        BackButtonHref="/register"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        type="number"
                        disabled={isPending}
                        {...field}
                        className="w-full bg-slate-950 border-slate-700 text-gray-400 ring-0 focus:border-none focus:ring-0 border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              className="w-full text-white bg-slate-800"
              disabled={isPending}
            >
              Verify
            </Button>
          </form>
        </Form>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerLabel="Sign in to continue"
      BackButtonHref="/register"
      BackButtonLabel="Already have a account?"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{formFieldLabels.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={formFieldLabels.placeholder}
                        type={formFieldLabels.type}
                        disabled={isPending}
                        {...field}
                        className="w-full bg-slate-950 border-slate-700 text-gray-400 ring-0 focus:border-none focus:ring-0 border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        disabled={isPending}
                        type="password"
                        {...field}
                        className="w-full bg-slate-950 border-slate-700 text-gray-400 ring-0 focus:border-none focus:ring-0 border"
                      />
                    </FormControl>
                    <Button
                      variant="link"
                      asChild
                      className="px-1 font-normal text-white"
                      disabled={isPending}
                    >
                      <Link href="/reset">Forgot Password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          {isPending ? (
            <Loader color="white" />
          ) : (
            <Button
              type="submit"
              className="w-full text-white bg-slate-800"
              disabled={isPending}
            >
              Login
            </Button>
          )}
        </form>
      </Form>
    </CardWrapper>
  );
};
