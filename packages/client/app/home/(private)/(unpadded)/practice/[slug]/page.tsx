"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import NotFoundPage from "@/app/not-found";

import Link from "next/link";

import AppLoader from "@/components/Loaders/AppLoader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";
import { Button } from "@/components/ui/button";
import SessionQuestion from "@/components/Practice/SessionQuestion";

// TODO: Move this to ssr after convex supports server side reactive queries
function SessionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = useQuery(api.practice_session.getSession, {
    session_id: slug as Id<"practice_session">,
  });
  const questions = useQuery(api.practice_session.getStrippedSessionQuestions, {
    session_id: slug as Id<"practice_session">,
  });

  const [loading, setLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const toast = useNetworkToasts();

  if (session === undefined || questions === undefined) {
    return <AppLoader />;
  }

  console.log("session", session);

  // TODO: break down into components
  return (
    <div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
      <div className="flex flex-col w-full sm:w-1/5 relative sm:border-r h-screen">
        <p className="ml-4 my-2">Questions</p>
        <div className="flex flex-col border-t">
          {questions.map((question, index) => (
            <div
              key={question._id}
              className={`flex items-center border-b gap-2 px-8 py-2 transition cursor-pointer ${
                questionIndex === index
                  ? "bg-blue-500 text-white hover:bg-blue-500"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => setQuestionIndex(index)}
            >
              <p className="text-sm">{index + 1}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full sm:w-4/5 gap-y-4">
        <SessionQuestion
          session_id={slug as Id<"practice_session">}
          question={questions[questionIndex]}
          isLast={questionIndex === questions.length - 1}
          nextQuestion={() => setQuestionIndex(questionIndex + 1)}
        />
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
