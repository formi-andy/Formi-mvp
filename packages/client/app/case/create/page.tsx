"use client";

import { useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "@mantine/form";

import { INITIAL_PARTS_INPUT } from "@/components/BodySelect/BodySelect";
import StepOne from "@/components/CaseCreation/StepOne";

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
      history: [] as {
        question: string;
        answer: string | boolean;
      }[],
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
        return {};
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
  const [active, setActive] = useState(0);

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
    }
  };

  return (
    <>
      <p className="text-2xl font-medium mb-6">Create a Case</p>
      <StepOne form={form} />
      <Button
        variant="action"
        className="w-fit mt-6"
        onClick={() => {
          setActive((current) => {
            if (form.validate().hasErrors) {
              handleError(form.errors);
              return current;
            }
            return current < 3 ? current + 1 : current;
          });
        }}
      >
        Continue
      </Button>
    </>
  );
};

export default Upload;
