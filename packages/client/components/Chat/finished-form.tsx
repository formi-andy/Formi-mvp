"use client";

import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { jsPDF } from "jspdf";
import { LuEye } from "react-icons/lu";
import { Doc } from "@/convex/_generated/dataModel";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function FinishedForm({
  report,
  reportContent,
  setReportContent,
}: {
  report: Doc<"report">;
  reportContent: string;
  setReportContent: Dispatch<SetStateAction<string>>;
}) {
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);
  const sendReport = useMutation(api.chat.sendReport);

  return (
    <div className="flex justify-center gap-x-8 relative">
      <Button
        type="submit"
        onClick={() => {
          let document = new jsPDF();
          const pageHeight = document.internal.pageSize.height - 20;

          document.setFont("helvetica", "bold");
          document.setFontSize(18);
          document.text(
            "Patient Symptom Summary and Medical History Report",
            10,
            20
          );
          const splitText = reportContent.split("\n");
          let pageY = 30;

          splitText.forEach((item, index) => {
            // trim whitespace
            item = item.trim();

            let marginBottom = 10;

            // add text to document
            if (item.startsWith("**")) {
              document.setFont("helvetica", "bold");
              document.setFontSize(14);

              // remove bold markdown
              item = item.replace(/\*\*/g, "");

              marginBottom = 7;

              // spacing up top
              pageY += 5;
            } else if (item.startsWith("-")) {
              document.setFont("helvetica", "normal");
              document.setFontSize(14);
              marginBottom = 5;
            } else {
              document.setFont("helvetica", "normal");
              document.setFontSize(14);
              marginBottom = 5;
            }

            // wrap text
            const splitText = document.splitTextToSize(item, 180);

            // add text to document
            splitText.forEach((line: string) => {
              if (pageY + marginBottom > pageHeight) {
                document.addPage();
                pageY = 20;
                document.text(line, 10, pageY);
                pageY += marginBottom;
              } else {
                document.text(line, 10, pageY);
                pageY += marginBottom;
              }
            });
          });

          window.open(URL.createObjectURL(document.output("blob")));
        }}
      >
        <div className="flex gap-x-4 items-center">
          <p>View Generated Form</p>
          <LuEye size={16} />
        </div>
      </Button>
      <Button
        type="submit"
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
        <div className="flex gap-x-4 items-center">
          <p>Send to Doctor</p>
          <FiSend size={16} />
        </div>
      </Button>
      {report.sent && (
        <div className="text-sm">Report sent to your doctor!</div>
      )}
    </div>
  );
}
