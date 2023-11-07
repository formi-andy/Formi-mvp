"use client";

import { useState, useRef } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";

import {
  LuCheckCircle,
  LuClipboardList,
  LuUsers,
  LuSend,
} from "react-icons/lu";
import { MdOutlineSocialDistance } from "react-icons/md";
import {
  MEDICAL_HISTORY_QUESTIONS,
  FAMILY_HISTORY_QUESTIONS,
  SOCIAL_HISTORY_QUESTIONS,
} from "@/commons/constants/historyQuestions";
import { Stepper } from "@mantine/core";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import MedicalHistoryForm from "@/components/HistoryForms/MedicalHistoryForm";
import FamilyHistoryForm from "@/components/HistoryForms/FamilyHistoryForm";
import SocialHistoryForm from "@/components/HistoryForms/SocialHistoryForm";
import ReviewHistory from "@/components/HistoryForms/ReviewHistory";

const HistoryPage = () => {
  const user = useAuth();
  const toast = useNetworkToasts();
  const [active, setActive] = useState(0);
  const firstSubmission = useRef(false);
  const router = useRouter();

  const createHistory = useMutation(api.history.createHistory);

  // TODO: make this a queue job
  async function submitHistory(values: Record<string, object>) {
    try {
      toast.loading({
        title: "Uploading history",
        message: "Please wait while we upload your history",
      });

      const cleanedValues = {} as any;

      // clean up values
      for (const section in values) {
        for (const key in values[section]) {
          const question = values[section][key];

          if (question.type === "number-select") {
            cleanedValues[key] = {
              answer: parseInt(question.answer),
              select: question.select,
            };
          } else if (question.type === "checkbox-description") {
            cleanedValues[key] = {
              answer: question.answer === "Yes" ? true : false,
              description: question.description,
            };
          } else if (question.type === "checkbox") {
            cleanedValues[key] = question.answer === "Yes" ? true : false;
          } else if (question.type === "number") {
            cleanedValues[key] = parseInt(question.answer);
          } else {
            cleanedValues[key] = question.answer;
          }
        }
      }

      const { historyRecord } = await createHistory({
        ...cleanedValues,
      });
    } catch (error) {
      console.log(error);
      toast.error({
        title: "Failed to upload history",
        message: "Something went wrong while creating your history",
      });
    } finally {
      toast.success({
        title: "History uploaded",
        message: "Your history has been uploaded successfully",
      });

      router.push("/dashboard");
    }
  }

  return (
    <>
      <p className="text-2xl font-medium mb-12">
        {active === 0 && "Medical History"}
        {active === 1 && "Family History"}
        {active === 2 && "Social History"}
        {active === 3 && "Review"}
      </p>
      <Stepper
        size="sm"
        classNames={{
          root: "w-full max-w-[720px] self-center mb-12",
        }}
        allowNextStepsSelect={false}
        active={active}
        onStepClick={setActive}
        completedIcon={<LuCheckCircle size={20} />}
      >
        <Stepper.Step
          icon={<LuClipboardList size={20} />}
          label="Step 1"
          description="Medical History"
        />
        <Stepper.Step
          icon={<LuUsers size={20} />}
          label="Step 2"
          description="Family History"
        />
        <Stepper.Step
          icon={<MdOutlineSocialDistance size={20} />}
          label="Step 3"
          description="Social History"
        />
        <Stepper.Step
          icon={<LuSend size={20} />}
          label="Step 4"
          description="Review and Submit"
        />
      </Stepper>
      <Formik
        initialValues={{
          medicalHistoryQuestions: { ...MEDICAL_HISTORY_QUESTIONS },
          familyHistoryQuestions: { ...FAMILY_HISTORY_QUESTIONS },
          socialHistoryQuestions: { ...SOCIAL_HISTORY_QUESTIONS },
        }}
        validateOnChange={true}
        validate={(values) => {
          if (!firstSubmission.current) {
            return {};
          }
          const errors = {};
          const questions =
            active === 0
              ? values.medicalHistoryQuestions
              : active === 1
              ? values.familyHistoryQuestions
              : values.socialHistoryQuestions;
          for (const key in questions) {
            if (
              questions[key].type === "number-select" &&
              (!questions[key].answer || !questions[key].select)
            ) {
              errors[key] = {
                answer: questions[key].answer
                  ? null
                  : "Please answer this question",
                select: questions[key].select
                  ? null
                  : "Please select an option",
              };
            } else if (
              questions[key].answer === null ||
              questions[key].answer === undefined ||
              questions[key].answer === ""
            ) {
              errors[key] = "Please answer all questions before continuing";
            }
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          submitHistory(values);

          setTimeout(() => {
            setSubmitting(false);
          }, 2000);
        }}
      >
        {({
          isSubmitting,
          values,
          handleChange,
          submitForm,
          validateForm,
          setSubmitting,
          errors,
        }) => (
          <Form>
            <div className={`transition-all `}>
              {active === 0 && (
                <MedicalHistoryForm
                  errors={errors}
                  values={values}
                  handleChange={handleChange}
                />
              )}
              {active === 1 && (
                <FamilyHistoryForm
                  errors={errors}
                  values={values}
                  handleChange={handleChange}
                />
              )}
              {active === 2 && (
                <SocialHistoryForm
                  errors={errors}
                  values={values}
                  handleChange={handleChange}
                />
              )}
            </div>
            {active === 3 && <ReviewHistory values={values} />}
            <Button
              disabled={isSubmitting}
              type="button"
              variant="action"
              className="w-fit mt-6"
              onClick={async () => {
                if (active === 3) {
                  setSubmitting(true);
                  await submitForm();
                  setSubmitting(false);
                } else {
                  firstSubmission.current = true;
                  validateForm().then((errors) => {
                    if (Object.keys(errors).length > 0) {
                      toast.error({
                        message:
                          "Please answer all questions before continuing",
                      });
                      return;
                    } else {
                      setActive((current) => {
                        return current + 1;
                      });
                      firstSubmission.current = false;
                    }
                  });
                }
              }}
            >
              {active === 3 ? "Save History" : "Continue"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default HistoryPage;
