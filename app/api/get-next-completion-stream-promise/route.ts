import { z } from "zod";
import OpenAI from "openai";
import Together from "together-ai";
import { MODELS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { messageId, model } = await req.json();

  const { data: message, error: messageError } = await supabase
    .from('message')
    .select()
    .eq('id', messageId)
    .single();

  if (messageError || !message) {
    return new Response(null, { status: 404 });
  }

  const { data: messages, error: messagesError } = await supabase
    .from('message')
    .select()
    .eq('chat_id', message.chat_id)
    .lte('position', message.position)
    .order('position', { ascending: true });

  if (messagesError || !messages) {
    return new Response("Failed to fetch messages", { status: 500 });
  }

  let parsedMessages = z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      }),
    )
    .parse(messages);

  if (parsedMessages.length > 10) {
    parsedMessages = [parsedMessages[0], parsedMessages[1], parsedMessages[2], ...parsedMessages.slice(-7)];
  }

  const selectedModel = MODELS.find(m => m.value === model);
  if (!selectedModel) {
    return new Response("Model not found", { status: 404 });
  }

  if (selectedModel.provider === "openai") {
    if (!process.env.VITE_OPENAI_API_KEY) {
      return new Response("OpenAI API key not configured", { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY,
    });

    const stream = await openai.chat.completions.create({
      model,
      messages: parsedMessages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
      temperature: 0.2,
      max_tokens: 9000,
    });

    return new Response(stream.toReadableStream());
  }

  let options: ConstructorParameters<typeof Together>[0] = {
    apiKey: process.env.VITE_TOGETHER_API_KEY,
  };
  
  if (process.env.VITE_HELICONE_API_KEY) {
    options.baseURL = "https://together.helicone.ai/v1";
    options.defaultHeaders = {
      "Helicone-Auth": `Bearer ${process.env.VITE_HELICONE_API_KEY}`,
      "Helicone-Property-appname": "LlamaCoder",
      "Helicone-Session-Id": message.chat_id,
      "Helicone-Session-Name": "LlamaCoder Chat",
    };
  }

  const together = new Together(options);

  const stream = await together.chat.completions.create({
    model,
    messages: parsedMessages.map((m) => ({ role: m.role, content: m.content })),
    stream: true,
    temperature: 0.2,
    max_tokens: 9000,
  });

  return new Response(stream.toReadableStream());
}

export const runtime = "edge";
export const maxDuration = 45;