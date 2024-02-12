import * as React from "react";
import { type UseChatHelpers } from "ai/react";

// import { shareChat } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { PromptForm } from "@/components/Chat/prompt-form";
import { ButtonScrollToBottom } from "@/components/Chat/button-scroll-to-bottom";
import { IconRefresh, IconShare, IconStop } from "@/components/ui/icons";
import { ChatShareDialog } from "@/components/Chat/chat-share-dialog";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
  title?: string;
}

export function ChatPanel({
  id,
  title,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
}: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  const isFinished =
    messages?.[messages.length - 1]?.content.includes(
      "Thank you for using Formi."
    ) && messages?.[messages.length - 1]?.role === "assistant";

  console.log("isFinished", isFinished);

  return (
    <div className="fixed inset-x-0 bottom-0 w-full animate-in duration-300 ease-in-out peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-12">
          {isFinished && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={async () => {
                  console.log("GENERATING REPORT");
                  const report = await fetch("/api/report", {
                    method: "POST",
                    body: JSON.stringify({
                      chat_id: id,
                      messages,
                    }),
                  });
                  console.log("REPORT", report);
                  // append(report);
                }}
              >
                <IconRefresh className="mr-2" />
                Generate report
              </Button>
            </div>
          )}
        </div>
        <div className="px-4 py-2 space-y-4 border-t mt-3 shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            disabled={isFinished}
            onSubmit={async (value) => {
              await append({
                id,
                content: value,
                role: "user",
              });
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
