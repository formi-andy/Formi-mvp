import { NumberInput, Select, TextInput, Textarea } from "@mantine/core";

import Dropzone from "../DropZone/DropZone";
import BodySelect from "../BodySelect/BodySelect";
import AcceptedFiles from "../DropZone/AcceptedFiles";
import SelectedParts from "../BodySelect/SelectedParts";
import style from "./create.module.css";
import { CaseForm } from "@/app/case/create/page";
import { CHIEF_COMPLAINTS } from "@/commons/constants/complaints";

export default function PatientInfo({ form }: { form: CaseForm }) {
  return (
    <div className="w-full h-full flex flex-col gap-y-6">
      <TextInput
        label="Title"
        placeholder="Case Title"
        required
        {...form.getInputProps("title")}
      />
      <div className="flex flex-col sm:flex-row gap-x-4 gap-y-6">
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
          data={CHIEF_COMPLAINTS}
          {...form.getInputProps("chiefComplaint")}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-x-4 gap-y-6">
        <NumberInput
          className="w-full"
          label="Patient Age"
          placeholder="Patient Age"
          required
          {...form.getInputProps("age")}
        />
        <TextInput
          className="w-full"
          label="Race/Ethnicity"
          placeholder="Race/Ethnicity"
          required
          {...form.getInputProps("ethnicity")}
        />
      </div>
      <div className={style.gridContainer}>
        <div className={style.fileContainer}>
          <div className={style.containerLabel}>
            Images <p className="text-[rgb(250,82,82)]">*</p>
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
          <AcceptedFiles
            data={form.values.files}
            setData={(data) => {
              form.setFieldValue("files", data);
            }}
          />
        </div>
        <div className={style.bodyContainer}>
          <div className={style.containerLabel}>
            Symptom Areas <p className="text-[rgb(250,82,82)]">*</p>
          </div>
          <div
            className={`${style.bodySelectContainer} ${
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
        </div>
        <div className={style.symptoms}>
          <div className="flex whitespace-pre font-medium text-lg">
            Symptoms <p className="text-[rgb(250,82,82)]">*</p>
          </div>
          <Textarea
            className="w-full mt-2"
            placeholder="Describe the symptoms, be as detailed as possible"
            minRows={4}
            maxLength={5000}
            autosize
            required
            {...form.getInputProps("symptoms")}
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
