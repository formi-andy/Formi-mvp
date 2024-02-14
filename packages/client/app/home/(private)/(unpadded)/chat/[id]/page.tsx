import { getChat } from "@/app/actions";
import { Chat } from "@/components/Chat/chat";
import { Id } from "@/convex/_generated/dataModel";
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

  // add initial message to front of array
  parsedMessages.unshift({
    id: "first_message" as Id<"message">,
    role: "assistant",
    createdAt: new Date(chat._creationTime),
    content: `Hi, I'm Formi, an AI chatbot designed to guide you through a series of questions about your health to better understand the reason for your visit. This process will support your doctor in making a diagnosis and planning your treatment.

Please answer the questions as you would in a normal conversation. It is important to answer questions fully and provide as much detail as possible to ensure we can offer you the best support.

After having a brief conversation with me, I will generate a report for your doctor.

Be assured that your responses are secure, confidential, and will only be shared with your physician. 

To begin, please tell me your age, sex, main concern or symptom, and how long you've been experiencing this symptom.`,
  });

  return <Chat id={chat._id} initialMessages={parsedMessages} />;
}
