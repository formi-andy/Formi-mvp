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
  // report: any; // uncomment to test w/ temp text to save time
  reportContent: string;
  setReportContent: Dispatch<SetStateAction<string>>;
}) {
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);
  const sendReport = useMutation(api.chat.sendReport);

  const temp = `**Patient Symptoms:**
  - The patient is experiencing severe wrist pain, which is constant and significantly impairs their ability to use their hand for daily activities.
  
  **Medical History:**
  - The patient has a history of injuring their wrist while skateboarding, which may be related to the current symptoms.
  - No other relevant medical history or medication use has been reported.
  
  **Lifestyle and Additional Information:**
  - The wrist pain is accompanied by swelling in the affected area.
  
  **Conclusion and Recommendations:**
  Given the severity of the pain, the history of injury, and the presence of swelling, it is recommended that the patient seek medical attention promptly for a comprehensive examination and potential imaging to assess the extent of the injury and formulate an appropriate treatment plan. This approach aims to address any potential fractures, ligament damage, or other significant issues that may be contributing to the wrist pain.
  
  **Conclusion and Recommendations:**
  Given the severity of the pain, the history of injury, and the presence of swelling, it is recommended that the patient seek medical attention promptly for a comprehensive examination and potential imaging to assess the extent of the injury and formulate an appropriate treatment plan. This approach aims to address any potential fractures, ligament damage, or other significant issues that may be contributing to the wrist pain.

  **Conclusion and Recommendations:**
  Given the severity of the pain, the history of injury, and the presence of swelling, it is recommended that the patient seek medical attention promptly for a comprehensive examination and potential imaging to assess the extent of the injury and formulate an appropriate treatment plan. This approach aims to address any potential fractures, ligament damage, or other significant issues that may be contributing to the wrist pain.
  
  **Conclusion and Recommendations:**
  Given the severity of the pain, the history of injury, and the presence of swelling, it is recommended that the patient seek medical attention promptly for a comprehensive examination and potential imaging to assess the extent of the injury and formulate an appropriate treatment plan. This approach aims to address any potential fractures, ligament damage, or other significant issues that may be contributing to the wrist pain.

  **Conclusion and Recommendations:**
  Given the severity of the pain, the history of injury, and the presence of swelling, it is recommended that the patient seek medical attention promptly for a comprehensive examination and potential imaging to assess the extent of the injury and formulate an appropriate treatment plan. This approach aims to address any potential fractures, ligament damage, or other significant issues that may be contributing to the wrist pain.
  `;

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
          const splitText = temp.split("\n");
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
