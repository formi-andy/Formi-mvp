import React, { memo } from "react";
import { LuPencil } from "react-icons/lu";
import { SOCIAL_HISTORY_QUESTIONS } from "@/commons/constants/historyQuestions";
import CheckboxDescription from "./Formik/CheckboxDescription";
import { HandleChange } from "@/types/formik-types";
import FormikDescription from "./Formik/FormikDescription";
import FormikCheckbox from "./Formik/FormikCheckbox";

type Props = {
  handleChange: HandleChange;
  values: Record<string, any>;
  errors: Record<string, any>;
  pediatricQuestions?: string | null;
};

const SocialHistoryForm = memo(function SocialHistoryForm({
  handleChange,
  values,
  errors,
  pediatricQuestions,
}: Props) {
  const questions = SOCIAL_HISTORY_QUESTIONS;

  return (
    <div className="grid gap-y-6">
      <div className="flex items-center w-full border-b pb-4 text-lg font-medium gap-x-2">
        <LuPencil size={20} /> Questions
      </div>
      <div className="flex flex-col gap-y-6">
        <FormikCheckbox
          formKey="socialHistoryQuestions.smoking"
          question={questions["smoking"].question}
          handleChange={handleChange}
          values={values["socialHistoryQuestions"]["smoking"]}
          error={errors?.["smoking"]}
        />
        <CheckboxDescription
          formKey="socialHistoryQuestions.alcohol"
          placeholder={questions["alcohol"].placeholder}
          question={questions["alcohol"].question}
          handleChange={handleChange}
          values={values["socialHistoryQuestions"]["alcohol"]}
          error={errors?.["alcohol"]}
        />
        <CheckboxDescription
          formKey="socialHistoryQuestions.drugs"
          placeholder={questions["drugs"].placeholder}
          question={questions["drugs"].question}
          handleChange={handleChange}
          values={values["socialHistoryQuestions"]["drugs"]}
          error={errors?.["drugs"]}
        />
        <CheckboxDescription
          formKey="socialHistoryQuestions.sexual_activity"
          placeholder={questions["sexual_activity"].placeholder}
          question={questions["sexual_activity"].question}
          handleChange={handleChange}
          values={values["socialHistoryQuestions"]["sexual_activity"]}
          error={errors?.["sexual_activity"]}
        />
        {pediatricQuestions === "Yes" && (
          <>
            <FormikDescription
              formKey="socialHistoryQuestions.home_situation"
              placeholder={questions["home_situation"].placeholder}
              question={questions["home_situation"].question}
              handleChange={handleChange}
              values={values["socialHistoryQuestions"]["home_situation"]}
              error={errors?.["home_situation"]}
            />
            <CheckboxDescription
              formKey="socialHistoryQuestions.physical_activity"
              placeholder={questions["physical_activity"].placeholder}
              question={questions["physical_activity"].question}
              handleChange={handleChange}
              values={values["socialHistoryQuestions"]["physical_activity"]}
              error={errors?.["physical_activity"]}
            />
          </>
        )}
      </div>
    </div>
  );
});

export default SocialHistoryForm;
