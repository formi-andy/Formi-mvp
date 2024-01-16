"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useQuery } from "convex/react";
import { useState } from "react";
import NotFoundPage from "@/app/not-found";

import AppLoader from "@/components/Loaders/AppLoader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import SessionQuestion from "@/components/Practice/SessionQuestion";
import { LuCheck, LuX } from "react-icons/lu";
import { SessionStatus } from "@/types/practice-session-types";
import GradedQuestion from "@/components/Practice/GradedQuestion";

function renderCorrect(correct: boolean | undefined, isSelected: boolean) {
  if (correct === undefined) {
    return null;
  }

  return correct ? (
    <LuCheck className={isSelected ? "text-white" : "text-green-500"} />
  ) : (
    <LuX className={isSelected ? "text-white" : "text-red-500"} />
  );
}

// TODO: Move this to ssr after convex supports server side reactive queries
function SessionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = useQuery(api.practice_session.getSession, {
    session_id: slug as Id<"practice_session">,
  });

  const strippedQuestions = useQuery(
    api.practice_session.getStrippedSessionQuestions,
    session?.status !== SessionStatus.Completed
      ? {
          session_id: slug as Id<"practice_session">,
        }
      : "skip"
  );
  const questions = useQuery(
    api.practice_session.getQuestions,
    session?.status == SessionStatus.Completed
      ? {
          session_id: slug as Id<"practice_session">,
        }
      : "skip"
  );

  const [questionIndex, setQuestionIndex] = useState(0);

  if (
    session === undefined ||
    (strippedQuestions === undefined && questions === undefined)
  ) {
    return <AppLoader />;
  }

  return (
    <div className="flex">
      <div className="flex flex-col w-36 relative border-r">
        <p className="ml-4 my-2">Questions</p>
        <div className="flex flex-col border-t">
          {session.questions.map((question, index) => (
            <div
              key={question.id}
              className={`flex items-center justify-between border-b gap-2 px-6 lg:px-8 py-2 transition cursor-pointer ${
                questionIndex === index
                  ? "bg-blue-500 text-white hover:bg-blue-500"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => setQuestionIndex(index)}
            >
              <p className="text-sm">{index + 1}</p>
              {renderCorrect(question.correct, questionIndex === index)}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full gap-y-4">
        {questions !== undefined && (
          <GradedQuestion
            session_id={slug as Id<"practice_session">}
            question={questions[questionIndex]}
            isLast={questionIndex === questions.length - 1}
            nextQuestion={() => setQuestionIndex(questionIndex + 1)}
          />
        )}
        {strippedQuestions !== undefined && (
          <SessionQuestion
            session_id={slug as Id<"practice_session">}
            question={strippedQuestions[questionIndex]}
            isLast={questionIndex === strippedQuestions.length - 1}
            nextQuestion={() => setQuestionIndex(questionIndex + 1)}
          />
        )}
      </div>
    </div>
  );
}

function fallbackRender({ error, resetErrorBoundary }) {
  if (error instanceof ConvexError) {
    switch ((error.data as { code: number }).code) {
      case 404:
        return <NotFoundPage />;
      case 401:
        return (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>You are not authorized</pre>
          </div>
        );
      default:
        return (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.data.message}</pre>
          </div>
        );
    }
  }

  return <NotFoundPage />;
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <SessionPage params={params} />
    </ErrorBoundary>
  );
}
