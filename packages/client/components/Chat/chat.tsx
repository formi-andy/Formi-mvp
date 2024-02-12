"use client";

import { useChat, type Message } from "ai/react";

import { cn } from "@/lib/utils";
import { ChatList } from "@/components/Chat/chat-list";
import { ChatPanel } from "@/components/Chat/chat-panel";
import { EmptyScreen } from "@/components/Chat/empty-screen";
import { ChatScrollAnchor } from "@/components/Chat/chat-scroll-anchor";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IconFormi } from "../ui/icons";
import { Loader } from "@mantine/core";
import { Separator } from "../ui/separator";

const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter();
  const path = window.location.pathname;
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    "ai-token",
    null
  );
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? ""
  );
  const [chatId, setChatId] = useState<string | undefined>();

  const { messages, append, reload, stop, isLoading, input, setInput, data } =
    useChat({
      initialMessages,
      id,
      body: {
        id: chatId,
        previewToken,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });

  useEffect(() => {
    if (id && !chatId) {
      setChatId(id);
      return;
    }
    if (
      data &&
      data[0] &&
      (data[0] as { chat_id: string }).chat_id !== chatId
    ) {
      if (path === "/chat") {
        router.push(`/chat/${(data[0] as { chat_id: string }).chat_id}`);
      } else {
        setChatId((data[0] as { chat_id: string }).chat_id);
      }
    }
  }, [data, chatId, id, path, router]);

  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            {isLoading && messages.length % 2 === 1 && (
              // prompt engine running
              <div className="relative mx-auto max-w-2xl px-4">
                <Separator className="my-4 md:my-8" />
                <div
                  className={cn(
                    "group relative mb-4 flex items-start md:-ml-12"
                  )}
                >
                  <div
                    className={cn(
                      "relative flex size-8 shrink-0 select-none overflow-hidden items-center justify-center rounded-md shadow bg-white text-primary-foreground border"
                    )}
                  >
                    <IconFormi />
                  </div>
                  <div className="flex flex-1 items-center gap-x-2 px-1 ml-4 space-y-2 overflow-hidden">
                    Formi is thinking
                    <Loader size={20} />
                  </div>
                </div>
              </div>
            )}
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          !isLoading && <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={chatId}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{" "}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{" "}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={(e) => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenDialog(false);
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
