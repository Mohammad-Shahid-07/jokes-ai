"use client"
import React, { useState, useTransition } from 'react';
import { CardWrapper } from '@/components/auth/CardWrapper';
import { useForm } from 'react-hook-form';
import { NewPasswordSchema } from '@/validations';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { resetPasswordWithToken } from '@/actions/auth.actions';

export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    startTransition(() => {
 setError(""); 
 setSuccess(""); 

      resetPasswordWithToken(values, token!).then((res) => {
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Your new password'
                      type='password'
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
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};