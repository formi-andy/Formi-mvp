import React from "react";
import { useField } from "formik";
import { NumberInput, Select, TextInput, Radio, Checkbox } from "@mantine/core";
import { LuPencil } from "react-icons/lu";
import { MEDICAL_HISTORY_QUESTIONS } from "@/commons/constants/historyQuestions";

const HistoryForm = ({ section }: { section: string }) => {
  const questions = MEDICAL_HISTORY_QUESTIONS;

  return (
    <div className="grid gap-y-6">
      <div className="flex items-center w-full border-b pb-4 text-lg font-medium gap-x-2">
        <LuPencil size={20} /> Questions
      </div>
      <div className="flex flex-col gap-y-6">
        {Object.keys(questions).map((key, index) => {
          const question = questions[key];
          if (question.type === "checkbox-description") {
            return (
              <div
                key={`${section}_info_${index}`}
                className="grid grid-cols-12 gap-4 items-center"
              >
                <p className="col-span-3 truncate">{question.question}</p>
                <div className="col-span-2 flex">
                  <Radio.Group
                    required
                    value={questions[key].answer as string}
                    // onChange={(value) =>
                    //   form.setFieldValue(`${section}.${key}.answer`, value)
                    // }
                    // error={form.errors[key] && "This question is required"}
                    withAsterisk
                  >
                    <div className="flex gap-x-4">
                      <Radio value="yes" label="Yes" />
                      <Radio value="no" label="No" />
                      <span className="text-red-500">*</span>
                    </div>
                  </Radio.Group>
                </div>
                <div className="col-span-7">
                  {/* <TextInput
                    placeholder={question.placeholder}
                    value={question.description}
                    onChange={(e) => {
                      form.setFieldValue(
                        `${section}.${key}.description`,
                        e.currentTarget.value
                      );
                    }}
                    className="w-full"
                  /> */}
                  {/* <FormikTextInput
                    placeholder={question.placeholder}
                    formKey={`${section}.${key}.description`}
                  /> */}
                </div>
              </div>
            );
            // } else if (question.type === "select") {
            //   return (
            //     <div
            //       key={`${section}_info_${index}`}
            //       className="grid grid-cols-12 gap-4 items-center"
            //     >
            //       <p className="col-span-3 truncate">{question.question}</p>
            //       <div className="col-span-2 h-full" />
            //       <div className="col-span-7">
            //         <Select
            //           required
            //           value={form.values[section][key].answer as string}
            //           data={question.options}
            //           onChange={(value) => {
            //             const questionCopy = { ...questions[key] };
            //             questionCopy.answer = value;
            //             form.setFieldValue(`${section}.${key}`, questionCopy);
            //           }}
            //           className="w-full"
            //         />
            //       </div>
            //     </div>
            //   );
            // } else if (question.type === "number") {
            //   return (
            //     <div
            //       key={`${section}_info_${index}`}
            //       className="grid grid-cols-12 gap-4 items-center"
            //     >
            //       <p className="col-span-3 truncate">{question.question}</p>
            //       <div className="col-span-2 h-full" />
            //       <div className="col-span-7">
            //         <NumberInput
            //           value={form.values[section][key].answer as string}
            //           onChange={(value) => {
            //             const questionCopy = { ...questions[key] };
            //             questionCopy.answer = value;
            //             form.setFieldValue(section, questionCopy);
            //           }}
            //           className="w-full"
            //         />
            //       </div>
            //     </div>
            //   );
            // } else if (question.type === "number-select") {
            //   return (
            //     <div
            //       key={`${section}_info_${index}`}
            //       className="grid grid-cols-12 gap-4 items-center"
            //     >
            //       <p className="col-span-3 truncate">{question.question}</p>
            //       <div className="col-span-2 flex">
            //         <Radio.Group
            //           required
            //           value={questions[key].answer as string}
            //           onChange={(value) => {
            //             const questionCopy = { ...questions[key] };
            //             questionCopy.select = value;
            //             form.setFieldValue(section, questionCopy);
            //           }}
            //           error={form.errors[key] && "This question is required"}
            //           withAsterisk
            //         >
            //           <div className="flex gap-x-4">
            //             <Radio value="ibs" label="Ibs" />
            //             <Radio value="kg" label="Kg" />
            //             <span className="text-red-500">*</span>
            //           </div>
            //         </Radio.Group>
            //       </div>
            //       <div className="col-span-7">
            //         <NumberInput
            //           value={form.values[section][key].answer as string}
            //           onChange={(value) => {
            //             const questionCopy = { ...questions[key] };
            //             questionCopy.answer = value;
            //             form.setFieldValue(section, questionCopy);
            //           }}
            //           className="w-full"
            //         />
            //       </div>
            //     </div>
            //   );
            // } else if (question.type === "description") {
            //   return (
            //     <div
            //       key={`${section}_info_${index}`}
            //       className="grid grid-cols-12 gap-4 items-center"
            //     >
            //       <p className="col-span-3 truncate">{question.question}</p>
            //       <div className="col-span-2 h-full" />
            //       <div className="col-span-7">
            //         <TextInput
            //           placeholder={question.placeholder}
            //           value={question.description}
            //           onChange={(e) => {
            //             form.setFieldValue(
            //               `${section}.${key}.description`,
            //               e.currentTarget.value
            //             );
            //           }}
            //           className="w-full"
            //         />
            //       </div>
            //     </div>
            //   );
          } else {
            return <p key={`${section}_info_${index}`}>TO DO</p>;
          }
        })}
      </div>
    </div>
  );
};

export default HistoryForm;

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
