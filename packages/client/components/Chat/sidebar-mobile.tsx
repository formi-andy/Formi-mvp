"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Sidebar } from "@/components/Chat/sidebar";
import { Button } from "@/components/ui/button";

import { BsChevronCompactRight } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarMobileProps {
  children: React.ReactNode;
}

export function SidebarMobile({ children }: SidebarMobileProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="ml-2 top-1/2 absolute flex size-9 p-0 lg:hidden"
            >
              <BsChevronCompactRight className="size-6" />
              <span className="sr-only">Open Sidebar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center justify-center absolute left-8 top-1 w-28">
            Open Sidebar
          </TooltipContent>
        </Tooltip>
      </SheetTrigger>
      <SheetContent className="flex top-16 h-[calc(100%_-_64px)] w-[300px] flex-col p-0 pt-8">
        <Sidebar className="flex">{children}</Sidebar>
      </SheetContent>
    </Sheet>
  );
}
