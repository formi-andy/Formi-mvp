import { CaseForm } from "@/app/case/create/page";
import AcceptedFiles from "@/components/ui/DropZone/AcceptedFiles";
import Dropzone from "@/components/ui/DropZone/DropZone";
import React from "react";

export default function UploadStep({ form }: { form: CaseForm }) {
  return (
    <div className="self-center flex flex-col gap-6 p-8 rounded-lg items-center bg-formiblue w-fit max-w-[80vw] min-w-[400px]">
      <p className="font-semibold text-center text-xl sm:text-2xl text-white">
        Submit Images
      </p>
      <Dropzone
        data={form.values.files}
        setData={(data) => {
          form.setFieldValue("files", data);
        }}
      />
      <div className="w-full">
        <AcceptedFiles
          data={form.values.files}
          setData={(data) => {
            form.setFieldValue("files", data);
          }}
        />
      </div>
    </div>
  );
}
