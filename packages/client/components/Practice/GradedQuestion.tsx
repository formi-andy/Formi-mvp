"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Radio, ScrollArea, Tooltip } from "@mantine/core";
import { LuFlag } from "react-icons/lu";

import { ContainImage } from "@/components/ui/Image/Image";
import ReportQuestion from "./ReportQuestion";
import { r2WorkerEndpoints } from "@/utils/getEnvVars";
import * as amplitude from "@amplitude/analytics-browser";
import Link from "next/link";

export default function GradedQuestion({
  question,
  questionNumber,
  nextQuestion,
  isLast,
  session_id,
}: {
  session_id: Id<"practice_session">;
  questionNumber: number;
  question: {
    questionImages: string[];
    response?: string;
    correct?: boolean;
    question: string;
    id: Id<"practice_question">;
    choices: string[];
    time: number;
    explanation: string[];
    explanationImages: string[];
    answer: string;
  };
  isLast: boolean;
  nextQuestion: () => void;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [open, setOpen] = useState(false);
  const [showExplanationImages, setShowExplanationImages] = useState<
    Set<number>
  >(new Set<number>());

  return (
    <ScrollArea scrollbars="y" h={"calc(100vh - 64px)"}>
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
        <Radio.Group required value={question.response} className="mb-6">
          <div className="grid gap-3">
            {question.choices.map((answer, i) => {
              return (
                <Radio
                  disabled
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
          {question.answer}
        </div>
        {showExplanation && (
          <div className="flex flex-col gap-y-4">
            <p className="font-medium">Explanation</p>
            <div className="grid gap-y-2 mb-6">
              {question.explanation.map((paragraph, i) => {
                return <p key={i}>{paragraph}</p>;
              })}
            </div>
            {question.explanationImages.length > 0 && (
              <>
                <p className="font-medium">Reference Images</p>
                <ul className="flex flex-col gap-3 mb-6 w-full">
                  {question.explanationImages.map((image, i) => {
                    return (
                      <li key={image} className="w-full list-none">
                        <Button
                          variant="link"
                          className="text-lg px-0"
                          onClick={() =>
                            setShowExplanationImages(() => {
                              const newSet = new Set(showExplanationImages);
                              if (newSet.has(i)) {
                                newSet.delete(i);
                              } else {
                                newSet.add(i);
                              }
                              return newSet;
                            })
                          }
                        >
                          <p>
                            {image
                              .split("___")
                              .slice(1)
                              .join("___")
                              .replace(/_/g, " ")}
                          </p>
                        </Button>
                        {showExplanationImages.has(i) && (
                          <div className="flex w-full rounded-lg relative aspect-square max-h-[50vh] min-w-[200px] mt-4 bg-transparent border">
                            <ContainImage
                              url={`${r2WorkerEndpoints}/${image}`}
                              alt={`Question Image ${i}`}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        )}
        <div className="flex gap-x-4">
          <Button
            variant="outline"
            className="w-full border-primary/10"
            onClick={() => {
              setShowExplanation(!showExplanation);
              amplitude.track("practice-question-explanation-toggle", {
                questionId: question.id,
                show: !showExplanation,
              });
            }}
          >
            {showExplanation ? "Hide" : "Show"} Explanation
          </Button>
          {isLast ? (
            <Link href="/dashboard" className="w-full">
              <Button variant="action" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          ) : (
            <Button
              variant="action"
              className="w-full"
              onClick={() => {
                setShowExplanation(false);
                nextQuestion();
              }}
            >
              Next
            </Button>
          )}
        </div>
        <ReportQuestion
          opened={open}
          setOpened={setOpen}
          questionId={question.id}
        />
      </div>
    </ScrollArea>
  );
}
