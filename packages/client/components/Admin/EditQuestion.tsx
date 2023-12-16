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
import Dropzone from "../ui/DropZone/DropZone";
import PendingImage from "../ui/Image/PendingImage";
import { LuCheck } from "react-icons/lu";
import { uploadFiles } from "@/utils/uploadFiles";
import { deleteFiles } from "@/utils/deleteFiles";

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
    questionImages: string[];
  }>({
    id: "",
    question: "",
    choices: "",
    answer: "",
    explanation: "",
    summary: "",
    tags: "",
    questionImages: [],
  });

  const fields = [
    "question",
    "choices",
    "answer",
    "explanation",
    "summary",
    "tags",
  ];

  const [searched, setSearched] = useState(false);
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);
  const [newQuestionImages, setNewQuestionImages] = useState<
    {
      file: File;
      title: string;
    }[]
  >([]);
  const [toRemove, setToRemove] = useState<Set<string>>();

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
          {fields.map((field) => (
            <Textarea
              key={field}
              value={question[field]}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  [field]: e.currentTarget.value,
                })
              }
              label={field}
              autosize
              minRows={4}
              maxRows={6}
            />
          ))}
          <p>Question Images</p>
          <div className="flex gap-x-4">
            {question.questionImages.map((image, index) => (
              <div className="flex flex-col gap-y-2 items-center" key={image}>
                <div className="relative flex h-[200px] w-[200px] justify-center mb-4">
                  {toRemove?.has(image) ? (
                    <PendingImage
                      url={`https://worker-solitary-lake-0d03.james-0da.workers.dev/${image}`}
                      alt={`Question Image ${index}`}
                      icon={<LuCheck size={20} />}
                      onIconClick={() => {
                        setToRemove((toRemove) => {
                          const newToRemove = new Set(toRemove);
                          newToRemove.delete(image);
                          return newToRemove;
                        });
                      }}
                      overLay={
                        <div className="absolute inset-0 bg-black opacity-50 z-10 flex items-center justify-center rounded-lg">
                          <p className="text-white">Will be removed</p>
                        </div>
                      }
                    />
                  ) : (
                    <PendingImage
                      url={`https://worker-solitary-lake-0d03.james-0da.workers.dev/${image}`}
                      alt={`Question Image ${index}`}
                      onIconClick={() => {
                        setToRemove((toRemove) => {
                          const newToRemove = new Set(toRemove);
                          newToRemove.add(image);
                          return newToRemove;
                        });
                      }}
                    />
                  )}
                </div>
                <p className="truncate max-w-[200px]">{image}</p>
              </div>
            ))}
          </div>
          <p>Added Images</p>
          {
            <div className="flex gap-x-4">
              {newQuestionImages.map((image, index) => (
                <div
                  className="flex flex-col gap-y-2 items-center"
                  key={image.file.name}
                >
                  <div className="relative flex h-[200px] w-[200px] justify-center mb-4">
                    <PendingImage
                      url={URL.createObjectURL(image.file)}
                      alt={`Question Image ${index}`}
                      onIconClick={() => {
                        const newImages = [...newQuestionImages];
                        newImages.splice(index, 1);
                        setNewQuestionImages(newImages);
                      }}
                    />
                  </div>
                  <p className="truncate max-w-[200px]">{image.file.name}</p>
                </div>
              ))}
            </div>
          }
          <div className="flex flex-col gap-6 p-8 rounded-lg items-center w-full">
            <Dropzone
              data={newQuestionImages}
              setData={setNewQuestionImages}
              borderColor="border-black"
              textColor="text-black"
            />
          </div>
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
              questionImages: [],
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
              toast.loading({
                title: "Loading",
                message: "Updating Question",
              });
              try {
                // remove images
                await deleteFiles(Array.from(toRemove ?? []));

                // upload new images
                const newPaths = await uploadFiles(newQuestionImages);

                const newQuestionImagePaths = question.questionImages
                  .filter((image) => !toRemove?.has(image))
                  .concat(newPaths ?? []);

                // serialize the question
                await updateQuestion({
                  id: question.id as Id<"practice_question">,
                  question: question.question,
                  choices: question.choices.split(", "),
                  answer: question.answer,
                  explanation: question.explanation.split(", "),
                  summary: question.summary,
                  tags: question.tags.split(", "),
                  questionImages: newQuestionImagePaths,
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
                  questionImages: [],
                });
                setNewQuestionImages([]);
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
                  questionImages: question.question_images,
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
