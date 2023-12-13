"use client";

import { RingProgress } from "@mantine/core";

export default function Performance({
  correct,
  incorrect,
  total,
}: {
  correct: number;
  incorrect: number;
  total: number;
}) {
  const gradedReviews = correct + incorrect;
  if (gradedReviews < 10) {
    return (
      <div className="relative items-center justify-center flex flex-col gap-4 h-full">
        <RingProgress
          size={200}
          thickness={6}
          roundCaps
          label={
            <p className="text-center text-white text-2xl font-light">89.2%</p>
          }
          className="z-0 opacity-50"
          sections={[
            { value: 83, color: "green" },
            { value: 10, color: "red" },
          ]}
        />
        <div className="flex flex-col text-white items-center opacity-30">
          <p className="text-2xl font-light mb-2">Performance</p>
          <p>83/93 cases reviewed correctly</p>
          <p>7 cases pending feedback</p>
        </div>
        <div className="z-10 absolute grid items-center text-center justify-center w-full h-full top-0 rounded-lg">
          <p className="text-2xl font-medium text-white">Not Enough Data</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RingProgress
        size={200}
        thickness={6}
        roundCaps
        label={
          <p className="text-center text-white text-2xl font-light">
            {`${Math.round((correct / gradedReviews) * 100)}%`}
          </p>
        }
        sections={[
          { value: correct / total, color: "green" },
          { value: incorrect / total, color: "red" },
        ]}
      />
      <div className="flex flex-col text-white items-center">
        <p className="text-2xl font-light mb-2">Performance</p>
        <p>
          {correct}/{gradedReviews} cases reviewed correctly
        </p>
        <p>{total - gradedReviews} cases pending feedback</p>
      </div>
    </>
  );
}
