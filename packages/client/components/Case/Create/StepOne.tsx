import { CaseForm } from "@/app/case/create/page";
import {
  ABDOMINAL_QUESTIONS,
  COUGH_QUESTIONS,
  EARACHE_QUESTIONS,
  FEVER_QUESTIONS,
  RASH_QUESTIONS,
} from "@/commons/constants/questions";
import { Chip, Textarea } from "@mantine/core";
import { LuPersonStanding, LuUserPlus2 } from "react-icons/lu";

const CHIEF_COMPLAINTS = [
  {
    label: "Abdominal Pain",
    value: "abdominal_pain",
  },
  {
    label: "Cough",
    value: "cough",
  },
  {
    label: "Earache",
    value: "earache",
  },
  {
    label: "Fever",
    value: "fever",
  },
  {
    label: "Rash",
    value: "rash",
  },
  // {
  //   label: "Other",
  //   value: "other",
  // },
];

const temp = ["Me", "Someone", "Joe"];

export default function StepOne({ form }: { form: CaseForm }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="flex flex-col gap-6 p-6 rounded-lg items-center bg-formiblue">
        <p className="font-semibold text-center text-xl sm:text-2xl text-white">
          Who needs help today?
        </p>
        <div className="grid grid-cols-2 gap-6 w-full">
          {temp.map((name) =>
            form.values.patient === name ? (
              <button
                className="flex flex-col items-center gap-2 rounded-lg border p-4 border-white"
                key={name}
                onClick={() => form.setFieldValue("patient", "")}
              >
                <div className="border-4 border-lightblue bg-white flex items-center justify-center rounded-full aspect-square w-3/4 min-w-[80px] max-w-[160px]">
                  <LuPersonStanding className="text-center text-formiblue w-1/2 h-1/2" />
                </div>
                <p className="text-center text-lg font-medium text-white">
                  {name}
                </p>
              </button>
            ) : (
              <button
                className="flex flex-col items-center gap-2 rounded-lg border p-4 border-transparent hover:border-white transition"
                key={name}
                onClick={() => form.setFieldValue("patient", name)}
              >
                <div className="border-4 border-lightblue bg-white flex items-center justify-center rounded-full aspect-square w-3/4 min-w-[80px] max-w-[160px]">
                  <LuPersonStanding className="text-center text-formiblue w-1/2 h-1/2" />
                </div>
                <p className="text-center text-lg font-medium text-white">
                  {name}
                </p>
              </button>
            )
          )}
          <button className="flex flex-col items-center gap-2 rounded-lg border p-4 border-transparent hover:border-white transition">
            <button
              className="border-4 border-lightblue bg-white flex items-center justify-center rounded-full aspect-square w-3/4 min-w-[80px] max-w-[160px]"
              onClick={() => {}}
            >
              <LuUserPlus2 className="text-center text-formiblue w-1/2 h-1/2" />
            </button>
            <p className="text-center text-lg font-medium text-white">Add</p>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6 rounded-lg items-center bg-formiblue">
        <div className="flex flex-col text-white">
          <p className="font-semibold text-center text-xl sm:text-2xl">
            How are they feeling?
          </p>
          <p className="text-center font-medium">Select a chief complaint</p>
        </div>
        <Chip.Group
          value={form.values.chiefComplaint}
          onChange={(value) => {
            let questions: {
              question: string;
              type: string;
              placeholder?: string;
              answer: string;
            }[] = [];
            switch (value) {
              case "cough":
                questions = COUGH_QUESTIONS;
                break;
              case "abdominal_pain":
                questions = ABDOMINAL_QUESTIONS;
                break;
              case "earache":
                questions = EARACHE_QUESTIONS;
                break;
              case "fever":
                questions = FEVER_QUESTIONS;
                break;
              case "rash":
                questions = RASH_QUESTIONS;
                break;
            }

            const newQuestions = {
              ...questions.reduce((acc, question) => {
                return {
                  ...acc,
                  [question.question]: {
                    question: question.question,
                    type: question.type,
                    placeholder: question.placeholder,
                    answer: question.type === "boolean" ? false : "",
                  },
                };
              }, {}),
            } as Record<
              string,
              {
                question: string;
                type: "textinput" | "textarea" | "boolean";
                placeholder?: string;
                answer: string | boolean | null;
              }
            >;

            form.setFieldValue("chiefComplaint", value as string);
            form.setFieldValue("questions", newQuestions);
          }}
        >
          <div className="flex flex-col gap-y-6 w-full">
            {CHIEF_COMPLAINTS.map((complaint) => (
              <Chip
                classNames={{
                  root: "w-full",
                  iconWrapper: "hidden",
                  label:
                    "w-full text-center justify-center rounded-lg py-4 text-base",
                }}
                key={complaint.value}
                value={complaint.value}
              >
                {complaint.label}
              </Chip>
            ))}
          </div>
        </Chip.Group>
      </div>
      <div className="flex flex-col gap-6 p-6 rounded-lg items-center bg-formiblue">
        <p className="font-semibold text-center text-xl sm:text-2xl text-white">
          How long has this been going on?
        </p>
        <Textarea
          {...form.getInputProps("duration")}
          className="w-full"
          placeholder="Try to be descriptive if possible"
          rows={5}
        />
      </div>
    </div>
  );
}
