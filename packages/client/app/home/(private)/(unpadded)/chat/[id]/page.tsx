import { getChat } from "@/app/actions";
import { Chat } from "@/components/Chat/chat";
import { notFound } from "next/navigation";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = await getChat(params.id);

  if (!chat) {
    notFound();
  }

  const parsedMessages = chat.messages.map((message) => {
    return {
      id: message._id,
      content: message.content,
      createdAt: new Date(message._creationTime),
      role: message.role,
    };
  });

  return <Chat id={chat._id} initialMessages={parsedMessages} />;
}
