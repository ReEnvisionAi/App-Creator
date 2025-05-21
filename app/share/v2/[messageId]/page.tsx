import { useParams } from "react-router-dom";
import CodeRunner from "@/components/code-runner";
import { getPrisma } from "@/lib/prisma";
import { extractFirstCodeBlock } from "@/lib/utils";

export default function SharePage() {
  const { messageId } = useParams();
  if (!messageId) throw new Error("No message ID provided");

  const message = getMessage(messageId);
  if (!message) throw new Error("Message not found");

  const app = extractFirstCodeBlock(message.content);
  if (!app || !app.language) {
    throw new Error("No code block found");
  }

  return (
    <div className="flex h-full w-full grow items-center justify-center">
      <CodeRunner language={app.language} code={app.code} />
    </div>
  );
}

const getMessage = async (messageId: string) => {
  const prisma = getPrisma();
  return prisma.message.findUnique({
    where: {
      id: messageId,
    },
    include: {
      chat: true,
    },
  });
};