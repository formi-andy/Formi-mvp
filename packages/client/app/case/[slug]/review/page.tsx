"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useQuery } from "convex/react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import NotFoundPage from "@/app/not-found";

import Link from "next/link";
import { MdNotes } from "react-icons/md";
import { Breadcrumbs } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import dayjs from "dayjs";
import Autoplay from "embla-carousel-autoplay";

import Image from "@/components/ui/Image/Image";
import AppLoader from "@/components/Loaders/AppLoader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import ReviewCase from "@/components/Case/Review/ReviewCase";

// TODO: Move this to ssr after convex supports server side reactive queries
function CaseReviewPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const medicalCase = useQuery(api.medical_case.getAnonymizedMedicalCase, {
    id: slug as Id<"medical_case">,
  });
  const currentReview = useQuery(api.review.getUserReviewByCaseId, {
    case_id: slug as Id<"medical_case">,
  });

  const router = useRouter();
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  if (medicalCase === undefined || currentReview === undefined) {
    return <AppLoader />;
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
      <div className="flex flex-col w-full lg:w-3/5 min-w-[200px] gap-y-4">
        <div className="flex items-center flex-wrap justify-between gap-y-4">
          <Breadcrumbs
            classNames={{
              separator: "!text-blue-500",
            }}
          >
            {items}
          </Breadcrumbs>
        </div>
        <div>
          <p className="text-4xl font-medium truncate">
            Created at{" "}
            {dayjs(medicalCase._creationTime).format("M/DD/YYYY h:mm A")}
          </p>
        </div>
        {/* <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <LuClipboard size={24} /> Patient Info
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <p className="text-lg">Age - {medicalCase.age}</p>
            <p className="text-lg">Birth Sex - {medicalCase.age}</p>
            <p className="text-lg">Ethnicity - {medicalCase.ethnicity}</p>
            <p className="text-lg">State - {medicalCase.age}</p>
            <p className="text-lg">
              Chief Complaint - {medicalCase.chief_complaint}
            </p>
          </div>
        </div> */}
        {/* <p className="text-xl">{image.user_id || "No patient"}</p> */}
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <MdNotes size={24} /> Medical History
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            {Object.keys(medicalCase.medical_history).map((key, index) => {
              let question = medicalCase.medical_history[key];
              if (
                question.type === "textarea" ||
                question.type === "textinput"
              ) {
                return (
                  <div key={`case_info_${index}`}>
                    <p>{question.question}</p>
                    <p className="text-sm">{question.answer}</p>
                  </div>
                );
              }
              return (
                <div key={`case_info_${index}`}>
                  <p>{question.question}</p>
                  <p className="capitalize text-sm">{question.answer}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <MdNotes size={24} /> Questions
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            {Object.keys(medicalCase.medical_history).map((key, index) => {
              let question = medicalCase.questions[key];
              if (
                question.type === "textarea" ||
                question.type === "textinput"
              ) {
                return (
                  <div key={`case_info_${index}`}>
                    <p>{question.question}</p>
                    <p className="text-sm">{question.answer}</p>
                  </div>
                );
              }
              return (
                <div key={`case_info_${index}`}>
                  <p>{question.question}</p>
                  <p className="capitalize text-sm">{question.answer}</p>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xl font-semibold">Images</p>
        <div className="flex w-full rounded-lg relative aspect-square max-h-[50vh] min-w-[200px]">
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
      </div>
      <ReviewCase caseId={slug} currentReview={currentReview} />
    </div>
  );
}

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
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
      <CaseReviewPage params={params} />
    </ErrorBoundary>
  );
}
