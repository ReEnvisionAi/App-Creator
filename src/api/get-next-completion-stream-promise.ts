import { z } from "zod";
import OpenAI from "openai";
import Together from "together-ai";
import { MODELS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messageId, model } = await req.json();

    const { data: message, error: messageError } = await supabase
      .from('message')
      .select()
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      console.error('Message fetch error:', messageError);
      return new Response('Message not found', { status: 404 });
    }

    const { data: messages, error: messagesError } = await supabase
      .from('message')
      .select()
      .eq('chat_id', message.chat_id)
      .lte('position', message.position)
      .order('position', { ascending: true });

    if (messagesError || !messages) {
      console.error('Messages fetch error:', messagesError);
      return new Response('Failed to fetch messages', { status: 500 });
    }

    let parsedMessages;
    try {
      parsedMessages = z
        .array(
          z.object({
            role: z.enum(['system', 'user', 'assistant']),
            content: z.string(),
          }),
        )
        .parse(messages);
    } catch (parseError) {
      console.error('Message parsing error:', parseError);
      return new Response('Invalid message format', { status: 400 });
    }

    if (parsedMessages.length > 10) {
      parsedMessages = [parsedMessages[0], parsedMessages[1], parsedMessages[2], ...parsedMessages.slice(-7)];
    }

    const selectedModel = MODELS.find(m => m.value === model);
    if (!selectedModel) {
      console.error('Model not found:', model);
      return new Response('Model not found', { status: 404 });
    }

    if (selectedModel.provider === 'openai') {
      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiApiKey) {
        console.error('OpenAI API key not configured');
        return new Response('OpenAI API key not configured', { status: 500 });
      }

      try {
        const openai = new OpenAI({
          apiKey: openaiApiKey,
        });

        const stream = await openai.chat.completions.create({
          model,
          messages: parsedMessages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
          temperature: 0.2,
          max_tokens: 9000,
        });

        return new Response(stream.toReadableStream());
      } catch (openaiError) {
        console.error('OpenAI stream error:', openaiError);
        return new Response('Failed to generate OpenAI response', { status: 500 });
      }
    }

    try {
      let options: ConstructorParameters<typeof Together>[0] = {
        apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
      };

      const together = new Together(options);

      const stream = await together.chat.completions.create({
        model,
        messages: parsedMessages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
        temperature: 0.2,
        max_tokens: 9000,
      });

      return new Response(stream.toReadableStream());
    } catch (togetherError) {
      console.error('Together AI stream error:', togetherError);
      return new Response('Failed to generate Together AI response', { status: 500 });
    }
  } catch (error) {
    console.error('General API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}