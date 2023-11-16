import React from "react";
import { CaseForm } from "@/app/(private)/case/create/page";
import { Radio, Select, TextInput, NumberInput } from "@mantine/core";

type Props = {
  form: CaseForm;
  section: string;
};

function renderTitle(section: string) {
  switch (section) {
    case "medicalHistoryQuestions":
      return "Medical History Questions";
    case "familyHistoryQuestions":
      return "Family History Questions";
    case "socialHistoryQuestions":
      return "Social History Questions";
  }
}

const HistoryForm = ({ form, section }: Props) => {
  const values = form.values.history;
  const pediatricPatient = form.values.patient?.pediatricPatient;

  return (
    <div className="flex flex-col gap-y-6 bg-formiblue rounded-lg text-white self-center p-8 max-w-5xl w-full">
      <div className="flex flex-col gap-y-2" key={section}>
        <p className="text-xl font-semibold self-center text-center sm:text-2xl">
          {renderTitle(section)}
        </p>
        <div className="flex flex-col gap-y-4">
          {Object.keys(values[section]).map((key) => {
            const question = values[section][key];
            if (question.pediatric_question && pediatricPatient === "no") {
              return null;
            }

            switch (question.type) {
              case "checkbox-description":
                return (
                  <div
                    className="flex flex-col gap-y-3"
                    key={question.question}
                  >
                    <div className="flex justify-between items-center">
                      <p className="transition-all">{question.question}</p>
                      <Radio.Group
                        required
                        {...form.getInputProps(
                          `history.${section}.${key}.answer`
                        )}
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
                        </div>
                      </Radio.Group>
                    </div>
                    <TextInput
                      name={`${section}.${key}.description`}
                      placeholder={question.placeholder}
                      {...form.getInputProps(
                        `history.${section}.${key}.description`
                      )}
                      className="w-full"
                    />
                  </div>
                );
              case "select":
                return (
                  <div
                    className="flex flex-col sm:flex-row gap-3 sm:items-center"
                    key={question.question}
                  >
                    <p className="transition-all">{question.question}</p>
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
                      className="flex-1"
                    />
                  </div>
                );
              case "number-select":
                return (
                  <div
                    key={question.question}
                    className="flex items-center gap-x-3 justify-between"
                  >
                    <p className="transition-all">{question.question}</p>
                    <div className="flex items-center gap-x-3">
                      <Radio.Group
                        required
                        value={question.select as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.select`,
                            e
                          );
                        }}
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
                        </div>
                      </Radio.Group>
                      <NumberInput
                        hideControls
                        value={question.answer as string}
                        onChange={(e) => {
                          form.setFieldValue(
                            `history.${section}.${key}.answer`,
                            e
                          );
                        }}
                        className="w-20"
                      />
                    </div>
                  </div>
                );
              case "checkbox":
                return (
                  <div
                    key={question.question}
                    className="flex justify-between items-center"
                  >
                    <p className="transition-all">{question.question}</p>
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
                      </div>
                    </Radio.Group>
                  </div>
                );
              case "number":
                return (
                  <div
                    key={question.question}
                    className="flex items-center justify-between"
                  >
                    <p className="transition-all">{question.question}</p>
                    <NumberInput
                      value={question.answer as string}
                      onChange={(e) => {
                        form.setFieldValue(
                          `history.${section}.${key}.answer`,
                          e
                        );
                      }}
                      hideControls
                      className="w-20"
                    />
                  </div>
                );
              case "description":
                return (
                  <div
                    key={question.question}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
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
