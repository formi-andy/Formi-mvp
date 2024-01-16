"use client";

import { Dispatch, SetStateAction, useState } from "react";
import DashboardCases from "./DashboardCases";
import style from "./doctorgallery.module.css";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import { NumberInput } from "@mantine/core";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import * as amplitude from "@amplitude/analytics-browser";
import AppLoader from "../Loaders/AppLoader";
import dayjs from "dayjs";
import { SessionStatus } from "@/types/practice-session-types";
import { formatTime } from "@/utils/formatTime";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";

// TODO: get tags from convex eventually?
const tags = [
  "Psychiatry, Behavioral & Substance Abuse",
  "Surgery",
  "General Principles",
  "Pediatrics",
  "Obstetrics, Gynecology & Breast",
  "Poisoning & Environmental Exposure",
  "Pregnancy, Childbirth & Puerperium",
  "Rheumatology, Orthopedics & Sports",
  "Immunology",
  "Allergy",
  "Male Reproductive System",
  "Neurology",
  "Ear, Nose & Throat (ENT)",
  "Pathology",
  "Oncology",
  "Ophthatlmology",
];

function Tag({
  tag,
  selectedTags,
  setSelectedTags,
}: {
  tag: string;
  selectedTags: Set<string>;
  setSelectedTags: Dispatch<SetStateAction<Set<string>>>;
}) {
  const isSelected = selectedTags.has(tag);
  return (
    <button
      className={`transition flex border items-center justify-center rounded-full px-3 py-1 ${
        isSelected
          ? "bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
          : "bg-transparent hover:border-blue-500 hover:bg-blue-500"
      }`}
      onClick={() => {
        if (isSelected) {
          const newTags = new Set(selectedTags);
          newTags.delete(tag);
          setSelectedTags(newTags);
        } else {
          setSelectedTags(new Set(selectedTags).add(tag));
        }
      }}
    >
      <p className="text-white text-sm">{tag}</p>
    </button>
  );
}

export default function DoctorDashboard() {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [numQuestions, setNumQuestions] = useState<number>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useNetworkToasts();
  const createSession = useMutation(api.practice_session.createSession);

  // TODO: move to separate component and add pagination
  const pastSessions = useQuery(api.practice_session.getSessions);

  if (pastSessions === undefined) {
    return <AppLoader />;
  }

  return (
    <div className="grid gap-3 sm:gap-6 max-w-5xl self-center justify-self-center">
      <DashboardCases />
      {/* <div className="flex w-full lg:w-2/5 flex-col gap-4 md:gap-6 lg:gap-8"> */}
      <div
        className={`grid rounded-lg min-h-[200px] p-3 sm:p-6 gap-3 relative ${style.glass}`}
      >
        <p className="text-2xl font-medium text-white">Practice</p>
        <p className="text-white font-medium">Tags</p>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Tag
              key={tag}
              tag={tag}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          ))}
        </div>
        <NumberInput
          label="Number of Questions (1-40)"
          min={1}
          max={40}
          value={numQuestions}
          onChange={(value) => setNumQuestions(Number(value))}
          variant="filled"
          classNames={{
            label: "text-white text-base mb-1",
            root: "w-fit",
          }}
          allowDecimal={false}
          allowNegative={false}
          hideControls
        />
        <Button
          className="w-full"
          variant="action"
          disabled={loading || !numQuestions}
          onClick={async () => {
            setLoading(true);
            try {
              if (!numQuestions) return;
              toast.loading({
                title: "Creating session...",
                message: "This may take a few seconds",
              });
              const res = await createSession({
                tags: Array.from(selectedTags),
                total_questions: numQuestions > 40 ? 40 : numQuestions,
                zen: false,
              });
              toast.success({
                title: "Session created",
                message: "You will be redirected shortly",
              });
              router.push(`/practice/${res}`);
            } catch (error) {
              toast.error({
                title: "Error creating session",
                message:
                  error instanceof ConvexError
                    ? (error.data as { message: string }).message
                    : "Please try again later",
              });
              setLoading(false);
            }
          }}
        >
          Start
        </Button>
      </div>
      <div
        className={`flex flex-col rounded-lg min-h-[200px] p-3 sm:p-6 gap-3 relative ${style.glass}`}
      >
        <p className="text-2xl font-medium text-white">Past Sessions</p>
        <div className="border border-white rounded-lg flex flex-col">
          {pastSessions.map((session) => (
            <Link
              href={`/practice/${session._id}`}
              key={session._id}
              className="grid gap-3 p-3 border-b first:rounded-t-lg last:rounded-b-lg last:border-0 hover:bg-blue-400 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-white text-lg font-medium">
                    {dayjs(session._creationTime).format("M/DD/YYYY h:mm A")}
                  </p>
                  <p className="text-white font-medium">
                    {session.status === SessionStatus.Completed
                      ? `${
                          Math.round(
                            (session.total_correct / session.questions.length +
                              Number.EPSILON) *
                              100
                          ) / 100
                        }% (${session.total_correct}/${
                          session.questions.length
                        })`
                      : "In Progress"}
                  </p>
                </div>
                <p className="text-white text-sm font-medium">
                  Time elapsed: {formatTime(session.total_time)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {session.tags.length === 0 ? (
                  <Badge variant="secondary">All</Badge>
                ) : (
                  session.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
