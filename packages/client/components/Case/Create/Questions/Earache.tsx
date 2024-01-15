import { CaseForm } from "@/app/home/(private)/(padded)/case/create/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea, TextInput } from "@mantine/core";

const SYMPTOMS = [
  "Fever",
  "Itching",
  "Lightheadedness",
  "Cough",
  "Headache",
  "Ringing or popping sounds in ear",
  "Rashes",
  "Hearing loss",
  "Protruding ear",
  "Discharge from ear",
];

export default function Earache({ form }: { form: CaseForm }) {
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
          placeholder="Is it on the inside vs. outside of ear, is the child touching or pulling the ear, what was happening when the symptoms began, etc."
          label="Describe in your own words what is happening"
          rows={5}
          maxLength={5000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Any major injury to the affected area?.answer"
          )}
          className="w-full"
          label="Any major injury to the affected area?"
          maxLength={50}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Do siblings have similar symptoms?.answer"
          )}
          className="w-full"
          label="Do siblings have similar symptoms?"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.Any recent swimming or full submersion in water?.answer"
          )}
          className="w-full"
          label="Any recent swimming or full submersion in water?"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps("questions.Does child attend daycare?.answer")}
          className="w-full"
          label="Does child attend daycare?"
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
          rows={5}
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
