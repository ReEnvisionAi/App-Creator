import { supabase } from "@/lib/supabase";
import {
  getMainCodingPrompt,
  screenshotToCodePrompt,
  softwareArchitectPrompt,
} from "@/lib/prompts";
import Together from "together-ai";

export async function createChat({
  prompt: string,
  model: string,
  quality: "high" | "low",
  screenshotUrl: string | undefined,
  userId: string,
}) {
) {
  const { data: chat, error } = await supabase
    .from('chat')
    .insert({
      model,
      quality,
      prompt,
      title: "",
      shadcn: true,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  let options: ConstructorParameters<typeof Together>[0] = {};
  if (process.env.HELICONE_API_KEY) {
    options.baseURL = "https://together.helicone.ai/v1";
    options.defaultHeaders = {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-Property-appname": "LlamaCoder",
      "Helicone-Session-Id": chat.id,
      "Helicone-Session-Name": "LlamaCoder Chat",
    };
  }

  const together = new Together(options);

  async function fetchTitle() {
    const responseForChatTitle = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a chatbot helping the user create a simple app or script, and your current job is to create a succinct title, maximum 3-5 words, for the chat given their initial prompt. Please return only the title.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const title = responseForChatTitle.choices[0].message?.content || prompt;
    return title;
  }

  async function fetchTopExample() {
    const findSimilarExamples = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful bot. Given a request for building an app, you match it to the most similar example provided. If the request is NOT similar to any of the provided examples, return "none". Here is the list of examples, ONLY reply with one of them OR "none":

          - landing page
          - blog app
          - quiz app
          - pomodoro timer
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const mostSimilarExample =
      findSimilarExamples.choices[0].message?.content || "none";
    return mostSimilarExample;
  }

  const [title, mostSimilarExample] = await Promise.all([
    fetchTitle(),
    fetchTopExample(),
  ]);

  let fullScreenshotDescription;
  if (screenshotUrl) {
    const screenshotResponse = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      temperature: 0.2,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: screenshotToCodePrompt },
            {
              type: "image_url",
              image_url: {
                url: screenshotUrl,
              },
            },
          ],
        },
      ],
    });

    fullScreenshotDescription = screenshotResponse.choices[0].message?.content;
  }

  let userMessage: string;
  if (quality === "high") {
    let initialRes = await together.chat.completions.create({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [
        {
          role: "system",
          content: softwareArchitectPrompt,
        },
        {
          role: "user",
          content: fullScreenshotDescription
            ? fullScreenshotDescription + prompt
            : prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 3000,
    });

    userMessage = initialRes.choices[0].message?.content ?? prompt;
  } else if (fullScreenshotDescription) {
    userMessage =
      prompt +
      "RECREATE THIS APP AS CLOSELY AS POSSIBLE: " +
      fullScreenshotDescription;
  } else {
    userMessage = prompt;
  }

  const { data: updatedChat, error: updateError } = await supabase
    .from('chat')
    .update({ title })
    .eq('id', chat.id)
    .select()
    .single();

  if (updateError) throw updateError;

  const { data: messages, error: messagesError } = await supabase
    .from('message')
    .insert([
      {
        role: "system",
        content: getMainCodingPrompt(mostSimilarExample),
        position: 0,
        chat_id: chat.id
      },
      {
        role: "user",
        content: userMessage,
        position: 1,
        chat_id: chat.id
      }
    ])
    .select();

  if (messagesError) throw messagesError;

  if (!messages || messages.length === 0) throw new Error("No messages created");

  return {
    chatId: chat.id,
    lastMessageId: messages[1].id,
  };
}

export async function createMessage(
  chatId: string,
  text: string,
  role: "assistant" | "user",
) {
  const { data: messages, error: messagesError } = await supabase
    .from('message')
    .select()
    .eq('chat_id', chatId)
    .order('position', { ascending: true });

  if (messagesError) throw messagesError;
  if (!messages) throw new Error("Chat not found");

  const maxPosition = Math.max(...messages.map((m) => m.position));

  const { data: newMessage, error } = await supabase
    .from('message')
    .insert({
      role,
      content: text,
      position: maxPosition + 1,
      chat_id: chatId,
    })
    .select()
    .single();

  if (error) throw error;

  return newMessage;
}