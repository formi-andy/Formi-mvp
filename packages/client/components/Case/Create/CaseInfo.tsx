import { CaseForm } from "@/app/case/create/page";
import { MdNotes } from "react-icons/md";
import { LuPencil } from "react-icons/lu";

import { Radio, TextInput, Textarea } from "@mantine/core";
import RTE from "../../ui/RTE/RTE";

export default function CaseInfo({ form }: { form: CaseForm }) {
  return (
    <div className="grid gap-y-6">
      <div className="flex items-center w-full border-b pb-4 text-lg font-medium gap-x-2">
        <LuPencil size={20} /> Questions
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
        {Object.keys(form.values.questions).map((key, index) => {
          let question = form.values.questions[key];
          if (question.type === "textarea") {
            return (
              <Textarea
                label={question.question}
                required
                placeholder={question.placeholder}
                key={`case_info_${index}`}
                value={form.values.questions[key].answer as string}
                error={form.errors[key] && "This question is required"}
                onChange={(e) => {
                  const questionsCopy = { ...form.values.questions };
                  questionsCopy[key].answer = e.currentTarget.value;
                  form.setErrors({ ...form.errors, [key]: null });
                  form.setFieldValue("questions", questionsCopy);
                }}
              />
            );
          } else if (question.type === "text") {
            return (
              <TextInput
                label={question.question}
                required
                placeholder={question.placeholder}
                key={`case_info_${index}`}
                value={form.values.questions[key].answer as string}
                error={form.errors[key] && "This question is required"}
                onChange={(e) => {
                  const questionsCopy = { ...form.values.questions };
                  questionsCopy[key].answer = e.currentTarget.value;
                  form.setErrors({ ...form.errors, [key]: null });
                  form.setFieldValue("questions", questionsCopy);
                }}
              />
            );
          }
          return (
            <Radio.Group
              key={`case_info_${index}`}
              label={question.question}
              required
              error={form.errors[key] && "This question is required"}
              value={form.values.questions[key].answer as string | undefined}
              onChange={(value) => {
                const questionsCopy = { ...form.values.questions };
                questionsCopy[key].answer = value;
                form.setErrors({ ...form.errors, [key]: null });
                form.setFieldValue("questions", questionsCopy);
              }}
            >
              <div className="grid gap-y-2 my-2">
                <Radio value="true" label="True" />
                <Radio value="false" label="False" />
              </div>
            </Radio.Group>
          );
        })}
      </div>
      <div className="flex items-center w-full border-b pb-4 text-lg font-medium gap-x-2">
        <MdNotes size={20} /> Additional Notes
      </div>
      <div className="self-center w-full">
        <RTE
          content={form.values.description}
          onChange={(content) => {
            form.setFieldValue("description", content);
          }}
          maxLength={5000}
        />
      </div>
    </div>
  );
}
