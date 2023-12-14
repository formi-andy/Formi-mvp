"use client";

import { Dispatch, SetStateAction, useState } from "react";
import DashboardCases from "./DashboardCases";
import style from "./doctorgallery.module.css";
import { Button } from "../ui/button";
import Link from "next/link";

// TODO: get tags from convex eventually?
const tags = [
  "Pediatrics",
  "Ear, Nose & Throat (ENT)",
  "Oncology",
  "Pathology",
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

  return (
    <div className="grid gap-3 sm:gap-6 max-w-4xl self-center justify-self-center">
      <DashboardCases />
      {/* <div className="flex w-full lg:w-2/5 flex-col gap-4 md:gap-6 lg:gap-8"> */}
      <div className="grid gap-3 lg:gap-6">
        <div
          className={`grid rounded-lg min-h-[200px] p-3 sm:p-6 gap-3 relative ${style.glass}`}
        >
          <p className="text-2xl font-medium text-white">Practice</p>
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
          <Link
            href="practice"
            onClick={() => {
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
          </Link>
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
