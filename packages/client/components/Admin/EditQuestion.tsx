"use client";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Switch, Textarea } from "@mantine/core";
import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { ConvexReactClient, useMutation } from "convex/react";
import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";
import Dropzone from "../ui/DropZone/DropZone";
import PendingImage from "../ui/Image/PendingImage";
import { LuCheck } from "react-icons/lu";
import { uploadFiles } from "@/utils/uploadFiles";
import { deleteFiles } from "@/utils/deleteFiles";
import { DropzoneData } from "@/types/dropzone-types";
import { removeFileExtensions } from "@/utils/removeFileExtensions";
import { r2WorkerEndpoints } from "@/utils/getEnvVars";
import { capitalize } from "lodash";

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
    explanationImages: string[];
  }>({
    id: "",
    question: "",
    choices: "",
    answer: "",
    explanation: "",
    summary: "",
    tags: "",
    questionImages: [],
    explanationImages: [],
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
  const [withId, setWithId] = useState(false);
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);
  const [newQuestionImages, setNewQuestionImages] = useState<DropzoneData>([]);
  const [newExplanationImages, setNewExplanationImages] =
    useState<DropzoneData>([]);
  const [removedQuestionImages, setRemovedQuestionImages] = useState<
    Set<string>
  >(new Set());
  const [removedExplanationImages, setRemovedExplanationImages] = useState<
    Set<string>
  >(new Set());

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
              label={capitalize(field)}
              autosize
              minRows={4}
              maxRows={6}
            />
          ))}
          <EditImages
            label="Question Images"
            images={question.questionImages}
            newImages={newQuestionImages}
            setNewImages={setNewQuestionImages}
            toRemove={removedQuestionImages}
            setToRemove={setRemovedQuestionImages}
          />
          <EditImages
            label="Explanation Images"
            images={question.explanationImages}
            newImages={newExplanationImages}
            setNewImages={setNewExplanationImages}
            toRemove={removedExplanationImages}
            setToRemove={setRemovedExplanationImages}
          />
        </>
      ) : (
        <div className="grid gap-y-3">
          <Textarea
            value={questionQuery}
            onChange={(e) => setQuestionQuery(e.currentTarget.value)}
            label={withId ? "Question ID" : "Question"}
            autosize
            minRows={4}
            maxRows={6}
          />
          <Switch
            checked={withId}
            onChange={() => setWithId((withId) => !withId)}
            label="Search by Question ID"
          />
        </div>
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
              explanationImages: [],
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
                await deleteFiles(Array.from(removedQuestionImages ?? []));
                await deleteFiles(Array.from(removedExplanationImages ?? []));

                // remove file extension from image titles
                const cleanedQuestionImages =
                  removeFileExtensions(newQuestionImages);
                const cleanedExplanationImages =
                  removeFileExtensions(newExplanationImages);

                // upload new images
                const newUploadedQuestionImagePaths = await uploadFiles(
                  cleanedQuestionImages
                );
                const newUploadedExplanationImagePaths = await uploadFiles(
                  cleanedExplanationImages
                );

                const newQuestionImagePaths = question.questionImages
                  .filter((image) => !removedQuestionImages?.has(image))
                  .concat(newUploadedQuestionImagePaths ?? []);

                const newExplanationImagePaths = question.explanationImages
                  .filter((image) => !removedExplanationImages?.has(image))
                  .concat(newUploadedExplanationImagePaths ?? []);

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
                  explanationImages: newExplanationImagePaths,
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
                  explanationImages: [],
                });
                setNewQuestionImages([]);
                setSearched(false);
                setNewExplanationImages([]);
                setRemovedQuestionImages(new Set());
                setRemovedExplanationImages(new Set());

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
                const question = await getQuestion(
                  trimmedQuestion,
                  convex,
                  withId
                );

                if (!question) {
                  throw new Error("Question not found");
                }

                setQuestion({
                  id: question._id,
                  question: question.question,
                  choices: question.choices.join(", "),
                  answer: question.answer,
                  explanation: question.explanation.join(", "),
                  summary: question.summary,
                  tags: question.tags.join(", "),
                  questionImages: question.question_images,
                  explanationImages: question.explanation_images,
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

type EditImagesProps = {
  label: string;
  images: string[];
  newImages: DropzoneData;
  setNewImages: Dispatch<SetStateAction<DropzoneData>>;
  toRemove: Set<string>;
  setToRemove: Dispatch<SetStateAction<Set<string>>>;
};

const EditImages = ({
  label,
  images,
  newImages,
  setNewImages,
  toRemove,
  setToRemove,
}: EditImagesProps) => {
  return (
    <>
      <p>{label}</p>
      <div className="flex gap-x-4">
        {images.map((image, index) => (
          <div className="flex flex-col gap-y-2 items-center" key={image}>
            <div className="relative flex h-[200px] w-[200px] justify-center mb-4">
              {toRemove?.has(image) ? (
                <PendingImage
                  url={`${r2WorkerEndpoints}/${image}`}
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
                  url={`${r2WorkerEndpoints}/${image}`}
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
      <p>Added {label}</p>
      {
        <div className="flex gap-x-4">
          {newImages.map((image, index) => (
            <div
              className="flex flex-col gap-y-2 items-center"
              key={image.file.name}
            >
              <div className="relative flex h-[200px] w-[200px] justify-center mb-4">
                <PendingImage
                  url={URL.createObjectURL(image.file)}
                  alt={`Question Image ${index}`}
                  onIconClick={() => {
                    const filteredImages = [...newImages];
                    filteredImages.splice(index, 1);
                    setNewImages(filteredImages);
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
          data={newImages}
          setData={setNewImages}
          borderColor="border-black"
          textColor="text-black"
        />
      </div>
    </>
  );
};

const getQuestion = async (
  question: string,
  convex: ConvexReactClient,
  withId: boolean
) => {
  const trimmedQuestion = question.trim();
  if (withId) {
    const questionData = await convex.query(
      api.practice_question.getPracticeQuestionWithTags,
      {
        practiceQuestionId: trimmedQuestion as Id<"practice_question">,
      }
    );

    return questionData;
  }
  const questionData = await convex.query(
    api.practice_question.getPracticeQuestionByQuestion,
    {
      question: trimmedQuestion,
    }
  );

  return questionData;
};
