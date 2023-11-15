import { CaseForm } from "@/app/(private)/case/create/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea, TextInput } from "@mantine/core";

const SYMPTOMS = [
  "Swelling of neck",
  "Rash that extends to the palms or soles of feet",
  "Swelling of hands or feet",
  "Pink color in or around eyes",
  "Burning or pain when urinating",
  "Altered mental status",
  "Coughing",
  "Loss of appetite",
  "Changes in bowel movements",
];

export default function Fever({ form }: { form: CaseForm }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full">
      <div className="flex flex-col gap-3 sm:gap-6 w-full">
        <Textarea
          classNames={{
            label: "text-white font-medium text-lg",
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
            label: "text-white font-medium text-lg",
          }}
          {...form.getInputProps("questions.What was the temperature?.answer")}
          className="w-full"
          label="What was the temperature?"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-medium text-lg",
          }}
          {...form.getInputProps("questions.Duration of the fever.answer")}
          className="w-full"
          label="Duration of the fever"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-medium text-lg",
          }}
          {...form.getInputProps("questions.Frequency of urination.answer")}
          className="w-full"
          label="Frequency of urination"
          maxLength={1000}
        />
        <Textarea
          classNames={{
            label: "text-white font-medium text-lg",
          }}
          {...form.getInputProps(
            "questions.Is there anything that helps or worsens symptoms?.answer"
          )}
          className="w-full"
          placeholder="If yes, describe in detail"
          label="Is there anything that helps or worsens symptoms?"
          maxLength={5000}
        />
        <TextInput
          classNames={{
            label: "text-white font-medium text-lg",
          }}
          {...form.getInputProps(
            "questions.Has the fever lasted more than 5 days?.answer"
          )}
          className="w-full"
          placeholder="When did it start, give specific dates if possible"
          label="Has the fever lasted more than 5 days?"
          maxLength={1000}
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-6 w-full">
        <p className="text-white font-medium text-lg">
          Are any of the following symptoms occuring?
        </p>
        {SYMPTOMS.map((item) => {
          return (
            <div
              key={item}
              className="flex items-center gap-x-4 w-full justify-between"
            >
              <p className="text-white text-lg font-medium">{item}</p>
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
