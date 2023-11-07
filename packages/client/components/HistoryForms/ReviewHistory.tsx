import React from "react";

type Props = {
  values: Record<string, object>;
};

const ReviewHistory = ({ values }: Props) => {
  return (
    <div className="flex flex-col gap-y-8">
      {Object.keys(values).map((section) => (
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
              switch (question.type) {
                case "checkbox-description":
                  return (
                    <div className="grid grid-cols-12 gap-y-1">
                      <p className="font-medium col-span-8 md:col-span-3">
                        {question.question}
                      </p>
                      <p className="col-span-4 md:col-span-2">
                        {question.answer}
                      </p>
                      <p className="text-sm text-gray-500 col-span-12 md:col-span-7">
                        {question.description
                          ? question.description
                          : "No description provided."}
                      </p>
                    </div>
                  );
                case "select":
                  return (
                    <div className="grid grid-cols-12">
                      <p className="font-medium col-span-8 md:col-span-3">
                        {question.question}
                      </p>
                      <p className="col-span-4 md:col-span-2 capitalize">
                        {question.answer}
                      </p>
                    </div>
                  );
                case "number-select":
                  return (
                    <div className="grid grid-cols-12">
                      <p className="font-medium col-span-8 md:col-span-3">
                        {question.question}
                      </p>
                      <p className="col-span-4 md:col-span-2 capitalize">
                        {question.answer} {question.select}
                      </p>
                    </div>
                  );
                case "checkbox":
                  return (
                    <div className="grid grid-cols-12 gap-y-1">
                      <p className="font-medium col-span-8 md:col-span-3">
                        {question.question}
                      </p>
                      <p className="col-span-4 md:col-span-2">
                        {question.answer}
                      </p>
                    </div>
                  );
                case "number":
                  return (
                    <div className="grid grid-cols-12">
                      <p className="font-medium col-span-8 md:col-span-3">
                        {question.question}
                      </p>
                      <p className="col-span-4 md:col-span-2">
                        {question.answer} weeks
                      </p>
                    </div>
                  );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewHistory;
