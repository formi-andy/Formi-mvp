import { CaseForm } from "@/app/case/create/page";
import { Chip, Textarea } from "@mantine/core";
import { LuPersonStanding, LuUserPlus2 } from "react-icons/lu";

const SYMPTOMS = [
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
            <div className="border-4 border-lightblue bg-white flex items-center justify-center rounded-full aspect-square w-3/4 min-w-[80px] max-w-[160px]">
              <LuUserPlus2 className="text-center text-formiblue w-1/2 h-1/2" />
            </div>
            <p className="text-center text-lg font-medium text-white">Add</p>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6 rounded-lg items-center bg-formiblue">
        <div className="flex flex-col text-white">
          <p className="font-semibold text-center text-xl sm:text-2xl">
            How are they feeling?
          </p>
          <p className="text-center font-medium">Select all current symptoms</p>
        </div>
        <Chip.Group multiple {...form.getInputProps("symptoms")}>
          <div className="flex flex-col gap-y-6 w-full">
            {SYMPTOMS.map((symptom) => (
              <Chip
                classNames={{
                  root: "w-full",
                  iconWrapper: "hidden",
                  label:
                    "w-full text-center justify-center rounded-lg py-4 text-base",
                }}
                key={symptom.value}
                value={symptom.value}
              >
                {symptom.label}
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
