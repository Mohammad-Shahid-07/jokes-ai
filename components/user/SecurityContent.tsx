"use client";
//[imports]
import { TwoFactorTogglerSchema } from "@/validations";
import { TwoFactorSystem } from "@/actions/user.actions";
import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SetPasswordSchema } from "@/validations";
import { changePassword, setNewPassword } from "@/actions/user.actions";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { getdbUser } from "@/actions/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import Loader from "@/components/auth/Loader";
import path from "path";
const SecuityContent = () => {
  const [user, setUser] = useState<any>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [type, setType] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const user = await getdbUser();

      setUser(user);
      user?.password ? setType("Change Password") : setType("New Password");
    };
    getUser();
  }, []);

  const pathname = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SetPasswordSchema>>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SetPasswordSchema>) {
    try {
      setIsPending(true);
      setSuccess("");
      setError("");

      if (type === "New Password") {
        if (values.newPassword === values.confirmNewPassword) {
          await setNewPassword(values.newPassword, user.email, pathname)
            .then((res: any) => {
              if (res?.error) {
                setError(res.error);
              }
              if (res?.success) {
                setSuccess(res.success);
              }
            })
            .catch(() => {
              setError("Something Went Wrong");
            });
        } else {
          setError("Passowrd Do Not Match");
        }
      } else if (type === "Change Password") {
        if (values.newPassword === values.confirmNewPassword) {
          await changePassword(
            values.newPassword,
            values.oldPassword || "",
            user.email,
            pathname,
          )
            .then((res: any) => {
              if (res?.error) {
                setError(res.error);
              }
              if (res?.success) {
                setSuccess(res.success);
              }
            })
            .catch(() => {
              setError("Something Went Wrong");
            });
        } else {
          setError("Passowrd Do Not Match");
        }
      }
    } catch (error: any) {
      console.log(error);
      setError("Something Went Wrong");
    } finally {
      setIsPending(false);
    }
  }
  return (
    <Card className="bg-primary border-none">
      <CardHeader>
        <CardTitle className="text-slate-800 font-bold">Security</CardTitle>
        <CardDescription className="text-muted font-light">
          Manage you account security. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {type ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5 flex w-full flex-col gap-9 "
              >
                {type === "Change Password" && (
                  <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="font-semibold text-slate-800">
                          Old Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Old Password"
                            type="password"
                            {...field}
                            className="no-focus border-slate-400 text-gray-600 border"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="font-semibold text-slate-800">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type In Your New Password"
                          type="password"
                          {...field}
                          className="no-focus border-slate-400 text-gray-600 border"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="font-semibold text-slate-800">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please Confrim Your Password"
                          type="password"
                          {...field}
                          className="no-focus border-slate-400 text-gray-600 border"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                  type="submit"
                  className="w-full text-white bg-slate-800"
                  disabled={isPending}
                >
                  Save
                </Button>
              </form>
            </Form>

            <TwoFactorToggle user={JSON.stringify(user)} />
          </>
        ) : (
          <Loader color="white" />
        )}
      </CardContent>
    </Card>
  );
};

export default SecuityContent;

const TwoFactorToggle = ({ user }: { user: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);
  const [initialValuesReady, setInitialValuesReady] = useState(false);
  const pathname = usePathname();
  const parsedUser = JSON.parse(user);

  // 1. Define your form.
  const form = useForm<z.infer<typeof TwoFactorTogglerSchema>>({
    resolver: zodResolver(TwoFactorTogglerSchema),
    defaultValues: {
      twoFactorEnabled: parsedUser?.TwoFactorEnabled,
    },
  });

  useEffect(() => {
    form.setValue("twoFactorEnabled", parsedUser?.twoFactorEnabled || false);
    const timeoutId = setTimeout(() => {
      setInitialValuesReady(true);
    }, 1000); // 1000 milliseconds = 1 second
    return () => {
      // Clear the timeout if the component is unmounted before the delay is complete
      clearTimeout(timeoutId);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof TwoFactorTogglerSchema>) {
    try {
      setSuccess("");
      setError("");
      setIsPending(true);

      const res = await TwoFactorSystem({
        path: pathname,
        twoFactorEnabled: values.twoFactorEnabled!,
      });
      if (res?.error) {
        setError(res.error);
      }
      if (res?.success) {
        setSuccess(res.success);
      }
    } catch (error: any) {
      setError("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(onSubmit)}
        className="mt-2 flex w-full flex-col  "
      >
        <FormField
          control={form.control}
          name="twoFactorEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-light-400 p-3 shadow-sm dark:border-light-900">
              <div className="space-y-0.5">
                <FormLabel className="font-semibold text-slate-800">
                  Two Factor Authentication
                </FormLabel>
                <FormDescription className="text-slate-700">
                  Enable two factor authentication for your account
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-red-400"
                  disabled={
                    isPending ||
                    field.value === undefined ||
                    field.value === null
                  }
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </Form>
  );
};
