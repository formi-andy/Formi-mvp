"use client";

import { useLocalStorage } from "@mantine/hooks";
import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Radio, Tooltip } from "@mantine/core";
import { LuFlag } from "react-icons/lu";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";
import style from "./question.module.css";
import Link from "next/link";
import Image from "next/image";
import { ContainImage } from "@/components/ui/Image/Image";
import ReportQuestion from "./ReportQuestion";
import { r2WorkerEndpoints } from "@/utils/getEnvVars";
import * as amplitude from "@amplitude/analytics-browser";

export default function Question({
  question,
}: {
  question: {
    _id: Id<"practice_question">;
    question: string;
    questionImages: string[];
    choices: string[];
  };
}) {
  const [answer, setAnswer] = useState<string | undefined>(undefined);

  // TODO: for tutor mode
  //   const [explanation, setExplanation] = useState<{
  //     show: boolean;
  //     explanation: string[];
  //     explanationImages: string[];
  //     answer: string;
  //   }>({
  //     show: false,
  //     explanation: [],
  //     explanationImages: [],
  //     answer: "",
  //   });
  //   const [correct, setCorrect] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  //   const [showExplanationImages, setShowExplanationImages] = useState<
  //     Set<number>
  //   >(new Set<number>());
  const toast = useNetworkToasts();

  //   const checkAnswer = useAction(
  //     api.practice_question.checkPracticeQuestionAnswer
  //   );

  return (
    <div className="grid rounded-lg p-3 sm:p-6 gap-3 lg:gap-6 lg:max-w-2xl justify-self-center shadow-accent-2">
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="font-medium text-xl">Question</p>
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
                // disabled={correct !== undefined}
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
      {/* {explanation.answer !== "" && (
        <div>
          <p className="font-medium">Correct Answer</p>
          {explanation.answer}
        </div>
      )}
      {explanation.show && (
        <div className="flex flex-col gap-y-4">
          <p className="font-medium">Explanation</p>
          <div className="grid gap-y-2 mb-6">
            {explanation.explanation.map((paragraph, i) => {
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
          {explanation.explanationImages.length > 0 && (
            <>
              <p className="font-medium">Reference Images</p>
              <ul className="flex flex-col gap-3 mb-6 w-full">
                {explanation.explanationImages.map((image, i) => {
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
                explanationImages: res.explanationImages,
                answer: res.answer,
              });
              if (res.correct) {
                toast.success({
                  title: "Correct!",
                });
                setCorrect(true);
                amplitude.track("practice-question-correct", {
                  questionId: question._id,
                });
              } else {
                toast.error({
                  title: "Incorrect",
                  message: "Click Show Explanation for more details",
                });
                setCorrect(false);
                amplitude.track("practice-question-incorrect", {
                  questionId: question._id,
                });
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
              amplitude.track("practice-question-explanation-toggle", {
                questionId: question._id,
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
                explanationImages: [],
                answer: "",
              });
              setSeenQuestions([...seenQuestions, question._id]);
              amplitude.track("practice-question-session", {
                total_questions: seenQuestions.length + 1,
              });
            }}
          >
            Next
          </Button>
        </div>
      )} */}
      <ReportQuestion
        opened={open}
        setOpened={setOpen}
        questionId={question._id}
      />
    </div>
  );
}
