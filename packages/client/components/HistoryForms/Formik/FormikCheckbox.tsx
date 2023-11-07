import React, { memo } from "react";
import { Radio } from "@mantine/core";
import { HandleChange } from "@/types/formik-types";

type Props = {
  formKey: string;
  question: string;
  handleChange: HandleChange;
  values: Record<string, string>;
  error: string | undefined;
};

const FormikCheckbox = memo(function FormikCheckbox({
  formKey,
  question,
  handleChange,
  values,
  error,
}: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <p
        className={`col-span-8 md:col-span-3 transition-all ${
          error && "text-red-500"
        }`}
      >
        {question}
      </p>
      <div className="col-span-4 md:col-span-2 flex">
        <Radio.Group
          required
          value={values.answer as string}
          onChange={(e) => {
            handleChange({
              target: {
                name: `${formKey}.answer`,
                value: e,
              },
            });
          }}
          withAsterisk
        >
          <div className="flex gap-x-4">
            <Radio
              value="Yes"
              label="Yes"
              error={error}
              classNames={{
                error: "hidden",
                radio: "cursor-pointer",
                label: "cursor-pointer",
              }}
            />
            <Radio
              value="No"
              label="No"
              error={error}
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
    </div>
  );
});

export default FormikCheckbox;
