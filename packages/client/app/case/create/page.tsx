"use client";

import { useState } from "react";
import Dropzone from "@/components/DropZone/DropZone";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import RTE from "@/components/RTE/RTE";
import { MdNotes } from "react-icons/md";
import { LuFiles } from "react-icons/lu";

const Upload = () => {
  const user = useAuth();
  const toast = useNetworkToasts();

  const form = useForm({
    initialValues: {
      title: "",
      type: "",
      patient: "",
      description: "",
      files: [] as {
        file: File;
        title: string;
      }[],
      history: [] as {
        question: string;
        answer: string | boolean;
      }[],
    },
  });

  return (
    <>
      <p className="text-2xl font-medium mb-8">Create a Case</p>
      <div className="w-full h-full flex flex-col gap-y-6">
        <TextInput label="Title" placeholder="Case for Andy" />
        <div className="flex flex-col sm:flex-row gap-x-4">
          <TextInput className="w-full" label="Patient" placeholder="Patient" />
          <TextInput
            className="w-full"
            label="Case Type"
            placeholder="Case Type"
          />
        </div>
        <div className="flex items-center w-full border-b pb-4 text-xl font-medium gap-x-2">
          <LuFiles size={24} /> Images
        </div>
        <div className="w-full relative gap-y-4 divide-y flex flex-col items-center rounded-lg border hover:border-blue-500 transition">
          <Dropzone data={form.values.files} setData={() => {}} />
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
        <Button variant="action" className="w-fit">
          Continue
        </Button>
      </div>
    </>
  );
};

export default Upload;
