import React from "react";
import { useField } from "formik";
import { NumberInput, Select, TextInput, Radio, Checkbox } from "@mantine/core";
import { LuPencil } from "react-icons/lu";
import { MEDICAL_HISTORY_QUESTIONS } from "@/commons/constants/historyQuestions";
import CheckboxDescription from "./CheckboxDescription";

const MedicalHistoryForm = () => {
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
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.allergies_medical"
          placeholder={questions["allergies_medical"].placeholder}
          question={questions["allergies_medical"].question}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.medications"
          placeholder={questions["medications"].placeholder}
          question={questions["medications"].question}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.chronic_conditions"
          placeholder={questions["chronic_conditions"].placeholder}
          question={questions["chronic_conditions"].question}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.reproductive_issues"
          placeholder={questions["reproductive_issues"].placeholder}
          question={questions["reproductive_issues"].question}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.surgeries"
          placeholder={questions["surgeries"].placeholder}
          question={questions["surgeries"].question}
        />
        <CheckboxDescription
          formKey="medicalHistoryQuestions.hospitalizations"
          placeholder={questions["hospitalizations"].placeholder}
          question={questions["hospitalizations"].question}
        />
        {/* birth_type */}
        {/* weeks_born_at */}
        {/* birth_weight */}
        <CheckboxDescription
          formKey="medicalHistoryQuestions.birth_complications"
          placeholder={questions["birth_complications"].placeholder}
          question={questions["birth_complications"].question}
        />
      </div>
    </div>
  );
};

export default MedicalHistoryForm;

// const MyCheckbox = ({ children, ...props }) => {
//   // React treats radios and checkbox inputs differently from other input types: select and textarea.
//   // Formik does this too! When you specify `type` to useField(), it will
//   // return the correct bag of props for you -- a `checked` prop will be included
//   // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
//   const [field, meta] = useField({ ...props, type: 'checkbox' });
//   return (
//     <div>
//       <label className="checkbox-input">
//         <input type="checkbox" {...field} {...props} />
//         {children}
//       </label>
//       {meta.touched && meta.error ? (
//         <div className="error">{meta.error}</div>
//       ) : null}
//     </div>
//   );
// };

// const MySelect = ({ label, ...props }) => {
//   const [field, meta] = useField(props);
//   return (
//     <div>
//       <label htmlFor={props.id || props.name}>{label}</label>
//       <select {...field} {...props} />
//       {meta.touched && meta.error ? (
//         <div className="error">{meta.error}</div>
//       ) : null}
//     </div>
//   );
// };
