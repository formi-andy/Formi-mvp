"use client";

import { useInView } from "react-intersection-observer";

function Step({ stepName, text }: { stepName: string; text: string }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  return (
    <div
      className={`flex flex-col gap-y-4 px-8 py-8 rounded-2xl bg-slate-50 bg-opacity-30 border border-teal-600 transition-all duration-500 ${
        inView ? "opacity-100" : "opacity-0"
      }`}
      ref={ref}
    >
      <p className="text-center text-xl font-semibold">{stepName}</p>
      <p className="text-center">{text}</p>
    </div>
  );
}

export default function LandingSteps() {
  const steps = ["Step 1.", "Step 2.", "Step 3.", "Step 4.", "Step 5."];
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce volutpat, ante eu bibendum tincidunt, sem lacus vehicula augue, ut suscipit.";

  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-2xl font-semibold text-center">How It Works</p>
      {steps.map((step, index) => (
        <Step key={index} stepName={step} text={text} />
      ))}
    </div>
  );
}
