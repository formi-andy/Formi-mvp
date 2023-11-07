import React, { memo } from "react";
import { NumberInput } from "@mantine/core";
import { HandleChange } from "@/types/formik-types";

type Props = {
  formKey: string;
  question: string;
  handleChange: HandleChange;
  values: Record<string, string>;
  error: string | undefined;
};

const FormikNumberInput = memo(function FormikNumberInput({
  formKey,
  question,
  values,
  handleChange,
  error,
}: Props) {
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
        <NumberInput
          name={`${formKey}.answer`}
          value={values.answer as string}
          onChange={(e) => {
            handleChange({
              target: {
                name: `${formKey}.answer`,
                value: e,
              },
            });
          }}
          error={error}
          classNames={{
            error: "hidden",
          }}
          className="w-full"
        />
        <span className="text-red-500">*</span>
      </div>
    </div>
  );
});

export default FormikNumberInput;
