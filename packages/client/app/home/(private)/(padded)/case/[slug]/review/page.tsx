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
import { LuClipboard } from "react-icons/lu";
import { INITIAL_HISTORY } from "@/commons/constants/historyQuestions";
import { useDisclosure } from "@mantine/hooks";
import ReviewCarouselModal from "@/components/Carousels/ReviewCarouselModal";

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

  const [opened, { open, close }] = useDisclosure(false);

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
        <div className="sm:flex items-center flex-wrap justify-between gap-y-4 hidden">
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
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <LuClipboard size={24} /> Patient Info
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
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
            onClick={open}
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
      <ReviewCarouselModal
        opened={opened}
        close={close}
        medicalCase={medicalCase}
        caseId={slug}
        currentReview={currentReview}
      />
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
