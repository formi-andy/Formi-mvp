import React from "react";
import { TextInput } from "@mantine/core";
import { HandleChange } from "@/types/formik-types";

type Props = {
  formKey: string;
  question: string;
  placeholder: string;
  handleChange: HandleChange;
  values: Record<string, string>;
  error: string | undefined;
};

const FormikDescription = ({
  formKey,
  question,
  placeholder,
  handleChange,
  values,
  error,
}: Props) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <p
        className={`col-span-12 md:col-span-3 transition-all ${
          error && "text-red-500"
        }`}
      >
        {question}
      </p>
      <div className="hidden md:block col-span-2 h-full" />
      <div className="col-span-12 md:col-span-7 flex gap-x-2">
        <TextInput
          placeholder={placeholder}
          value={values.answer as string}
          onChange={handleChange}
          name={`${formKey}.answer`}
          className="w-full"
          error={error}
          classNames={{
            error: "hidden",
          }}
        />
        <span className="text-red-500">*</span>
      </div>
    </div>
  );
};

export default FormikDescription;
