"use client";
import React, { useState, useTransition } from 'react';
import { CardWrapper } from '@/components/auth/CardWrapper';
import { useForm } from 'react-hook-form';
import { ResetSchema } from '@/validations';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { resetPassword } from '@/actions/auth.actions';
import { zodResolver } from '@hookform/resolvers/zod';

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ResetSchema>) {

      setSuccess("");
      setError("");
          startTransition(() => {
      resetPassword(values).then((res) => {
        setError(res?.error);
        setSuccess(res?.success);
      });
    });
  }

  return (
    <CardWrapper
      headerLabel='Forgot Your Password?'
      BackButtonLabel='Back to login'
      BackButtonHref='/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='jogn.doe@example.com'
                      type='email'
                      {...field}
                      disabled={isPending}
                    className="w-full bg-slate-950 border-slate-700 text-gray-400 ring-0 focus:border-none focus:ring-0 border"                    
/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type='submit' className='w-full text-white bg-slate-800' disabled={isPending}>
            Send Reset Link
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};