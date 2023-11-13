import React, { memo } from "react";
import { Radio, NumberInput } from "@mantine/core";
import { HandleChange } from "@/types/formik-types";

type Props = {
  formKey: string;
  question: string;
  handleChange: HandleChange;
  values: Record<string, string>;
  error: Record<string, string> | undefined;
};

const FormikNumberSelect = memo(function FormikNumberSelect({
  formKey,
  question,
  values,
  handleChange,
  error,
}: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <p
        className={`col-span-8 md:col-span-3 transition-all ${
          (error?.select || error?.answer) && "text-red-500"
        }`}
      >
        {question}
      </p>
      <div className="col-span-4 md:col-span-2 flex">
        <Radio.Group
          required
          name={`${formKey}.select`}
          value={values.select as string}
          onChange={(e) => {
            handleChange({
              target: {
                name: `${formKey}.select`,
                value: e,
              },
            });
          }}
          withAsterisk
        >
          <div className="flex gap-x-4">
            <Radio
              value="ibs"
              label="Ibs"
              error={error?.select}
              classNames={{
                error: "hidden",
                radio: "cursor-pointer",
                label: "cursor-pointer",
              }}
            />
            <Radio
              value="kg"
              label="Kg"
              error={error?.select}
              classNames={{
                error: "hidden",
                radio: "cursor-pointer",
                label: "cursor-pointer",
              }}
            />
            <span className="text-red-500">*</span>
          </div>
        </Radio.Group>
      </div>
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
          error={error?.answer}
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

export default FormikNumberSelect;
