import React from "react";
import { Radio, TextInput } from "@mantine/core";
import { useField } from "formik";

type Props = {
  formKey: string;
  question: string;
  placeholder: string;
};

const CheckboxDescription = ({ formKey, question, placeholder }: Props) => {
  const [answer, answerMeta] = useField(`${formKey}.answer`);
  const [description, descriptionMeta] = useField(`${formKey}.description`);

  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <p className="col-span-3 truncate">{question}</p>
      <div className="col-span-2 flex">
        <Radio.Group
          required
          value={answer.value as string}
          onChange={(value) =>
            answer.onChange({
              target: {
                name: `${formKey}.answer`,
                value,
              },
            })
          }
          withAsterisk
        >
          {answerMeta.touched && answerMeta.error ? (
            <div className="error">{answerMeta.error}</div>
          ) : null}
          <div className="flex gap-x-4">
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
            <span className="text-red-500">*</span>
          </div>
        </Radio.Group>
      </div>
      <div className="col-span-7">
        <TextInput
          placeholder={placeholder}
          value={description.value as string}
          onChange={(e) => {
            description.onChange(e);
          }}
          name={`${formKey}.description`}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CheckboxDescription;
