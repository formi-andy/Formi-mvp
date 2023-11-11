import React, { memo } from "react";
import { LuPencil } from "react-icons/lu";
import { BASIC_INFORMATION_QUESTIONS } from "@/commons/constants/historyQuestions";
import { HandleChange } from "@/types/formik-types";
import FormikDescription from "./Formik/FormikDescription";
import FormikCheckbox from "./Formik/FormikCheckbox";
import FormikSelect from "./Formik/FormikSelect";
import FormikNumberInput from "./Formik/FormikNumberInput";

type Props = {
  handleChange: HandleChange;
  values: Record<string, any>;
  errors: Record<string, any>;
};

const BasicInformationForm = memo(function BasicInformationForm({
  handleChange,
  values,
  errors,
}: Props) {
  const questions = BASIC_INFORMATION_QUESTIONS;

  console.log("values", values);

  return (
    <div className="grid gap-y-6">
      <div className="flex items-center w-full border-b pb-4 text-lg font-medium gap-x-2">
        <LuPencil size={20} /> Questions
      </div>
      <div className="flex flex-col gap-y-6">
        <FormikDescription
          formKey="basicInformationQuestions.name"
          placeholder={questions["name"].placeholder}
          question={questions["name"].question}
          handleChange={handleChange}
          values={values["basicInformationQuestions"]["name"]}
          error={errors?.["name"]}
        />
        <FormikSelect
          formKey="basicInformationQuestions.sex"
          question={questions["sex"].question}
          options={questions["sex"].options}
          handleChange={handleChange}
          values={values["basicInformationQuestions"]}
          error={errors?.["sex"]}
        />
        <FormikNumberInput
          formKey="basicInformationQuestions.age"
          question={questions["age"].question}
          handleChange={handleChange}
          values={values["basicInformationQuestions"]["age"]}
          error={errors?.["age"]}
        />
        <FormikCheckbox
          formKey="basicInformationQuestions.pediatric_patient"
          question={questions["pediatric_patient"].question}
          handleChange={handleChange}
          values={values["basicInformationQuestions"]["pediatric_patient"]}
          error={errors?.["pediatric_patient"]}
        />
      </div>
    </div>
  );
});

export default BasicInformationForm;
