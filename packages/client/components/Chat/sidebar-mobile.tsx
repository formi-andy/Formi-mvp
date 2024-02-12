"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Sidebar } from "@/components/Chat/sidebar";
import { Button } from "@/components/ui/button";

import { IconSidebar } from "@/components/ui/icons";

interface SidebarMobileProps {
  children: React.ReactNode;
}

export function SidebarMobile({ children }: SidebarMobileProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="ml-2 absolute flex size-9 p-0 lg:hidden"
        >
          <IconSidebar className="size-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex top-16 h-[calc(100%_-_64px)] w-[300px] flex-col p-0 pt-8">
        <Sidebar className="flex">{children}</Sidebar>
      </SheetContent>
    </Sheet>
  );
}
