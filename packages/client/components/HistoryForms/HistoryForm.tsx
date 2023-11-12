import React from "react";
import { CaseForm } from "@/app/case/create/page";
import { Radio, Select, TextInput, NumberInput } from "@mantine/core";

type Props = {
  form: CaseForm;
  section: string;
};

const HistoryForm = ({ form, section }: Props) => {
  const values = form.values.history;
  const pediatricPatient = form.values.profile.pediatricPatient;

  console.log(form.values.profile);

  return (
    <div className="grid gap-y-6 bg-formiblue rounded-lg text-white self-center p-8 w-fit min-w-[400px]">
      <div className="flex flex-col gap-y-2" key={section}>
        {section === "medicalHistoryQuestions" && (
          <p className="text-xl">Medical History Questions</p>
        )}
        {section === "familyHistoryQuestions" && (
          <p className="text-xl">Family History Questions</p>
        )}
        {section === "socialHistoryQuestions" && (
          <p className="text-xl">Social History Questions</p>
        )}
        <hr className="mb-2" />
        <div className="flex flex-col gap-y-4">
          {Object.keys(values[section]).map((key) => {
            const question = values[section][key];

            if (question.pediatric_question && pediatricPatient === "no") {
              return null;
            }

            switch (question.type) {
              case "checkbox-description":
                return (
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <p className="col-span-8 md:col-span-3 truncate transition-all">
                      {question.question}
                    </p>
                    <div className="col-span-4 md:col-span-2 flex">
                      <Radio.Group
                        required
                        value={question.answer as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.answer`,
                            e
                          );
                        }}
                        withAsterisk
                      >
                        <div className="flex gap-x-4">
                          <Radio
                            value="yes"
                            label="Yes"
                            classNames={{
                              radio: "cursor-pointer",
                              label: "cursor-pointer",
                            }}
                          />
                          <Radio
                            value="no"
                            label="No"
                            classNames={{
                              radio: "cursor-pointer",
                              label: "cursor-pointer",
                            }}
                          />
                          <span className="text-red-500 font-bold top-0">
                            *
                          </span>
                        </div>
                      </Radio.Group>
                    </div>
                    <div className="col-span-12 md:col-span-7">
                      <TextInput
                        name={`${section}.${key}.description`}
                        placeholder={question.placeholder}
                        value={question.description as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.description`,
                            e.currentTarget.value
                          );
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                );
              case "select":
                return (
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <p className="col-span-8 md:col-span-3 transition-all">
                      {question.question}
                    </p>
                    <div className="hidden md:block col-span-2 h-full" />
                    <div className="col-span-4 md:col-span-7 flex gap-x-2">
                      <Select
                        required
                        value={question.answer as string}
                        data={question.options}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.answer`,
                            e
                          );
                        }}
                        className="w-full"
                      />
                      <span className="text-red-500 font-bold">*</span>
                    </div>
                  </div>
                );
              case "number-select":
                return (
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <p className="col-span-8 md:col-span-3 transition-all">
                      {question.question}
                    </p>
                    <div className="col-span-4 md:col-span-2 flex">
                      <Radio.Group
                        required
                        value={question.select as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.select`,
                            e
                          );
                        }}
                        withAsterisk
                      >
                        <div className="flex gap-x-4">
                          <Radio
                            value="ibs"
                            label="Ibs"
                            // error={error?.select}

                            classNames={{
                              radio: "cursor-pointer",
                              label: "cursor-pointer",
                            }}
                          />
                          <Radio
                            value="kg"
                            label="Kg"
                            // error={error?.select}

                            classNames={{
                              radio: "cursor-pointer",
                              label: "cursor-pointer",
                            }}
                          />
                          <span className="text-red-500 font-bold">*</span>
                        </div>
                      </Radio.Group>
                    </div>
                    <div className="col-span-12 md:col-span-7 flex gap-x-2">
                      <NumberInput
                        value={question.answer as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.answer`,
                            e
                          );
                        }}
                        className="w-full"
                      />
                      <span className="text-red-500 font-bold">*</span>
                    </div>
                  </div>
                );
              case "checkbox":
                return (
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <p className="col-span-8 md:col-span-3 transition-all">
                      {question.question}
                    </p>
                    <div className="col-span-4 md:col-span-2 flex">
                      <Radio.Group
                        required
                        value={question.answer as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.answer`,
                            e
                          );
                        }}
                        withAsterisk
                      >
                        <div className="flex gap-x-4">
                          <Radio
                            value="yes"
                            label="Yes"
                            classNames={{
                              radio: "cursor-pointer",
                              label: "cursor-pointer",
                            }}
                          />
                          <Radio
                            value="no"
                            label="No"
                            classNames={{
                              radio: "cursor-pointer",
                              label: "cursor-pointer",
                            }}
                          />
                          <span className="text-red-500 font-bold">*</span>
                        </div>
                      </Radio.Group>
                    </div>
                  </div>
                );
              case "number":
                return (
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <p className="col-span-12 md:col-span-3 transition-all">
                      {question.question}
                    </p>
                    <div className="hidden md:block col-span-2 h-full" />
                    <div className="col-span-12 md:col-span-7 flex gap-x-2">
                      <NumberInput
                        value={question.answer as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.answer`,
                            e
                          );
                        }}
                        className="w-full"
                      />
                      <span className="text-red-500 font-bold">*</span>
                    </div>
                  </div>
                );
              case "description":
                return (
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <p className="col-span-12 md:col-span-3 transition-all">
                      {question.question}
                    </p>
                    <div className="hidden md:block col-span-2 h-full" />
                    <div className="col-span-12 md:col-span-7 flex gap-x-2">
                      <TextInput
                        placeholder={question.placeholder}
                        value={question.answer as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.answer`,
                            e.currentTarget.value
                          );
                        }}
                        className="w-full"
                      />
                      <span className="text-red-500 font-bold">*</span>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryForm;
