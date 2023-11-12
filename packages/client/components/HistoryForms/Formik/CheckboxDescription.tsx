import React, { memo } from "react";
import { Radio, TextInput } from "@mantine/core";
import { HandleChange } from "@/types/formik-types";

type Props = {
  formKey: string;
  question: string;
  placeholder: string;
  handleChange: HandleChange;
  values: Record<string, string>;
  error: string | undefined;
};

const CheckboxDescription = memo(function CheckboxDescription({
  formKey,
  question,
  placeholder,
  handleChange,
  values,
  error,
}: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <p
        className={`col-span-8 md:col-span-3 truncate transition-all ${
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
              value="yes"
              label="Yes"
              error={error}
              classNames={{
                error: "hidden",
                radio: "cursor-pointer",
                label: "cursor-pointer",
              }}
            />
            <Radio
              value="no"
              label="No"
              error={error}
              classNames={{
                error: "hidden",
                radio: "cursor-pointer",
                label: "cursor-pointer",
              }}
            />
            <span className="text-red-500 top-0">*</span>
          </div>
        </Radio.Group>
      </div>
      <div className="col-span-12 md:col-span-7">
        <TextInput
          placeholder={placeholder}
          value={values.description as string}
          onChange={handleChange}
          name={`${formKey}.description`}
          className="w-full"
        />
      </div>
    </div>
  );
});

export default CheckboxDescription;
