import { TextInput } from "@mantine/core";
import { LuFiles, LuLocate } from "react-icons/lu";

import Dropzone from "../DropZone/DropZone";
import BodySelect from "../BodySelect/BodySelect";
import AcceptedFiles from "../DropZone/AcceptedFiles";
import SelectedParts from "../BodySelect/SelectedParts";
import style from "./create.module.css";
import { CaseForm } from "@/app/case/create/page";

export default function PatientInfo({ form }: { form: CaseForm }) {
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
          <LuFiles size={20} /> Images{" "}
          <p className="text-[rgb(250,82,82)]">*</p>
        </div>
        <div className={style.areaLabel}>
          <LuLocate size={20} /> Symptom Areas
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
    </div>
  );
}
