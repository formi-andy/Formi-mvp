"use client";

import { ReactNode, useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useForm } from "@mantine/form";
import axios from "axios";

import {
  LuCheckCircle,
  LuClipboardList,
  LuMessagesSquare,
  LuSend,
} from "react-icons/lu";
import { INITIAL_PARTS_INPUT } from "@/commons/constants/bodyParts";
import PatientInfo from "@/components/Case/Create/PatientInfo";
import CaseInfo from "@/components/Case/Create/CaseInfo";
import Review from "@/components/Case/Create/Review";
import { BASE_QUESTIONS } from "@/commons/constants/questions";
import { Stepper } from "@mantine/core";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import CaseDisclaimerModal from "@/components/Disclaimers/CaseDisclaimerModal";

function useCaseForm(active: number) {
  const form = useForm({
    initialValues: {
      title: "",
      patient: "",
      chiefComplaint: "",
      description: "",
      symptoms: "",
      age: "" as number | string,
      ethnicity: "",
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
          type: "text" | "textarea" | "boolean";
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
            values.title.trim().length === 0 ? "Case must have a title" : null,
          patient:
            values.patient.trim().length === 0
              ? "Case must have a patient"
              : null,
          files:
            values.files.length === 0
              ? "Case must have at least one image"
              : null,
          bodyParts: selected ? null : "Case must have at least one body part",
          symptoms:
            values.symptoms.trim().length === 0
              ? "Symptoms cannot be empty"
              : null,
          age: values.age === "" ? "Age cannot be empty" : null,
          ethnicity:
            values.ethnicity.trim().length === 0
              ? "Ethnicity cannot be empty"
              : null,
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
  const [active, setActive] = useState(0);
  const [uploading, setUploading] = useState(false);
  const createCase = useMutation(api.medical_case.createMedicalCase);
  const router = useRouter();

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

  // TODO: make this a queue job
  async function submitCase() {
    try {
      setUploading(true);
      toast.loading({
        title: "Creating case",
        message: "Please wait while we create your case",
      });

      const symptomAreas: string[] = [];
      let promises: Promise<string | null>[] = [];
      const token = await user.getToken({
        template: "convex",
      });

      for (const key in form.values.bodyParts) {
        if (form.values.bodyParts[key].selected) {
          const split = key.split(/(?=[A-Z])/);
          symptomAreas.push(split.join(" "));
        }
      }

      const { caseRecord } = await createCase({
        title: form.values.title,
        patient_id: form.values.patient,
        chief_complaint: form.values.chiefComplaint,
        description: form.values.description,
        symptom_areas: symptomAreas,
        symptoms: form.values.symptoms,
        age: form.values.age === "" ? undefined : Number(form.values.age),
        ethnicity: form.values.ethnicity,
        medical_history: Object.keys(form.values.questions).map((key) => {
          return {
            question: form.values.questions[key].question,
            answer: form.values.questions[key].answer,
          };
        }),
        tags: [],
      });

      // upload images to convex
      for (let i = 0; i < form.values.files.length; i++) {
        const file = form.values.files[i];
        const sendImageUrl = new URL(
          `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/send-image?&caseId=${caseRecord}&title=${file.title}`
        );
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              const res = await fetch(sendImageUrl, {
                method: "POST",
                headers: {
                  "Content-Type": file.file!.type,
                  Authorization: `Bearer ${token}`,
                },
                body: file.file,
              });

              const data = await res.json();
              resolve(data.url);
            } catch (error) {
              reject(error);
            }
          })
        );
      }
      const attachments = await Promise.all(promises);

      let instructions =
        "## **Instructions** \n\n You will be given a group of images and a set of questions and answers. Using this information, you will be asked to diagnose the patient. \n\n";
      instructions += `### Patient Age: ${form.values.age} \n\n`;
      instructions += `### Patient Ethnicity: ${form.values.ethnicity}\n\n`;
      instructions += `### Symptom Areas \n\n ${symptomAreas.join(", ")} \n\n`;
      instructions += `### Symptoms \n\n ${form.values.symptoms} \n\n`;
      instructions += Object.keys(form.values.questions)
        .map((key) => {
          return `### ${form.values.questions[key].question}\n${form.values.questions[key].answer} \n`;
        })
        .join("");
      instructions += "\n\n### **Additional Information** \n\n";
      instructions += form.values.description;

      // create scale batch and task
      await axios.post(`/api/scale?caseId=${caseRecord}&batchName=${""}`, {
        attachments,
        instructions,
      });
      toast.success({
        title: "Case created",
        message: "Your case has been created successfully",
      });

      // setActive(0);
      // form.reset();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error({
        title: "Failed to create case",
        message: "Something went wrong while creating your case",
      });
    } finally {
      setUploading(false);
    }
  }

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
        disabled={uploading}
        variant="action"
        className="w-fit mt-6"
        onClick={() => {
          if (form.validate().hasErrors) {
            handleError(form.errors);
            return;
          }

          if (active === 2) {
            submitCase();
          } else {
            setActive((current) => {
              return current + 1;
            });
          }
        }}
      >
        {active === 2 ? "Create Case" : "Continue"}
      </Button>
      <CaseDisclaimerModal />
    </>
  );
};

export default Upload;
