import { getdbUser } from "@/actions/auth.actions";
import { getJokes, saveJoke } from "@/actions/jokes.actions";
import { currentUser } from "@/lib/utils/currentUser";
import { Chat, IChat, IMessage } from "@/models/chat.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }
    const jokes = await getJokes();

    const buildGoogleGenAIPrompt = (messages: IMessage[]) => {
      const defaultPrompts = [
        {
          role: "user",
          parts: [
            {
              text: `make a joke about any topic I ask you . dont make it too long . dont repeat the same joke .`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `Sure, I will generate a joke for you. Please provide me with a topic.`,
            },
          ],
        },
      ];

      const combinedMessages = [
        ...defaultPrompts,
        ...((jokes
          ? jokes?.chat?.messages.map(
              (message) =>
                ({
                  role: message.role,
                  parts: message.parts.map((part) => ({ text: part.text })),
                } as IMessage),
            )
          : []) as IMessage[]),
        ...messages,
      ];

      return { contents: combinedMessages };
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("API key is missing");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: buildGoogleGenAIPrompt([
            { role: "user", parts: [{ text: topic }] },
          ]).contents,
        }),
      },
    );

    const data = await response.json();

    const reply = data?.candidates[0]?.content?.parts[0]?.text;
    if (reply.length <= 0) {
      console.log(reply);

      return NextResponse.json({
        reply: "Something went wrong please try again",
      });
    }

    await saveJoke({ topic, reply });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
