import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";

export default function NewChatLink() {
  return (
    <Link
      href="/chat"
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
      )}
    >
      <IconPlus className="-translate-x-2 stroke-2" />
      New Chat
    </Link>
  );
}
