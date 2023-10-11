"use client";

import { ReactNode, useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "@mantine/form";

import {
  LuCheckCircle,
  LuClipboardList,
  LuMessagesSquare,
  LuSend,
} from "react-icons/lu";
import { INITIAL_PARTS_INPUT } from "@/commons/constants/bodyParts";
import PatientInfo from "@/components/CaseCreation/PatientInfo";
import CaseInfo from "@/components/CaseCreation/CaseInfo";
import Review from "@/components/CaseCreation/Review";
import { BASE_QUESTIONS } from "@/commons/constants/questions";
import { Stepper } from "@mantine/core";

function useCaseForm(active: number) {
  const form = useForm({
    initialValues: {
      title: "",
      patient: "",
      description: "",
      files: [] as {
        file: File;
        title: string;
      }[],
      bodyParts: INITIAL_PARTS_INPUT,
      questions: {
        ...BASE_QUESTIONS.reduce((acc, question) => {
          return {
            ...acc,
            [question.question]: {
              question: question.question,
              type: question.type,
              placeholder: question.placeholder,
              answer: question.type === "text" ? "" : null,
            },
          };
        }, {}),
      } as Record<
        string,
        {
          question: string;
          type: "text" | "boolean";
          placeholder?: string;
          answer: string | boolean | null;
        }
      >,
    },
    validate: (values) => {
      if (active === 0) {
        const parts = form.values.bodyParts;
        let selected = false;
        for (const key in parts) {
          if (parts[key].selected) {
            selected = true;
          }
        }
        return {
          title:
            values.title.trim().length === 0 ? "Case must have title" : null,
          patient:
            values.patient.trim().length === 0
              ? "Case must have patient"
              : null,
          files:
            values.files.length === 0
              ? "Case must have at least one image"
              : null,
          bodyParts: selected ? null : "Case must have at least one body part",
        };
      }

      if (active === 1) {
        const questions = form.values.questions;

        let invalid: Record<string, ReactNode> = {};
        Object.keys(questions).forEach((key) => {
          let question = questions[key];
          if (question.type === "text") {
            invalid[key] =
              (question.answer as string).trim().length === 0
                ? "Please answer this question"
                : null;
          } else {
            invalid[key] =
              question.answer === null ? "Please answer this question" : null;
          }
        });

        return invalid;
      }

      return {};
    },
  });

  return form;
}

export type CaseForm = ReturnType<typeof useCaseForm>;

const Upload = () => {
  const user = useAuth();
  const toast = useNetworkToasts();
  const [active, setActive] = useState(1);

  const form = useCaseForm(active);

  const handleError = (errors: typeof form.errors) => {
    if (errors.title) {
      toast.error({ message: "Please fill the title field" });
    } else if (errors.patient) {
      toast.error({
        message: "Please select a patient",
      });
    } else if (errors.files) {
      toast.error({
        message: "Please upload at least one image",
      });
    } else if (errors.bodyParts) {
      toast.error({
        message: "Please select at least one body part",
      });
    } else if (errors.questions) {
      toast.error({
        message: "Please answer all questions before continuing",
      });
    }
  };

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
          description="Patient Information"
        />
        <Stepper.Step
          icon={<LuMessagesSquare size={20} />}
          label="Step 2"
          description="Case Information"
        />
        <Stepper.Step
          icon={<LuSend size={20} />}
          label="Step 3"
          description="Review & Submit"
        />
      </Stepper>
      {active === 0 && <PatientInfo form={form} />}
      {active === 1 && <CaseInfo form={form} />}
      {active === 2 && <Review form={form} />}
      <Button
        variant="action"
        className="w-fit mt-6"
        onClick={() => {
          if (form.validate().hasErrors) {
            handleError(form.errors);
            return;
          }

          if (active === 2) {
            // submit form
          } else {
            setActive((current) => {
              return current + 1;
            });
          }
        }}
      >
        {active === 2 ? "Submit" : "Continue"}
      </Button>
    </>
  );
};

export default Upload;
