"use client";

import { Dispatch, SetStateAction, useState } from "react";
import DashboardCases from "./DashboardCases";
import style from "./doctorgallery.module.css";
import { Button } from "../ui/button";

import { NumberInput, Switch, TextInput } from "@mantine/core";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import * as amplitude from "@amplitude/analytics-browser";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";
import PastSessions from "./PastSessions";

// TODO: get tags from convex eventually?
const tags = [
  "Allergy",
  "Ear, Nose & Throat (ENT)",
  "General Principles",
  "Immunology",
  "Male Reproductive System",
  "Neurology",
  "Obstetrics, Gynecology & Breast",
  "Oncology",
  "Ophthalmology",
  "Pathology",
  "Pediatrics",
  "Poisoning & Environmental Exposure",
  "Pregnancy, Childbirth & Puerperium",
  "Psychiatry, Behavioral & Substance Abuse",
  "Rheumatology, Orthopedics & Sports",
  "Surgery",
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
  const [name, setName] = useState<string>("");
  const [excludeSeenQuestions, setExcludeSeenQuestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useNetworkToasts();
  const createSession = useMutation(api.practice_session.createSession);

  return (
    <div className="grid gap-3 sm:gap-6 max-w-5xl self-center justify-self-center">
      <DashboardCases />
      <div
        className={`grid rounded-lg min-h-[200px] p-3 sm:p-6 gap-3 relative ${style.glass}`}
      >
        <p className="text-2xl font-medium text-white">Practice</p>
        <p className="text-white font-medium">Topics</p>
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
        <div className="flex items-end gap-x-6 gap-y-3 flex-wrap">
          <NumberInput
            label="Number of Questions (1-40)"
            min={1}
            max={40}
            required
            value={numQuestions}
            onChange={(value) => setNumQuestions(Number(value))}
            variant="filled"
            classNames={{
              label: "text-white text-base mb-1 font-normal",
              root: "w-58",
            }}
            allowDecimal={false}
            allowNegative={false}
            hideControls
          />
          <TextInput
            maxLength={50}
            label="Session Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="filled"
            classNames={{
              label: "text-white text-base mb-1 font-normal",
              root: "flex-1",
            }}
          />
          <Switch
            label="Exclude seen questions"
            checked={excludeSeenQuestions}
            onChange={(e) => setExcludeSeenQuestions(e.target.checked)}
            classNames={{
              label: "text-white text-base mb-1",
            }}
          />
        </div>
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
                excludeSeenQuestions,
                name,
              });
              toast.success({
                title: "Session created",
                message: "You will be redirected shortly",
              });
              router.push(`/practice/${res}`);
            } catch (error) {
              if (
                error instanceof ConvexError &&
                (error.data as { code: string }).code === "204"
              ) {
                toast.error({
                  title: "Error creating session",
                  message: "All questions have been seen for these tags",
                });
              } else {
                toast.error({
                  title: "Error creating session",
                  message:
                    error instanceof ConvexError
                      ? (error.data as { message: string }).message
                      : "Please try again later",
                });
              }
              setLoading(false);
            }
          }}
        >
          Start
        </Button>
      </div>
      <PastSessions />
    </div>
  );
}
