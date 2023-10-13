import { Select, TextInput } from "@mantine/core";
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
        <Select
          className="w-full"
          label="Chief Complaint"
          placeholder="Chief Complaint"
          required
          data={[
            {
              label: "Abdominal Pain",
              value: "Abdominal Pain",
            },
            {
              label: "General Questions",
              value: "General Questions",
            },
            {
              label: "Cough",
              value: "Cough",
            },
            {
              label: "Diarrhea",
              value: "Diarrhea",
            },
            {
              label: "Earache",
              value: "Earache",
            },
            {
              label: "Fever",
              value: "Fever",
            },
            {
              label: "Headache",
              value: "Headache",
            },
            {
              label: "Injury",
              value: "Injury",
            },
            {
              label: "Muscle/Joint Pain",
              value: "Muscle/Joint Pain",
            },
            {
              label: "Rash",
              value: "Rash",
            },
            {
              label: "Runny Nose",
              value: "Runny Nose",
            },
            {
              label: "Sleep/Behavioral",
              value: "Sleep/Behavioral",
            },
            {
              label: "Sore Throat",
              value: "Sore Throat",
            },
            {
              label: "Urination Issue",
              value: "Urination Issue",
            },
            {
              label: "Vomiting",
              value: "Vomiting",
            },
            {
              label: "Other",
              value: "Other",
            },
          ]}
          {...form.getInputProps("chiefComplaint")}
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
