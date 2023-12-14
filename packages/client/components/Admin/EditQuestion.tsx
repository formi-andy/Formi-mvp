"use client";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Textarea } from "@mantine/core";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";

export default function EditQuestion() {
  const updateQuestion = useMutation(
    api.practice_question.updatePracticeQuestion
  );
  const convex = useConvex();

  const [questionQuery, setQuestionQuery] = useState("");
  const [question, setQuestion] = useState<{
    id: string;
    question: string;
    choices: string;
    answer: string;
    explanation: string;
    summary: string;
    tags: string;
  }>({
    id: "",
    question: "",
    choices: "",
    answer: "",
    explanation: "",
    summary: "",
    tags: "",
  });
  const [searched, setSearched] = useState(false);
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);

  return (
    <div className="border rounded-lg flex flex-col gap-y-4 p-4 w-full">
      <p className="text-lg font-medium">
        Do not include quotations in the fields
        <br />
        For choices, explanation, and tags do not include the square brackets.
        Each of these fields should be separated by a comma and a space
      </p>
      {searched ? (
        <>
          <Textarea
            value={question.question}
            onChange={(e) =>
              setQuestion({ ...question, question: e.currentTarget.value })
            }
            label="Question"
            autosize
            minRows={4}
            maxRows={6}
          />
          <Textarea
            value={question.choices}
            onChange={(e) =>
              setQuestion({ ...question, choices: e.currentTarget.value })
            }
            label="Choices"
            autosize
            minRows={4}
            maxRows={6}
          />
          <Textarea
            value={question.answer}
            onChange={(e) =>
              setQuestion({ ...question, answer: e.currentTarget.value })
            }
            label="Answer"
            autosize
            minRows={4}
            maxRows={6}
          />
          <Textarea
            value={question.explanation}
            onChange={(e) =>
              setQuestion({ ...question, explanation: e.currentTarget.value })
            }
            label="Explanation"
            autosize
            minRows={4}
            maxRows={6}
          />
          <Textarea
            value={question.summary}
            onChange={(e) =>
              setQuestion({ ...question, summary: e.currentTarget.value })
            }
            label="Summary"
            autosize
            minRows={4}
            maxRows={6}
          />
          <Textarea
            value={question.tags}
            onChange={(e) =>
              setQuestion({ ...question, tags: e.currentTarget.value })
            }
            label="Tags"
            autosize
            minRows={4}
            maxRows={6}
          />
        </>
      ) : (
        <Textarea
          value={questionQuery}
          onChange={(e) => setQuestionQuery(e.currentTarget.value)}
          label="Question"
          autosize
          minRows={4}
          maxRows={6}
        />
      )}
      <div className="flex gap-x-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            setQuestionQuery("");
            setQuestion({
              id: "",
              question: "",
              choices: "",
              answer: "",
              explanation: "",
              summary: "",
              tags: "",
            });
            setSearched(false);
          }}
          disabled={loading}
        >
          Reset
        </Button>
        {searched ? (
          <Button
            className="w-full"
            onClick={async () => {
              setLoading(true);
              try {
                // serialize the question
                await updateQuestion({
                  id: question.id as Id<"practice_question">,
                  question: question.question,
                  choices: question.choices.split(", "),
                  answer: question.answer,
                  explanation: question.explanation.split(", "),
                  summary: question.summary,
                  tags: question.tags.split(", "),
                });
                setQuestionQuery("");
                setQuestion({
                  id: "",
                  question: "",
                  choices: "",
                  answer: "",
                  explanation: "",
                  summary: "",
                  tags: "",
                });
                setSearched(false);

                toast.success({
                  title: "Success",
                  message: "Question saved",
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
          >
            Save
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={async () => {
              setLoading(true);
              try {
                const trimmedQuestion = questionQuery.trim();
                const question = await convex.query(
                  api.practice_question.getPracticeQuestionByQuestion,
                  {
                    question: trimmedQuestion,
                  }
                );

                setQuestion({
                  id: question._id,
                  question: question.question,
                  choices: question.choices.join(", "),
                  answer: question.answer,
                  explanation: question.explanation.join(", "),
                  summary: question.summary,
                  tags: question.tags.join(", "),
                });
                setSearched(true);

                toast.success({
                  title: "Success",
                  message: "Question found",
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
            disabled={questionQuery.length === 0 || loading}
          >
            Search
          </Button>
        )}
      </div>
    </div>
  );
}
