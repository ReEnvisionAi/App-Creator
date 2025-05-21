import CodeRunner from "@/components/code-runner";
import { getPrisma } from "@/lib/prisma";
import { extractFirstCodeBlock } from "@/lib/utils";
import { cache } from "react";

export default async function SharePage({
  params,
}: {
  params: Promise<{ messageId: string }>;
}) {
  const { messageId } = await params;

  const prisma = getPrisma();
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) {
    throw new Error("Message not found");
  }

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

const getMessage = cache(async (messageId: string) => {
  const prisma = getPrisma();
  return prisma.message.findUnique({
    where: {
      id: messageId,
    },
    include: {
      chat: true,
    },
  });
});