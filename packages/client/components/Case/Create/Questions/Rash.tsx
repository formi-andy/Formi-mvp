import { CaseForm } from "@/app/home/(private)/(padded)/case/create/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea, TextInput } from "@mantine/core";

const SYMPTOMS = [
  "Fever",
  "Cough",
  "Diarrhea",
  "Vomiting",
  "Behavioral changes",
  "Gastrointestinal issues",
  "Itchiness",
  "Pain when touching",
];

export default function Rash({ form }: { form: CaseForm }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full">
      <div className="flex flex-col gap-3 sm:gap-6 w-full">
        <Textarea
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Describe in your own words what is happening.answer"
          )}
          className="w-full"
          placeholder="Describe the type of pain (shooting, dull, etc.), where in the abdomen, how often it occurs (constant or intermittent), when did it start, what was happening when it started, has it changed over time, is it affecting quality of life."
          label="Describe in your own words what is happening"
          rows={5}
          maxLength={5000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps("questions.Describe the rash.answer")}
          className="w-full"
          placeholder="What is the color, texture, shape, size, areas affected, does it move"
          label="Describe the rash"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps("questions.Where does the rash occur?.answer")}
          className="w-full"
          placeholder="Be specific if possible"
          label="Where does the rash occur?"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Any recent infections or illnesses?.answer"
          )}
          className="w-full"
          placeholder="If yes, describe in detail"
          label="Any recent infections or illnesses?"
          maxLength={1000}
        />
        <Textarea
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Is there anything that helps or worsens symptoms?.answer"
          )}
          className="w-full"
          placeholder="If yes, describe in detail"
          label="Is there anything that helps or worsens symptoms?"
          maxLength={5000}
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-6 w-full">
        <p className="text-white font-normal text-lg">
          Are any of the following symptoms occuring?
        </p>
        {SYMPTOMS.map((item) => {
          return (
            <div
              key={item}
              className="flex items-center gap-x-4 w-full justify-between"
            >
              <p className="text-white text-lg font-normal">{item}</p>
              <Checkbox
                size="lg"
                checked={
                  (form.values.questions[item].answer as null | boolean) ??
                  false
                }
                onCheckedChange={(checked) => {
                  form.setFieldValue(`questions.${item}.answer`, checked);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
