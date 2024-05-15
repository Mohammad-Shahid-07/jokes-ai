"use client";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DeleteAccountSchema } from '@/validations';
import { deleteUser } from '@/actions/user.actions';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormError } from '@/components/auth/FormError';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

const DangerContent = () => {
  return (
    <Card className="bg-primary border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-rose-500">
          Danger
        </CardTitle>
        <CardDescription className="text-muted font-light">
          Once you delete your account, there is no going back. Please be
          certain.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="mt-5 bg-red-500 text-white"
            >
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-primary border-primary-foreground/20">
            <DialogHeader>
              <DialogTitle className="text-red-500">
                 Delete Account
              </DialogTitle>
              <DialogDescription className="text-muted font-light">
                Please enter your password to confirm account deletion.
              </DialogDescription>
            </DialogHeader>
            <DeleteForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

function DeleteForm({ className }: React.ComponentProps<'form'>) {
  const [error, setError] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean | undefined>(false);
  const form = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof DeleteAccountSchema>) {
    try {
      setIsPending (true);
      setError("");
         await deleteUser(values.password).then((res) => {
        if (res.error) {
          setError(res.error);
        }
      });
    } catch (error) {
      setError('Something Went Wrong');
    } finally {
      setIsPending(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid items-start gap-4', className)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
             <FormLabel className="font-bold text-secondary">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="******"
                  type="password"
                  {...field}
                  className="no-focus bg-primary border-primary-foreground/20 text-secondary "
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button
          type="submit"
          disabled={isPending}
          className=" mb-2 rounded-lg bg-red-500  text-white "
        >
          Delete Account
        </Button>
      </form>
    </Form>
  );
}

export default DangerContent;