"use client";
import React, { useState, useTransition } from 'react';
import { CardWrapper } from '@/components/auth/CardWrapper';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import Loader from "@/components/auth/Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { RegisterUser } from '@/actions/auth.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/validations';

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
   //[UsernameValue] 
    email: '',
      password: '',
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {

      setSuccess("");
      setError("");
     startTransition(() => {

  //[UsernameValidation]
     RegisterUser(values).then((res) => {
           if (res?.error) {
          setError(res?.error);
        } else {
          setSuccess(res?.success);
        }
      });
    });
  }

  return (
    <CardWrapper
      headerLabel='Create an account'
      BackButtonLabel='Already have an account?'
      BackButtonHref='/login'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='space-y-6'>
            {/*UsernameField*/}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='John Doe'
                      disabled={isPending}
                      type='text'
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='jogn.doe@example.com'
                      disabled={isPending}
                      type='email'
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='password'
                      disabled={isPending}
                      type='password'
                      {...field}
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
          {isPending ? (
     <Loader  color="white"/>
     ) : (
      <Button type='submit' className='w-full text-white bg-slate-800' disabled={isPending}>
            Register
          </Button>
     )}
        </form>
      </Form>
    </CardWrapper>
  );
};