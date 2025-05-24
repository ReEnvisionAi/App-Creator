import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";
import PageClient from "./page.client";
import { useEffect, useState, Suspense } from "react";
import type { Chat } from "./page.client";

export default function Page() {
  const { id } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      return;
    }

    getChatById(id)
      .then((chat) => {
        if (!chat) throw new Error("Chat not found");
        setChat(chat);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!chat) return <div className="p-4">Loading...</div>;

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <PageClient chat={chat} />
    </Suspense>
  );
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