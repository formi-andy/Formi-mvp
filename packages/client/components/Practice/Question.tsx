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
import style from "../Dashboard/doctorgallery.module.css";

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
    answer: string;
  }>({
    show: false,
    explanation: [],
    answer: "",
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
    return (
      <div className="lg:max-w-2xl flex flex-col justify-self-center border rounded-lg p-3 sm:p-6 gap-3 lg:gap-6 h-[40vh] w-full">
        All questions have been answered 😎
      </div>
    );
  }

  if (question === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid rounded-lg p-3 sm:p-6 gap-3 lg:gap-6 lg:max-w-2xl justify-self-center shadow-accent-2">
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
                disabled={correct !== undefined}
                key={i}
                value={answer}
                label={answer}
                classNames={{
                  radio: "cursor-pointer",
                  label: "cursor-pointer data-[disabled]:text-neutral-500",
                }}
              />
            );
          })}
        </div>
      </Radio.Group>
      <div>
        <p className="font-medium">Correct Answer</p>
        {explanation.answer}
      </div>
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
                answer: res.answer,
              });
              if (res.correct) {
                toast.success({
                  title: "Correct!",
                });
                setCorrect(true);
              } else {
                toast.error({
                  title: "Incorrect",
                  message: "Click Show Explanation for more details",
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
            className="w-full border-primary/10"
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
                answer: "",
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
