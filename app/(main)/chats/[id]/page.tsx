import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";
import PageClient from "./page.client";

export default function Page() {
  const { id } = useParams();
  if (!id) throw new Error("No ID provided");

  const chat = await getChatById(id);
  if (!chat) throw new Error("Chat not found");

  return <PageClient chat={chat} />;
}

const getChatById = async (id: string) => {
  const { data: chat, error: chatError } = await supabase
    .from('chat')
    .select()
    .eq('id', id)
    .single();

  if (chatError) throw chatError;

  const { data: messages, error: messagesError } = await supabase
    .from('message')
    .select()
    .eq('chat_id', id)
    .order('position', { ascending: true });

  if (messagesError) throw messagesError;

  return {
    ...chat,
    messages: messages || []
  };
};

export type Chat = NonNullable<Awaited<ReturnType<typeof getChatById>>>;