"use client";

import { ReactNode, useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useForm } from "@mantine/form";

import { BASE_QUESTIONS } from "@/commons/constants/questions";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import CaseDisclaimerModal from "@/components/Disclaimers/CaseDisclaimerModal";
import StepOne from "@/components/Case/Create/StepOne";
import StepTwo from "@/components/Case/Create/StepTwo";
import UploadStep from "@/components/Case/Create/UploadStep";
import ReviewStep from "@/components/Case/Create/ReviewStep";

const TOTAL_STEPS = 7;

function useCaseForm(active: number) {
  const form = useForm({
    initialValues: {
      chiefComplaint: "",
      symptoms: [] as string[],
      patient: null as {
        firstName: string;
        lastName: string;
        ethnicity: string[];
        dateOfBirth: Date | null;
        sexAtBirth: string | null;
        state: string | null;
        id: string;
      } | null,
      profile: {
        firstName: "",
        lastName: "",
        ethnicity: [] as string[],
        dateOfBirth: null as Date | null,
        sexAtBirth: null as string | null,
        state: null as string | null,
      } as {
        firstName: string;
        lastName: string;
        ethnicity: string[];
        dateOfBirth: Date | null;
        sexAtBirth: string | null;
        state: string | null;
      },
      duration: "",
      files: [] as {
        file: File;
        title: string;
      }[],
      questions: {} as Record<
        string,
        {
          question: string;
          type: "textinput" | "textarea" | "boolean";
          placeholder?: string;
          answer: string | boolean | null;
        }
      >,
    },
    validate: (values) => {
      if (active === 0) {
        return {
          duration:
            values.duration.trim().length === 0
              ? "Symptoms must have a duration"
              : null,
          chiefComplaint:
            values.chiefComplaint.trim().length === 0
              ? "Case must have a chief complaint"
              : null,
          patient: values.patient === null ? "Case must have a patient" : null,
        };
      }
      if (active === 1) {
        const questions = form.values.questions;

        let invalid: Record<string, ReactNode> = {};
        Object.keys(questions).forEach((key) => {
          let question = questions[key];
          if (question.type === "textinput" || question.type === "textarea") {
            invalid[key] =
              (question.answer as string).trim().length === 0
                ? "Please answer this question"
                : null;
          } else {
            invalid[key] =
              question.answer === null ? "Please answer this question" : null;
          }
        });

        Object.keys(invalid).forEach((key) => {
          if (invalid[key] === null) {
            delete invalid[key];
          }
        });

        return invalid;
      }

      if (active === 5) {
        return {
          files:
            values.files.length === 0
              ? "Case must have at least one image"
              : null,
        };
      }

      return {};
    },
  });

  return form;
}

export type CaseForm = ReturnType<typeof useCaseForm>;

export function isValidProfile(formProfile: CaseForm["values"]["profile"]) {
  if (formProfile === null) {
    return false;
  }
  return (
    formProfile.firstName !== "" &&
    formProfile.lastName !== "" &&
    formProfile.sexAtBirth !== null &&
    formProfile.sexAtBirth !== null &&
    formProfile.state !== "" &&
    formProfile.state !== null &&
    formProfile.dateOfBirth !== null &&
    formProfile.ethnicity.length > 0
  );
}

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

      if (!form.values.profile) {
        toast.error({
          title: "Failed to create case",
          message: "Please select a patient",
        });
        return;
      }

      let promises: Promise<string | null>[] = [];
      const token = await user.getToken({
        template: "convex",
      });

      const dateAsNumber = form.values.patient?.dateOfBirth?.getTime();
      const { caseRecord } = await createCase({
        chief_complaint: form.values.chiefComplaint,
        questions: Object.keys(form.values.questions).map((key) => {
          return {
            question: form.values.questions[key].question,
            answer: form.values.questions[key].answer,
          };
        }),
        duration: form.values.duration,
        medical_history: {},
        profile: {
          first_name: form.values.patient?.firstName as string,
          last_name: form.values.patient?.lastName as string,
          ethnicity: form.values.patient?.ethnicity as string[],
          date_of_birth: dateAsNumber as number,
          sex_at_birth: form.values.patient?.sexAtBirth as string,
          state: form.values.patient?.state as string,
        },
        patient_id: form.values.patient?.id as string,
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
      // let instructions =
      //   "## **Instructions** \n\n You will be given a group of images and a set of questions and answers. Using this information, you will be asked to diagnose the patient. \n\n";
      // instructions += `### Patient Age: ${form.values.age} \n\n`;
      // instructions += `### Patient Ethnicity: ${form.values.ethnicity}\n\n`;
      // instructions += `### Symptom Areas \n\n ${symptomAreas.join(", ")} \n\n`;
      // instructions += `### Symptoms \n\n ${form.values.symptoms} \n\n`;
      // instructions += Object.keys(form.values.questions)
      //   .map((key) => {
      //     return `### ${form.values.questions[key].question}\n${form.values.questions[key].answer} \n`;
      //   })
      //   .join("");
      // instructions += "\n\n### **Additional Information** \n\n";
      // instructions += form.values.description;

      // create scale batch and task
      // await axios.post(`/api/scale?caseId=${caseRecord}&batchName=${""}`, {
      //   attachments,
      //   instructions,
      // });
      // toast.success({
      //   title: "Case created",
      //   message: "Your case has been created successfully",
      // });

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
      <p className="text-2xl font-medium mb-8">Create a Case</p>
      {active === 0 && <StepOne form={form} />}
      {active === 1 && <StepTwo form={form} />}
      {/* {active === 2 && <Review form={form} />} */}
      {active === 5 && <UploadStep form={form} />}
      {active === 6 && <ReviewStep form={form} />}
      <div className="flex items-center gap-x-4 lg:gap-x-8 mt-4 px-8 lg:px-16">
        <Button
          disabled={uploading}
          variant="action"
          className="w-32"
          onClick={() => {
            if (active === 0) {
              router.push("/dashboard");
            } else {
              setActive((current) => {
                return current - 1;
              });
            }
          }}
        >
          Back
        </Button>
        <div className="flex flex-col w-full items-center gap-y-4 relative">
          <div className="flex gap-x-2 items-center">
            {[...Array(TOTAL_STEPS)].map((_, index) => {
              return (
                <div
                  className={`w-4 h-4 rounded-full ${
                    index > active ? "bg-blue-200" : "bg-formiblue"
                  }`}
                  key={index}
                />
              );
            })}
          </div>
          <p className="absolute mt-6">Step {active + 1} of 7</p>
        </div>
        <Button
          disabled={uploading}
          variant="action"
          className="w-40"
          onClick={() => {
            if (form.validate().hasErrors) {
              handleError(form.errors);
              return;
            }

            if (active === 6) {
              submitCase();
            } else {
              setActive((current) => {
                return current + 1;
              });
            }
          }}
        >
          {active === 6 ? "Create Case" : "Continue"}
        </Button>
      </div>
      {/* <CaseDisclaimerModal /> */}
    </>
  );
};

export default Upload;
