import { Sidebar } from "@/components/Chat/sidebar";

import { auth } from "@clerk/nextjs";
import { ChatHistory } from "@/components/Chat/chat-history";

export async function SidebarDesktop() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      {/* @ts-ignore */}
      <ChatHistory userId={userId} />
    </Sidebar>
  );
}
