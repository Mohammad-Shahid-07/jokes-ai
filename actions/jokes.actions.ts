"use server";

import { connectToDatabase } from "@/lib/database";
import { getdbUser } from "./auth.actions";
import { Chat, IChat } from "@/models/chat.model";
import console from "console";

export async function saveJoke(params: any) {
  try {
    connectToDatabase();
    const user = await getdbUser();
  
    
    if (!user) {
      return;
    }

    const chat = await Chat.findOne({ user: user._id });

    
    const valToPush = [
      {
        role: "user",
        parts: [
          {
            text: params.topic,
          },
        ],
        createdAt: new Date(),
      },
      {
        role: "model",
        parts: [
          {
            text: params.reply,
          },
        ],
        createdAt: new Date(),
      },
    ];

    if (chat) {
      chat.messages.push(...valToPush);
      console.log(chat.messages);
      
      await chat.save();
    } else {
      const chat = await Chat.create({
        user: user._id,
        messages: valToPush,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getJokes() {
  try {
    const user = await getdbUser();
    if (!user) {
      return;
    }
    const chat = await Chat.findOne({ user: user._id });

    if (!chat) {
      return { messages: [] };
    }
    return { chat };
  } catch (error) {
    console.log(error);
  }
}
