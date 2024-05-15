"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { topics } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Markdown from "./Markdown";
import Loader from "./auth/Loader";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "topic must be at least 2 characters.",
  }),
});

const JokeGen = () => {
  const [joke, setJoke] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Technology",
    },
  });
  const handleSelect = (language: string) => {
    form.setValue("topic", language);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: values.topic }),
      });
      const data = await res.json();
      setJoke(data.reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const scrollToRef = () => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToRef();
  }, [joke, isLoading]);

  return (
    <div className=" ">
      <div className="mb-2 mt-8 flex flex-col gap-5">
        <div className="space-x-2">
          <span className="text-white">Choose a Topic:</span>
          <span className="text-orange-400 cursor-pointer">
            {form.watch("topic")}
          </span>
        </div>
        <div className="flex gap-5 flex-wrap items-center justify-center">
          {topics.map(
            (suggestion) =>
              suggestion?.title !== form.getValues("topic") && (
                <div
                  className="border-2 rounded-xl border-white/5 p-5"
                  key={suggestion?.title}
                >
                  <span
                    className="text-white cursor-pointer"
                    onClick={() => handleSelect(suggestion.title)}
                  >
                    {suggestion.title}
                  </span>
                  <Image
                    src={suggestion.img}
                    height={100}
                    alt="send button"
                    width={100}
                    className="object-cover bg-blend-color-burn aspect-square"
                  />
                </div>
              ),
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Or enter your own:
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border border-white/5   text-white bg-transparent  shadow-[0_10px_50px_rgba(50,_12,_14,_0.7)] focus:border-none"
                      placeholder="Enter your own"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a topic you want to get a joke for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div
            ref={ref}
            className="text-area min-h-52 p-2 mt-5 h-full w-full  flex items-center justify-center"
          >
            <Loader color="white" size="150px" />
          </div>
        )}
        {joke?.length > 1 && !isLoading && (
          <div
            ref={ref}
            className="text-white text-area min-h-52 p-2 mt-5 h-full w-full"
          >
            <Markdown text={joke} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JokeGen;
