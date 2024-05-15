"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { UpdateUserSchema } from "@/validations";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import ChooseAvatar from "@/components/user/ChooseAvatar";
import { updateUserNameUser } from "@/actions/user.actions";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/lib/utils/useCurrentUser";
import Loader from "@/components/auth/Loader";

const AccountContent = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState<boolean | undefined>(false);
  const pathname = usePathname();
  const { update } = useSession();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateUserSchema>) {
    try {
      setIsPending(true);
      setSuccess("");
      setError("");
      if (values.name === user?.name) return;

      await updateUserNameUser(values, pathname)
        .then((res) => {
          if (res?.error) {
            setError(res.error);
          }
          if (res?.success) {
            setSuccess(res.success);
          }
        })
        .catch((error) => {
          setError(error);
        });
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="bg-primary border-none">
      <CardHeader>
        <CardTitle className="text-white font-bold">Account</CardTitle>
        <CardDescription className="text-muted font-light">
          Make changes to your account here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      {form.getValues("name") ? (
        <CardContent className="space-y-2">
          <Dialog>
            <DialogTrigger>
              <div className="flex w-full gap-28">
                <div className="rounded-full ">
                  <Image
                    src={user?.image!}
                    alt="profile "
                    width={60}
                    height={68}
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                <span className=" flex gap-2 items-center justify-center text-primary-foreground hover:text-primary-foreground/50 ">
                  Change Avatar <ArrowRight />
                </span>
              </div>
            </DialogTrigger>
            <DialogContent className="p-0 w-full border-none">
              <ChooseAvatar />
            </DialogContent>
          </Dialog>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6 ">
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name"
                            type="text"
                            disabled={isPending}
                            {...field}
                            className="no-focus text-muted bg-primary border-primary-foreground/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              </div>
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
        </CardContent>
      ) : (
        <div className="m-10">
          <Loader color={""} />
        </div>
      )}
    </Card>
  );
};

export default AccountContent;
