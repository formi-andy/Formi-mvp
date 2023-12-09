"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useMutation, useQuery } from "convex/react";
import { use, useEffect, useRef, useState } from "react";
import NotFoundPage from "@/app/not-found";

import Link from "next/link";
import { MdNotes } from "react-icons/md";
import { Breadcrumbs, Spoiler, Textarea } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import Autoplay from "embla-carousel-autoplay";
import { capitalize } from "lodash";

import Image from "@/components/ui/Image/Image";
import AppLoader from "@/components/Loaders/AppLoader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";
import { LuChevronDown, LuClipboard, LuWorkflow } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { INITIAL_HISTORY } from "@/commons/constants/historyQuestions";
import { CaseStatus } from "@/types/case-types";

// TODO: Move this to ssr after convex supports server side reactive queries
function CasePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // cast to Id<"medical_case"> to satisfy type checker
  const medicalCase = useQuery(
    api.medical_case.getMedicalCaseWithImageAndPatient,
    {
      id: slug as Id<"medical_case">,
    }
  );
  const saveFeedback = useMutation(api.medical_case.caseFeedback);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useNetworkToasts();
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  if (medicalCase === undefined) {
    return <AppLoader />;
  }

  function renderFeedback(
    status: `${CaseStatus}`,
    feedback: string,
    caseFeedback?: string
  ) {
    if (status !== CaseStatus.Completed) {
      return null;
    }

    if (!caseFeedback) {
      return (
        <div className="flex flex-col w-full mt-4">
          <p className="font-medium mb-1">Feedback for Reviewers</p>
          <Textarea
            minRows={3}
            maxRows={6}
            placeholder="Leave feedback for the reviewers here!"
            value={feedback}
            onChange={(event) => {
              setFeedback(event.currentTarget.value);
            }}
            maxLength={2000}
          />
          <Button
            className="w-fit mt-4"
            variant="action"
            disabled={loading || feedback.length === 0}
            onClick={async () => {
              try {
                setLoading(true);
                toast.loading({
                  title: "Submitting feedback...",
                  message: "Please wait",
                });
                await saveFeedback({
                  id: slug as Id<"medical_case">,
                  feedback,
                });
                toast.success({
                  title: "Feedback submitted",
                  message: "Your feedback will be sent to the reviewers",
                });
              } catch (error) {
                toast.error({
                  title: "Error submitting feedback",
                  message:
                    error instanceof ConvexError
                      ? (error.data as { message: string }).message
                      : undefined,
                });
              } finally {
                setLoading(false);
              }
            }}
          >
            Submit
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-full mt-4">
          <p className="font-medium mb-1">Feedback for Reviewers</p>
          <p className="text-sm">{caseFeedback}</p>
        </div>
      );
    }
  }

  const items = [
    { title: "dashboard", href: "/dashboard" },
    { title: slug, href: `/case/${slug}` },
  ].map((item, index) => (
    <Link
      href={item.href}
      key={index}
      className="text-blue-500 hover:underline"
    >
      {item.title}
    </Link>
  ));

  // TODO: break down into components
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <div className="flex w-full lg:w-2/5 rounded-lg relative aspect-square max-h-[50vh] min-w-[200px]">
        <Carousel
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          withIndicators
          height="100%"
          style={{ flex: 1 }}
          classNames={{
            control: "bg-white transition border",
            indicator: "bg-white transition data-[active]:w-[4rem]",
          }}
        >
          {medicalCase.images.map((image, index) => (
            <Carousel.Slide key={index}>
              <Image url={image.url || ""} alt={image.title} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div className="flex flex-col w-full lg:w-3/5 gap-y-4">
        <div className="items-center flex-wrap justify-between gap-y-4 hidden sm:flex">
          <Breadcrumbs
            classNames={{
              separator: "!text-blue-500",
            }}
          >
            {items}
          </Breadcrumbs>
        </div>
        <div>
          <p className="!text-4xl capitalize font-medium !h-10 overflow-visible !border-0 disabled:bg-transparent disabled:opacity-100 disabled:text-black disabled:cursor-text">
            {medicalCase.chief_complaint.replace(/_/g, " ")} case
          </p>
        </div>
        <div>
          <p>
            Created at{" "}
            {dayjs(medicalCase._creationTime).format("M/DD/YYYY h:mm A")}
          </p>
          <p>
            {medicalCase.status === CaseStatus.Completed ? (
              <span>Reviewed</span>
            ) : (
              <span>{capitalize(medicalCase.status)}</span>
            )}
          </p>
        </div>
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <LuClipboard size={24} /> Patient Info
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <p className="text-lg">
              Name - {medicalCase.profile.first_name}{" "}
              {medicalCase.profile.last_name}
            </p>
            <p className="text-lg">
              Age -{" "}
              {dayjs(medicalCase.profile.date_of_birth).format("M/DD/YYYY")}
            </p>
            <p className="text-lg capitalize">
              Birth Sex - {medicalCase.profile.sex_at_birth}
            </p>
            <p className="text-lg">
              Ethnicity - {medicalCase.profile.ethnicity.join(", ")}
            </p>
            <p className="text-lg">State - {medicalCase.profile.state}</p>
            <p className="text-lg capitalize">
              Chief Complaint - {medicalCase.chief_complaint.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <LuWorkflow size={24} /> Reviews
          </div>
          <div className="flex flex-col w-full p-4">
            {medicalCase.reviews.length === 0 ? (
              <p className="text-lg">No reviews yet.</p>
            ) : (
              medicalCase.reviews.map((review, index) => {
                return (
                  <div key={`review_${index}`}>
                    <p className="font-medium mb-2">
                      {`${review.user.clerkUser.first_name} ${review.user.clerkUser.last_name}`}
                    </p>
                    <Spoiler
                      maxHeight={160}
                      showLabel="Show more"
                      hideLabel="Hide"
                    >
                      <div
                        id={`review_${index}`}
                        className="rte-content-container"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(review.notes),
                        }}
                      />
                    </Spoiler>
                  </div>
                );
              })
            )}
            {renderFeedback(medicalCase.status, feedback, medicalCase.feedback)}
          </div>
        </div>
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <MdNotes size={24} /> Case Questions
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <div className="grid gap-y-1">
              <p className="font-medium">Symptoms duration</p>
              <p className="">{medicalCase.duration}</p>
            </div>
            {medicalCase.questions.map((question) => {
              return (
                <div className="grid gap-y-1" key={question.question}>
                  <p className="font-medium">{question.question}</p>
                  <p className="">
                    {typeof question.answer === "boolean"
                      ? question.answer
                        ? "Yes"
                        : "No"
                      : question.answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <MdNotes size={24} /> Medical History
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            {Object.keys(INITIAL_HISTORY).map((section) => {
              return Object.keys(INITIAL_HISTORY[section]).map((key) => {
                const question = INITIAL_HISTORY[section][key];
                if (
                  question.pediatric_question &&
                  !medicalCase.profile.pediatric_patient
                ) {
                  return null;
                }
                switch (question.type) {
                  case "checkbox-description":
                    return (
                      <div className="grid gap-y-1" key={question.question}>
                        <p className="font-medium">{question.question}</p>
                        <p className="">
                          {medicalCase.medical_history[key].answer
                            ? "Yes"
                            : "No"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {medicalCase.medical_history[key].description
                            ? medicalCase.medical_history[key].description
                            : "No description provided."}
                        </p>
                      </div>
                    );
                  case "select":
                    return (
                      <div className="grid gap-y-1" key={question.question}>
                        <p className="font-medium">{question.question}</p>
                        <p className="">
                          {medicalCase.medical_history[key].answer}
                        </p>
                      </div>
                    );
                  case "number-select":
                    return (
                      <div className="grid gap-y-1" key={question.question}>
                        <p className="font-medium">{question.question}</p>
                        <p className="capitalize">
                          {medicalCase.medical_history[key].answer}{" "}
                          {medicalCase.medical_history[key].select}
                        </p>
                      </div>
                    );
                  case "checkbox":
                    return (
                      <div className="grid gap-y-1" key={question.question}>
                        <p className="font-medium">{question.question}</p>
                        <p className="">
                          {medicalCase.medical_history[key].answer
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    );
                  case "number":
                    return (
                      <div className="grid gap-y-1" key={question.question}>
                        <p className="font-medium">{question.question}</p>
                        <p className="">
                          {medicalCase.medical_history[key].answer} weeks
                        </p>
                      </div>
                    );
                }
              });
            })}
          </div>
        </div>
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
      <CasePage params={params} />
    </ErrorBoundary>
  );
}
