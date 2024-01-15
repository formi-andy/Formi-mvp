"use client";

import { Dispatch, SetStateAction, useState } from "react";
import DashboardCases from "./DashboardCases";
import style from "./doctorgallery.module.css";
import { Button } from "../ui/button";

import { NumberInput } from "@mantine/core";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import * as amplitude from "@amplitude/analytics-browser";

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
  const createSession = useMutation(api.practice_session.createSession);

  return (
    <div className="grid gap-3 sm:gap-6 max-w-5xl self-center justify-self-center">
      <DashboardCases />
      {/* <div className="flex w-full lg:w-2/5 flex-col gap-4 md:gap-6 lg:gap-8"> */}
      <div className="grid gap-3 lg:gap-6">
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
                const res = await createSession({
                  tags: Array.from(selectedTags),
                  total_questions: numQuestions,
                  zen: false,
                });
                router.push(`/practice/${res}`);
              } catch {
                setLoading(false);
              }
            }}
          >
            Start
          </Button>
          {/* <Link
            href="practice"
            onClick={() => {
              amplitude.track("practice-started", {
                tags: Array.from(selectedTags),
              });
              if (selectedTags.size === 0) {
                localStorage.removeItem("practice-tags");
              } else {
                localStorage.setItem(
                  "practice-tags",
                  JSON.stringify(Array.from(selectedTags))
                );
              }
            }}
          >
            <Button className="w-full" variant="action">
              Start
            </Button>
          </Link> */}
        </div>
        {/* <div
          className={`flex flex-col rounded-lg min-h-[200px] p-3 lg:p-6 gap-4 relative ${style.glass}`}
        >
          <p className="text-2xl font-medium text-white">Feedback</p>
        </div> */}
      </div>
    </div>
  );
}
