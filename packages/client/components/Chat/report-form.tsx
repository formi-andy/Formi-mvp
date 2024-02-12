import React, { Dispatch, SetStateAction, useState } from "react";
import Textarea from "react-textarea-autosize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import useNetworkToasts from "@/hooks/useNetworkToasts";

export default function ReportForm({
  report,
  reportContent,
  setReportContent,
}: {
  report: Doc<"report">;
  reportContent: string;
  setReportContent: Dispatch<SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);
  const sendReport = useMutation(api.chat.sendReport);
  const toast = useNetworkToasts();

  return (
    <>
      <div
        className="relative flex flex-col w-full pr-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:pr-12"
        style={{
          opacity: report.sent ? 0.75 : 1,
        }}
      >
        <Textarea
          disabled={loading || report.sent}
          tabIndex={0}
          rows={3}
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
          placeholder="The report"
          spellCheck={false}
          className="min-h-[60px] w-[calc(100%_-_16px)] resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-[calc(50%_-_20px)] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={loading || reportContent === "" || report.sent}
                onClick={async () => {
                  try {
                    setLoading(true);
                    toast.loading({
                      title: "Sending report",
                      message: "Please wait",
                    });
                    await sendReport({
                      id: report._id,
                      content: reportContent,
                    });
                  } catch (e) {
                    console.error(e);
                    toast.error({
                      title: "Failed to send report",
                      message: "Please try again later",
                    });
                  } finally {
                    setLoading(false);
                    toast.success({
                      title: "Report sent",
                      message: "Your doctor will be notified",
                    });
                  }
                }}
              >
                <FiSend size={16} />
                <span className="sr-only">Send to Doctor</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send to Doctor</TooltipContent>
          </Tooltip>
        </div>
      </div>
      {report.sent && (
        <div className="text-sm">
          Report sent to your doctor!
        </div>
      )}
    </>
  );
}
