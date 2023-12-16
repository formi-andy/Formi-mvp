"use client";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Textarea } from "@mantine/core";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import Dropzone from "@/components/ui/DropZone/DropZone";
import AcceptedFiles from "@/components/ui/DropZone/AcceptedFiles";
import { uploadFiles } from "@/utils/uploadFiles";

export default function AddQuestion() {
  const createQuestion = useMutation(
    api.practice_question.createPracticeQuestion
  );
  const [question, setQuestion] = useState("");
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState<
    {
      file: File;
      title: string;
    }[]
  >([]);

  return (
    <div className="border rounded-lg flex flex-col gap-y-4 p-4 w-full">
      <p className="text-lg font-medium">Enter the question in JSON format</p>
      <Textarea
        value={question}
        onChange={(e) => setQuestion(e.currentTarget.value)}
        label="Question"
        autosize
        minRows={10}
        maxRows={20}
      />
      <p>Question Images</p>
      <div className="flex flex-col gap-6 p-8 rounded-lg items-center bg-formiblue w-full">
        <Dropzone data={uploadData} setData={setUploadData} />
        <div className="w-full">
          <AcceptedFiles
            data={uploadData}
            setData={(data) => {
              setUploadData(data);
            }}
          />
        </div>
      </div>

      <Button
        onClick={async () => {
          setLoading(true);
          // serialize the question
          toast.loading({
            title: "Loading",
            message: "Adding Question",
          });

          try {
            let trimmedQuestion = question.trim();
            // remove all new lines
            trimmedQuestion = trimmedQuestion.replace(/\n/g, "");
            // remove all white space between quotes
            trimmedQuestion = trimmedQuestion.replace(
              /"([^"]+)"/g,
              function (match, p1) {
                return `"${p1.replace(/\s/g, "")}"`;
              }
            );
            // replace “ and ” with "
            trimmedQuestion = trimmedQuestion.replace(/“/g, '"');
            trimmedQuestion = trimmedQuestion.replace(/”/g, '"');

            const serializedQuestion = JSON.parse(trimmedQuestion);
            if (
              !(
                "question" in serializedQuestion &&
                "choices" in serializedQuestion &&
                "answer" in serializedQuestion &&
                "explanation" in serializedQuestion &&
                "summary" in serializedQuestion &&
                "tags" in serializedQuestion
              )
            ) {
              throw new Error("Not all fields are present");
            }
            if (
              !(
                typeof serializedQuestion.question === "string" &&
                Array.isArray(serializedQuestion.choices) &&
                typeof serializedQuestion.answer === "string" &&
                Array.isArray(serializedQuestion.explanation) &&
                typeof serializedQuestion.summary === "string" &&
                Array.isArray(serializedQuestion.tags)
              )
            ) {
              throw new Error("Invalid Format");
            }

            const paths = await uploadFiles(uploadData, toast);

            await createQuestion({
              question: serializedQuestion.question,
              choices: serializedQuestion.choices,
              answer: serializedQuestion.answer,
              explanation: serializedQuestion.explanation,
              summary: serializedQuestion.summary,
              tags: serializedQuestion.tags,
              questionImages: paths as string[],
            });

            toast.loading({
              title: "Creating question",
              message: "Please wait",
            });

            toast.success({
              title: "Success",
              message: "Question Added",
            });
          } catch (e) {
            let message = "Check your JSON";
            if (e instanceof Error) {
              message = e.message;
            }
            if (e instanceof ConvexError) {
              message = e.data.message;
            }

            toast.error({
              title: "Error",
              message,
            });
          } finally {
            setLoading(false);
          }
        }}
        disabled={question.length === 0 || loading}
      >
        Submit
      </Button>
    </div>
  );
}
