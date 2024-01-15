import { CaseForm } from "@/app/home/(private)/(padded)/case/create/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea, TextInput } from "@mantine/core";

const SYMPTOMS = [
  "Fever",
  "Chest pain",
  "Abdominal pain",
  "Vomiting",
  "Runny nose",
  "Sore throat",
  "Shortness of breath",
];

export default function Cough({ form }: { form: CaseForm }) {
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
          placeholder="Is the cough dry or wet, wheezing, when does it happen (exercising, or always), laying down, at night vs. day, can you finish a full sentence, what was happening when it started"
          label="Describe in your own words what is happening"
          rows={5}
          maxLength={5000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps("questions.Is there phlegm?.answer")}
          className="w-full"
          placeholder="If yes, describe the color. Is there blood?"
          label="Is there phlegm?"
          maxLength={1000}
        />
        <TextInput
          classNames={{
            label: "text-white font-normal text-lg",
          }}
          {...form.getInputProps(
            "questions.What is the frequency of coughing?.answer"
          )}
          className="w-full"
          placeholder="Please describe with numbers"
          label="What is the frequency of coughing?"
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
