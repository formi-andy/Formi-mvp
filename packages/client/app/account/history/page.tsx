"use client";

import { useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";

import {
  LuCheckCircle,
  LuClipboardList,
  LuMessagesSquare,
  LuSend,
} from "react-icons/lu";
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
import HistoryForm from "@/components/HistoryForms/HistoryForm";
import MedicalHistoryForm from "@/components/HistoryForms/MedicalHistoryForm";

type QuestionValue = {
  question: string;
  type:
    | "checkbox-description"
    | "checkbox"
    | "select"
    | "number"
    | "number-select"
    | "description";
  placeholder?: string;
  answer: string | boolean | null;
  description?: string;
  select?: string | null;
  options?: Record<string, string>[];
};

const HistoryPage = () => {
  const user = useAuth();
  const toast = useNetworkToasts();
  const [active, setActive] = useState(0);
  const [uploading, setUploading] = useState(false);
  const createCase = useMutation(api.medical_case.createMedicalCase);
  const router = useRouter();

  // const handleError = (errors: typeof form.errors) => {
  //   if (errors.title) {
  //     toast.error({ message: "Please fill the title field" });
  //   } else if (errors.patient) {
  //     toast.error({
  //       message: "Please select a patient",
  //     });
  //   } else if (errors.files) {
  //     toast.error({
  //       message: "Please upload at least one image",
  //     });
  //   } else if (errors.bodyParts) {
  //     toast.error({
  //       message: "Please select at least one body part",
  //     });
  //   } else if (errors.questions) {
  //     toast.error({
  //       message: "Please answer all questions before continuing",
  //     });
  //   }
  // };

  // TODO: make this a queue job
  // async function submitCase() {
  //   try {
  //     setUploading(true);
  //     toast.loading({
  //       title: "Creating case",
  //       message: "Please wait while we create your case",
  //     });

  //     const symptomAreas: string[] = [];
  //     let promises: Promise<string | null>[] = [];
  //     const token = await user.getToken({
  //       template: "convex",
  //     });

  //     const { caseRecord } = await createCase({
  //       title: form.values.title,
  //       patient_id: form.values.patient,
  //       chief_complaint: form.values.chiefComplaint,
  //       description: form.values.description,
  //       symptom_areas: symptomAreas,
  //       symptoms: form.values.symptoms,
  //       age: form.values.age === "" ? undefined : Number(form.values.age),
  //       ethnicity: form.values.ethnicity,
  //       medical_history: Object.keys(form.values.questions).map((key) => {
  //         return {
  //           question: form.values.questions[key].question,
  //           answer: form.values.questions[key].answer,
  //         };
  //       }),
  //       tags: [],
  //     });

  //     // setActive(0);
  //     // form.reset();
  //     router.push("/dashboard");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error({
  //       title: "Failed to create case",
  //       message: "Something went wrong while creating your case",
  //     });
  //   } finally {
  //     setUploading(false);
  //   }
  // }
  // useEffect(() => {
  //   form.setFieldValue(
  //     `medicalHistoryQuestions.immunizations.description`,
  //     "what the actual"
  //   );
  // }, []);

  // console.log("form: ", form.values.medicalHistoryQuestions.immunizations);

  return (
    <>
      <p className="text-2xl font-medium mb-12">Create a Case</p>
      <Stepper
        size="sm"
        classNames={{
          root: "w-full max-w-[640px] self-center mb-12",
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
          icon={<LuMessagesSquare size={20} />}
          label="Step 2"
          description="Family History"
        />
        <Stepper.Step
          icon={<LuSend size={20} />}
          label="Step 3"
          description="Social History"
        />
        <Stepper.Step
          icon={<LuSend size={20} />}
          label="Step 4"
          description="Review"
        />
      </Stepper>
      <Formik
        initialValues={{
          medicalHistoryQuestions: { ...MEDICAL_HISTORY_QUESTIONS },
          familyHistoryQuestions: { ...FAMILY_HISTORY_QUESTIONS },
          socialHistoryQuestions: { ...SOCIAL_HISTORY_QUESTIONS },
        }}
        validateOnChange={false}
        validate={(values) => {
          const errors = {};
          const questions =
            active === 0
              ? values.medicalHistoryQuestions
              : active === 1
              ? values.familyHistoryQuestions
              : values.socialHistoryQuestions;
          for (const key in questions) {
            if (
              questions[key].answer === null ||
              (questions[key].type === "number-select" &&
                questions[key].select === null)
            ) {
              console.log("error: ", key, questions[key]);
              errors[key] = "Please answer all questions before continuing";
            }
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log("submitting values: ", values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {active === 0 && <MedicalHistoryForm />}
            {active === 1 && <HistoryForm section={"familyHistoryQuestions"} />}
            {active === 2 && <HistoryForm section={"socialHistoryQuestions"} />}
            <Button
              disabled={isSubmitting}
              type={active === 0 ? "submit" : "button"}
              variant="action"
              className="w-fit mt-6"
            >
              {active === 2 ? "Save History" : "Continue"}
            </Button>
          </Form>
        )}
      </Formik>
      {/* {active === 3 && <ReviewHistory form={form} />} */}
    </>
  );
};

export default HistoryPage;
