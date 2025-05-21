import { getPrisma } from "@/lib/prisma";
import { useParams } from "react-router-dom";
import PageClient from "./page.client";

export default function Page() {
  const { id } = useParams();
  if (!id) throw new Error("No ID provided");

  const chat = getChatById(id);
  if (!chat) throw new Error("Chat not found");

  return <PageClient chat={chat} />;
}

const getChatById = async (id: string) => {
  const prisma = getPrisma();
  return await prisma.chat.findFirst({
    where: { id },
    include: { messages: { orderBy: { position: "asc" } } },
  });
};

export type Chat = NonNullable<Awaited<ReturnType<typeof getChatById>>>;
export type Message = Chat["messages"][number];