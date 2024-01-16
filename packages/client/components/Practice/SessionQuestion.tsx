"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Radio, Tooltip } from "@mantine/core";
import { LuFlag } from "react-icons/lu";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ContainImage } from "@/components/ui/Image/Image";
import ReportQuestion from "./ReportQuestion";
import { r2WorkerEndpoints } from "@/utils/getEnvVars";
import { ConvexError } from "convex/values";

export default function SessionQuestion({
  session_id,
  question,
  questionNumber,
  isLast,
  nextQuestion,
}: {
  session_id: Id<"practice_session">;
  questionNumber: number;
  question: {
    questionImages: string[];
    response?: string | undefined;
    correct?: boolean | undefined;
    question: string;
    id: Id<"practice_question">;
    choices: string[];
    time: number;
  };
  isLast: boolean;
  nextQuestion: () => void;
}) {
  const [answer, setAnswer] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const toast = useNetworkToasts();

  useEffect(() => {
    setAnswer(question.response);
  }, [question.response]);

  const gradeSession = useMutation(api.practice_session.gradeSession);
  const saveAnswer = useMutation(api.practice_session.saveAnswer);

  return (
    <div className="grid rounded-lg p-3 sm:p-6 gap-3 lg:gap-6 justify-self-center">
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="font-medium text-xl">Question {questionNumber}</p>
          <Tooltip label="Report Question">
            <Button
              size="icon"
              variant="outline-danger"
              onClick={() => setOpen(true)}
            >
              <LuFlag />
            </Button>
          </Tooltip>
        </div>
        {question.question}
        {question.questionImages.length > 0 && (
          <div className="grid gap-3 my-6">
            {question.questionImages.map((image, i) => {
              return (
                <div
                  key={image}
                  className="flex w-full rounded-lg relative aspect-square max-h-[50vh] min-w-[200px]"
                >
                  <ContainImage
                    url={`${r2WorkerEndpoints}/${image}`}
                    alt={`Question Image ${i}`}
                  />
                </div>
              );
            })}
          </div>
        )}
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
                disabled={loading || question.correct !== undefined}
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
      <div className="flex gap-x-4">
        <Button
          variant="action"
          className="w-full"
          onClick={async () => {
            if (isLast) {
              try {
                setLoading(true);
                toast.loading({
                  title: "Checking responses",
                  message: "Please wait",
                });
                await gradeSession({
                  session_id,
                  last_question: {
                    id: question.id,
                    response: answer,
                    time: 0,
                  },
                });

                toast.success({
                  title: "Session completed",
                  message: "You can now view your results",
                });
              } catch (error) {
                toast.error({
                  title: "Error checking responses",
                  message:
                    error instanceof ConvexError
                      ? (error.data as { message: string }).message
                      : undefined,
                });
              }
            } else {
              saveAnswer({
                session_id,
                question: {
                  id: question.id,
                  response: answer,
                  time: 0,
                },
              });
              nextQuestion();
            }
          }}
        >
          {isLast ? "Submit" : "Next"}
        </Button>
      </div>
      <ReportQuestion
        opened={open}
        setOpened={setOpen}
        questionId={question.id}
      />
    </div>
  );
}
