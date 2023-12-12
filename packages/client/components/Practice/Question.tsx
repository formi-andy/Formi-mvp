"use client";

import { useLocalStorage } from "@mantine/hooks";
import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Radio } from "@mantine/core";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";

export default function Question({ hash }: { hash: string }) {
  const [seenQuestions, setSeenQuestions] = useState<string[]>([]);
  const [tags, setTags] = useLocalStorage<string[]>({
    key: "practice-tags",
    defaultValue: undefined,
  });
  const [answer, setAnswer] = useState<string | undefined>(undefined);
  const [explanation, setExplanation] = useState<{
    show: boolean;
    explanation: string[];
  }>({
    show: false,
    explanation: [],
  });
  const [correct, setCorrect] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const toast = useNetworkToasts();

  const question = useQuery(api.practice_questions.getRandomPracticeQuestion, {
    hash,
    tags,
    seenQuestions: seenQuestions as Id<"practice_questions">[],
  });
  const checkAnswer = useAction(
    api.practice_questions.checkPracticeQuestionAnswer
  );

  if (question === null) {
    return <p>All questions answered</p>;
  }

  if (question === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid border rounded-lg p-3 sm:p-6 gap-3 lg:gap-6">
      <div>
        <p className="font-medium">Question</p>
        {question.question ?? "Loading..."}
      </div>
      <Radio.Group
        required
        value={answer}
        onChange={(event) => {
          setAnswer(event);
        }}
        className="mb-6"
      >
        <div className="grid gap-3">
          {question.choices.map((answer, i) => {
            return (
              <Radio
                key={i}
                value={answer}
                label={answer}
                classNames={{
                  radio: "cursor-pointer",
                  label: "cursor-pointer",
                }}
              />
            );
          })}
        </div>
      </Radio.Group>
      {explanation.show && (
        <div>
          <p className="font-medium">Explanation</p>
          <div className="grid gap-y-2 mb-6">
            {explanation.explanation.map((paragraph, i) => {
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
        </div>
      )}
      {correct === undefined ? (
        <Button
          disabled={answer === undefined || loading}
          variant="action"
          onClick={async () => {
            if (answer === undefined) {
              return;
            }

            setLoading(true);
            try {
              toast.loading({
                title: "Checking answer...",
              });
              const res = await checkAnswer({
                practiceQuestionId: question._id,
                answer,
              });

              setExplanation({
                ...explanation,
                explanation: res.explanation,
              });
              if (res.correct) {
                toast.success({
                  title: "Correct!",
                });
                setCorrect(true);
              } else {
                toast.error({
                  title: "Incorrect",
                  message: "",
                });
                setCorrect(false);
              }
            } catch (e) {
              toast.error({
                title: "Error",
                message:
                  e instanceof ConvexError
                    ? (e.data as { message: string }).message
                    : undefined,
              });
            } finally {
              setLoading(false);
            }
          }}
        >
          Submit
        </Button>
      ) : (
        <div className="flex gap-x-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setExplanation({
                ...explanation,
                show: !explanation.show,
              });
            }}
          >
            {explanation.show ? "Hide" : "Show"} Explanation
          </Button>
          <Button
            variant="action"
            className="w-full"
            onClick={() => {
              setAnswer(undefined);
              setCorrect(undefined);
              setExplanation({
                show: false,
                explanation: [],
              });
              setSeenQuestions([...seenQuestions, question._id]);
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
