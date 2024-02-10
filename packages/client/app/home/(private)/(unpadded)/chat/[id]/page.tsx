import clerkClient from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs";
import { getChat } from "@/app/actions";
import { Chat } from "@/components/Chat/chat";
import { notFound } from "next/navigation";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId || "");

  console.log("USER", user);

  const chat = await getChat(params.id, userId);

  if (!chat) {
    notFound();
  }

  if (chat?.userId !== userId) {
    notFound();
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />;
}
