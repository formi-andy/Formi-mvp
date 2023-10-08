"use client";

import { useState } from "react";
import Dropzone from "@/components/DropZone/DropZone";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { MultiSelect, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import RTE from "@/components/RTE/RTE";
import { MdNotes } from "react-icons/md";
import { LuFiles, LuLocate } from "react-icons/lu";

import BodySelect from "@/components/BodySelect/BodySelect";
import { INITIAL_PARTS_INPUT } from "@/components/BodySelect/BodySelect";
import style from "./create.module.css";
import AcceptedFiles from "@/components/DropZone/AcceptedFiles";
import SelectedAreas from "@/components/BodySelect/SelectedParts";

const Upload = () => {
  const user = useAuth();
  const toast = useNetworkToasts();
  const [active, setActive] = useState(0);

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
      <p className="text-2xl font-medium mb-8">Create a Case</p>
      <div className="w-full h-full flex flex-col gap-y-6">
        <TextInput
          label="Title"
          placeholder="Case Title"
          required
          {...form.getInputProps("title")}
        />
        <div className="flex flex-col sm:flex-row gap-x-4">
          <TextInput
            className="w-full"
            label="Patient"
            placeholder="Patient"
            required
            {...form.getInputProps("patient")}
          />
        </div>
        <div className={style.gridContainer}>
          <div className={style.fileLabel}>
            <LuFiles size={24} /> Images{" "}
            <p className="text-[rgb(250,82,82)]">*</p>
          </div>
          <div className={style.areaLabel}>
            <LuLocate size={24} /> Symptom Areas
            <p className="text-[rgb(250,82,82)]">*</p>
          </div>
          <div
            className={`${style.dropzoneContainer} ${
              form.errors.files ? "border-[rgb(250,82,82)]" : ""
            }`}
          >
            <Dropzone
              data={form.values.files}
              setData={(data) => {
                form.setFieldValue("files", data);
              }}
            />
          </div>
          <div
            className={`${style.bodyContainer} ${
              form.errors.bodyParts ? "border-[rgb(250,82,82)]" : ""
            }`}
          >
            <BodySelect
              onClick={(bodyParts) => {
                form.setFieldValue("bodyParts", bodyParts);
              }}
              partsInput={form.values.bodyParts}
            />
          </div>
          <div className={style.acceptedFiles}>
            <AcceptedFiles
              data={form.values.files}
              setData={(data) => {
                form.setFieldValue("files", data);
              }}
            />
          </div>
          <div className={style.selectedParts}>
            <SelectedAreas
              bodyParts={form.values.bodyParts}
              setData={(parts) => {
                form.setFieldValue("bodyParts", parts);
              }}
            />
          </div>
        </div>
        <div className="flex items-center w-full border-b pb-4 text-xl font-medium gap-x-2">
          <MdNotes size={24} /> Notes
        </div>
        <div className="self-center w-full">
          <RTE
            content={form.values.description}
            onChange={(content) => {
              form.setFieldValue("description", content);
            }}
            maxLength={5000}
          />
        </div>
        <Button
          variant="action"
          className="w-fit"
          onClick={() => {
            console.log(form.values);
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
      </div>
    </>
  );
};

export default Upload;
