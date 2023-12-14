"use client";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Textarea } from "@mantine/core";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";

export default function AddQuestion() {
  const createQuestion = useMutation(
    api.practice_questions.createPracticeQuestion
  );
  const [question, setQuestion] = useState("");
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);

  return (
    <div className="border rounded-lg flex flex-col gap-y-4 p-4 max-w-2xl w-full">
      Add Practice Question
      <Textarea
        value={question}
        onChange={(e) => setQuestion(e.currentTarget.value)}
        label="Question"
        autosize
        minRows={10}
        maxRows={20}
      />
      <Button
        onClick={async () => {
          setLoading(true);
          // serialize the question
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

            await createQuestion({
              question: serializedQuestion.question,
              choices: serializedQuestion.choices,
              answer: serializedQuestion.answer,
              explanation: serializedQuestion.explanation,
              summary: serializedQuestion.summary,
              tags: serializedQuestion.tags,
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
