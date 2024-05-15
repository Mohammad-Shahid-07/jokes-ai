import * as React from "react";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getJokes } from "@/actions/jokes.actions";
import Markdown from "./Markdown";

export async function JokeList() {
  const jokes = await getJokes();
  if (jokes?.chat?.messages.length > 0) {
    return (
      <ScrollArea className="w-[50vw]  whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4 flex-wrap">
          {jokes?.chat?.messages
            .reduce((pairs: any[][], joke: any, index: number) => {
              if (index % 2 === 0) {
                pairs.push([joke]); // Start a new pair with the current joke
              } else {
                pairs[pairs.length - 1].push(joke); // Add the current joke to the last pair
              }
              return pairs;
            }, [])
            .reverse()
            .map((pair: any[], pairIndex: React.Key | null | undefined) => (
              <div key={pairIndex} className="flex flex-col space-y-4 border">
                {pair.map(
                  (joke: {
                    _id: React.Key | null | undefined;
                    role: string;
                    parts: { text: string | undefined }[];
                  }) => (
                    <div
                      key={joke._id}
                      className={`flex items-center text-white ${
                        joke.role === "user"
                          ? "justify-end m-2  w-fit rounded-md  "
                          : "justify-start"
                      }`}
                    >
                      <p
                        className={`rounded-lg w-full  h-full line-clamp-1  ${
                          joke.role === "user"
                            ? "bg-white/5 p-1 text-gray-500 text-sm"
                            : " p-2 "
                        }`}
                      >
                        {joke.role === "user" ? (
                          <p>{joke.parts[0].text}</p>
                        ) : (
                          <Markdown text={joke.parts[0].text} />
                        )}
                      </p>
                    </div>
                  ),
                )}
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }
}
