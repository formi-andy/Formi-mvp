import React, { memo } from "react";
import { LuPencil } from "react-icons/lu";
import { FAMILY_HISTORY_QUESTIONS } from "@/commons/constants/historyQuestions";
import CheckboxDescription from "./Formik/CheckboxDescription";
import { HandleChange } from "@/types/formik-types";

type Props = {
  handleChange: HandleChange;
  values: Record<string, object>;
  errors: any;
};

const FamilyHistoryForm = memo(function FamilyHistoryForm({
  handleChange,
  values,
  errors,
}: Props) {
  const questions = FAMILY_HISTORY_QUESTIONS;

  return (
    <div className="grid gap-y-6">
      <div className="flex items-center w-full border-b pb-4 text-lg font-medium gap-x-2">
        <LuPencil size={20} /> Questions
      </div>
      <div className="flex flex-col gap-y-6">
        <CheckboxDescription
          formKey="familyHistoryQuestions.asthma"
          placeholder={questions["asthma"].placeholder}
          question={questions["asthma"].question}
          handleChange={handleChange}
          values={values["familyHistoryQuestions"]["asthma"]}
          error={errors?.["asthma"]}
        />
        <CheckboxDescription
          formKey="familyHistoryQuestions.allergies_family"
          placeholder={questions["allergies_family"].placeholder}
          question={questions["allergies_family"].question}
          handleChange={handleChange}
          values={values["familyHistoryQuestions"]["allergies_family"]}
          error={errors?.["allergies_family"]}
        />
        <CheckboxDescription
          formKey="familyHistoryQuestions.cancer"
          placeholder={questions["cancer"].placeholder}
          question={questions["cancer"].question}
          handleChange={handleChange}
          values={values["familyHistoryQuestions"]["cancer"]}
          error={errors?.["cancer"]}
        />
        <CheckboxDescription
          formKey="familyHistoryQuestions.diabetes"
          placeholder={questions["diabetes"].placeholder}
          question={questions["diabetes"].question}
          handleChange={handleChange}
          values={values["familyHistoryQuestions"]["diabetes"]}
          error={errors?.["diabetes"]}
        />
        <CheckboxDescription
          formKey="familyHistoryQuestions.hypertension"
          placeholder={questions["hypertension"].placeholder}
          question={questions["hypertension"].question}
          handleChange={handleChange}
          values={values["familyHistoryQuestions"]["hypertension"]}
          error={errors?.["hypertension"]}
        />
        <CheckboxDescription
          formKey="familyHistoryQuestions.gastrointestinal"
          placeholder={questions["gastrointestinal"].placeholder}
          question={questions["gastrointestinal"].question}
          handleChange={handleChange}
          values={values["familyHistoryQuestions"]["gastrointestinal"]}
          error={errors?.["gastrointestinal"]}
        />
        <CheckboxDescription
          formKey="familyHistoryQuestions.other"
          placeholder={questions["other"].placeholder}
          question={questions["other"].question}
          handleChange={handleChange}
          values={values["familyHistoryQuestions"]["other"]}
          error={errors?.["other"]}
        />
      </div>
    </div>
  );
});

export default FamilyHistoryForm;
