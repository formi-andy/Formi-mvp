import { Chat } from "@/components/Chat/chat";

export default function IndexPage() {
  return (
    <Chat
      initialMessages={[
        {
          id: "first_message",
          role: "assistant",
          content: `Hi, I'm Formi, an AI chatbot designed to guide you through a series of questions about your health to better understand the reason for your visit. This process will support your doctor in making a diagnosis and planning your treatment.

  Please answer the questions as you would in a normal conversation. It is important to answer questions fully and provide as much detail as possible to ensure we can offer you the best support.

  After having a brief conversation with me, I will generate a report for your doctor.
  
  Be assured that your responses are secure, confidential, and will only be shared with your physician. 
  
  To begin, please tell me your age, sex, main concern or symptom, and how long you've been experiencing this symptom.`,
        },
      ]}
    />
  );
}
