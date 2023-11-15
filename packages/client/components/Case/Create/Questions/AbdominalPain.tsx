import { CaseForm } from "@/app/(private)/case/create/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea, TextInput } from "@mantine/core";

const SYMPTOMS = [
  "Fever",
  "Nausea",
  "Vomiting",
  "Sudden weight change",
  "Weakness or fatigue",
  "Yellowing of the skin",
  "Heartburn",
];

export default function AbdominalPain({ form }: { form: CaseForm }) {
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
          {...form.getInputProps(
            "questions.How intense is the pain on a scale from 1-10?.answer"
          )}
          className="w-full"
          placeholder="1-10"
          label="How intense is the pain on a scale from 1-10?"
          maxLength={50}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Does it occur before or after eating?.answer"
          )}
          className="w-full"
          placeholder="Please describe in detail"
          label="Does it occur before or after eating?"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Are there any changes in appetite?.answer"
          )}
          className="w-full"
          placeholder="Please describe in detail"
          label="Are there any changes in appetite?"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Please describe the bowel movements.answer"
          )}
          className="w-full"
          placeholder="Color, texture, regularity, diarrhea or constipation"
          label="Please describe the bowel movements"
          maxLength={1000}
        />
        <div className="flex items-center gap-x-4 w-full justify-between">
          <p className="text-white text-lg font-normal">
            Does the person menstruate?
          </p>
          <Checkbox
            size="lg"
            checked={
              (form.values.questions["Does the person menstruate?"].answer as
                | null
                | boolean) ?? false
            }
            onCheckedChange={(checked) => {
              form.setFieldValue(
                `questions.Does the person menstruate?.answer`,
                checked
              );
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-6 w-full">
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Is the person sexually active?.answer"
          )}
          className="w-full"
          label="Is the person sexually active?"
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
