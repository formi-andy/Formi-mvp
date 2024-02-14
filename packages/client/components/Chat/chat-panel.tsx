import { useEffect, useState } from "react";
import { type UseChatHelpers } from "ai/react";
import useNetworkToasts from "@/hooks/useNetworkToasts";

// import { shareChat } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { PromptForm } from "@/components/Chat/prompt-form";
import { ButtonScrollToBottom } from "@/components/Chat/button-scroll-to-bottom";
import {
  IconArrowElbow,
  IconRefresh,
  IconShare,
  IconStop,
} from "@/components/ui/icons";
import { ChatShareDialog } from "@/components/Chat/chat-share-dialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ReportForm from "./report-form";
import FinishedForm from "./finished-form";

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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [reportContent, setReportContent] = useState<string>("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const toast = useNetworkToasts();

  const isFinished =
    messages?.[messages.length - 1]?.content.includes(
      "Thank you for using Formi."
    ) && messages?.[messages.length - 1]?.role === "assistant";

  // get report
  const report = useQuery(
    api.chat.getReportByChat,
    isFinished
      ? {
          chat_id: id as Id<"chat">,
        }
      : "skip"
  );

  useEffect(() => {
    if (report) {
      setReportContent(report.content);
    }
  }, [report]);

  return (
    <div className="fixed inset-x-0 bottom-0 w-full animate-in duration-300 ease-in-out peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom />
      <div className="flex flex-col gap-y-2 mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-12">
          {isFinished && report === null && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={generatingReport}
                onClick={async () => {
                  try {
                    setGeneratingReport(true);
                    toast.loading({
                      title: "Generating report",
                      message: "Please wait",
                    });
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
                  } catch (e) {
                    console.error(e);
                    toast.error({
                      title: "Failed to generate report",
                      message: "Please try again later",
                    });
                  } finally {
                    toast.success({
                      title: "Report generated",
                    });
                    setGeneratingReport(false);
                  }
                }}
              >
                <IconRefresh className="mr-2" />
                Generate report
              </Button>
            </div>
          )}
        </div>
        <div className="px-4 py-2 space-y-4 border-t mt-3 shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          {report ? (
            <FinishedForm
              report={report}
              reportContent={reportContent}
              setReportContent={setReportContent}
            />
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
