import { ChatHistory } from "@/components/Chat/chat-history";
import { SidebarDesktop } from "@/components/Chat/sidebar-desktop";
import { SidebarMobile } from "@/components/Chat/sidebar-mobile";
import { SidebarToggle } from "@/components/Chat/sidebar-toggle";
import { auth } from "@clerk/nextjs";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <SidebarMobile>
        <ChatHistory userId={userId} />
      </SidebarMobile>
      <SidebarDesktop />
      <div className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        {children}
      </div>
    </div>
  );
}
