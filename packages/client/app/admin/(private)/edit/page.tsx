"use client";

import { useState } from "react";
import { TextInput, Textarea } from "@mantine/core";
import { Button } from "@/components/ui/button";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useMutation, useQuery } from "convex/react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { PracticeQuestion } from "@/types/practice-question-types";

const EditPage = () => {
  const updateQuestion = useMutation(
    api.practice_questions.updatePracticeQuestion
  );
  // await convex.query(api.functions.myQuery)
  const [questionQuery, setQuestionQuery] = useState("");
  const [question, setQuestion] = useState<PracticeQuestion>();
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);
  const convex = useConvex();

  return (
    <div className="flex flex-col gap-y-4 min-h-screen items-center justify-center">
      <p> Edit Practice Question</p>
      <div className="border rounded-lg flex flex-col gap-y-4 p-4 max-w-2xl w-full">
        Search for Question
        <Textarea
          value={questionQuery}
          onChange={(e) => setQuestionQuery(e.currentTarget.value)}
          label="Question Text (from JSON field)"
          autosize
          minRows={10}
          maxRows={20}
        />
      </div>
      <div className="border rounded-lg flex flex-col gap-y-4 p-4 max-w-2xl w-full">
        <Button
          onClick={async () => {
            const questionResponse = await convex.query(
              api.practice_questions.getPracticeQuestionByQuestion,
              {
                question: questionQuery,
              }
            );

            if (!questionResponse) {
              toast.error({
                title: "Error",
                message: "Question not found",
              });
              return;
            }
            setQuestion(questionResponse);
          }}
        >
          Search
        </Button>
        {question && (
          <div>
            <p>Question</p>
            <TextInput
              value={question.question}
              onChange={(e) =>
                setQuestion({ ...question, question: e.currentTarget.value })
              }
            />
            <p>Choices</p>
            <TextInput
              value={question.choices}
              onChange={(e) =>
                setQuestion({ ...question, choices: e.currentTarget.value })
              }
            />
            <p>Answer</p>
            <TextInput
              value={question.answer}
              onChange={(e) =>
                setQuestion({ ...question, answer: e.currentTarget.value })
              }
            />
            <p>Explanation</p>
            <TextInput
              value={question.explanation}
              onChange={(e) =>
                setQuestion({ ...question, explanation: e.currentTarget.value })
              }
            />
            <p>Summary</p>
            <TextInput
              value={question.summary}
              onChange={(e) =>
                setQuestion({ ...question, summary: e.currentTarget.value })
              }
            />
            <p>Tags</p>
            <TextInput
              value={question.tags}
              onChange={(e) =>
                setQuestion({ ...question, tags: e.currentTarget.value })
              }
            />
          </div>
        )}
        {/* <Button
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
        </Button> */}
      </div>
    </div>
  );
};

export default EditPage;
