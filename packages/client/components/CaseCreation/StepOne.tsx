import { TextInput } from "@mantine/core";
import { MdNotes } from "react-icons/md";
import { LuFiles, LuLocate } from "react-icons/lu";

import Dropzone from "../DropZone/DropZone";
import BodySelect from "../BodySelect/BodySelect";
import AcceptedFiles from "../DropZone/AcceptedFiles";
import SelectedParts from "../BodySelect/SelectedParts";
import RTE from "../RTE/RTE";
import style from "./create.module.css";
import { CaseForm } from "@/app/case/create/page";

export default function StepOne({ form }: { form: CaseForm }) {
  return (
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
          <SelectedParts
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
    </div>
  );
}
