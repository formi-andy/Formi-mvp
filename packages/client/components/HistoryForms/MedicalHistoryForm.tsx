import React, { memo } from "react";
import { LuPencil } from "react-icons/lu";
import { MEDICAL_HISTORY_QUESTIONS } from "@/commons/constants/historyQuestions";
import CheckboxDescription from "./Formik/CheckboxDescription";
import FormikSelect from "./Formik/FormikSelect";
import FormikNumberInput from "./Formik/FormikNumberInput";
import FormikNumberSelect from "./Formik/FormikNumberSelect";
import { HandleChange } from "@/types/formik-types";

type Props = {
  errors: any;
  handleChange: HandleChange;
  values: Record<string, object>;
  pediatricQuestions?: string | null;
};

const MedicalHistoryForm = memo(function MedicalHistoryForm({
  handleChange,
  values,
  errors,
  pediatricQuestions,
}: Props) {
  const questions = MEDICAL_HISTORY_QUESTIONS;

  return (
    <div className="grid gap-y-6">
      <div className="flex items-center w-full border-b pb-4 text-lg font-medium gap-x-2">
        <LuPencil size={20} /> Questions
      </div>
      <div className="flex flex-col gap-y-6">
        <CheckboxDescription
          formKey="medicalHistoryQuestions.immunizations"
          placeholder={questions["immunizations"].placeholder}
          question={questions["immunizations"].question}
          handleChange={handleChange}
          values={values["medicalHistoryQuestions"]["immunizations"]}
          error={errors?.["immunizations"]}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.allergies_medical"
          placeholder={questions["allergies_medical"].placeholder}
          question={questions["allergies_medical"].question}
          handleChange={handleChange}
          values={values["medicalHistoryQuestions"]["allergies_medical"]}
          error={errors?.["allergies_medical"]}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.medications"
          placeholder={questions["medications"].placeholder}
          question={questions["medications"].question}
          handleChange={handleChange}
          values={values["medicalHistoryQuestions"]["medications"]}
          error={errors?.["medications"]}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.chronic_conditions"
          placeholder={questions["chronic_conditions"].placeholder}
          question={questions["chronic_conditions"].question}
          handleChange={handleChange}
          values={values["medicalHistoryQuestions"]["chronic_conditions"]}
          error={errors?.["chronic_conditions"]}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.reproductive_issues"
          placeholder={questions["reproductive_issues"].placeholder}
          question={questions["reproductive_issues"].question}
          handleChange={handleChange}
          values={values["medicalHistoryQuestions"]["reproductive_issues"]}
          error={errors?.["reproductive_issues"]}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.surgeries"
          placeholder={questions["surgeries"].placeholder}
          question={questions["surgeries"].question}
          handleChange={handleChange}
          values={values["medicalHistoryQuestions"]["surgeries"]}
          error={errors?.["surgeries"]}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.hospitalizations"
          placeholder={questions["hospitalizations"].placeholder}
          question={questions["hospitalizations"].question}
          handleChange={handleChange}
          values={values["medicalHistoryQuestions"]["hospitalizations"]}
          error={errors?.["hospitalizations"]}
        />
        {pediatricQuestions === "Yes" && (
          <>
            <FormikSelect
              formKey="medicalHistoryQuestions.birth_type"
              question={questions["birth_type"].question}
              options={questions["birth_type"].options}
              handleChange={handleChange}
              values={values["medicalHistoryQuestions"]["birth_type"]}
              error={errors?.["birth_type"]}
            />
            <FormikNumberInput
              formKey="medicalHistoryQuestions.weeks_born_at"
              question={questions["weeks_born_at"].question}
              handleChange={handleChange}
              values={values["medicalHistoryQuestions"]["weeks_born_at"]}
              error={errors?.["weeks_born_at"]}
            />
            <FormikNumberSelect
              formKey="medicalHistoryQuestions.birth_weight"
              question={questions["birth_weight"].question}
              handleChange={handleChange}
              values={values["medicalHistoryQuestions"]["birth_weight"]}
              error={errors?.["birth_weight"]}
            />
            <CheckboxDescription
              formKey="medicalHistoryQuestions.birth_complications"
              placeholder={questions["birth_complications"].placeholder}
              question={questions["birth_complications"].question}
              handleChange={handleChange}
              values={values["medicalHistoryQuestions"]["birth_complications"]}
              error={errors?.["birth_complications"]}
            />
          </>
        )}
      </div>
    </div>
  );
});

export default MedicalHistoryForm;
