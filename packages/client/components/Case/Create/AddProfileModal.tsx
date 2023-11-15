import { CaseForm } from "@/app/(private)/case/create/page";
import { INITIAL_HISTORY } from "@/commons/constants/historyQuestions";
import { ETHNICITIES, STATES } from "@/commons/constants/questions";
import { Button } from "@/components/ui/button";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Modal, TextInput, Select, MultiSelect } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useState } from "react";
import { isValidProfile } from "./StepOne";

export default function AddProfileModal({
  open,
  setOpen,
  form,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  form: CaseForm;
}) {
  const profileForm = useForm<CaseForm["values"]["profile"]>({
    initialValues: {
      firstName: "",
      lastName: "",
      ethnicity: [],
      state: null,
      sexAtBirth: null,
      dateOfBirth: null,
      pediatricPatient: "",
    },
  });
  const toast = useNetworkToasts();
  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      centered
      title="Add a profile"
      classNames={{
        body: "flex flex-col gap-y-3 sm:gap-y-6",
      }}
    >
      <div className="flex flex-col gap-y-3 sm:gap-y-6">
        <div className="flex gap-x-3 w-full">
          <TextInput
            classNames={{
              root: "w-full",
            }}
            label="First Name"
            {...profileForm.getInputProps("firstName")}
          />
          <TextInput
            classNames={{
              root: "w-full",
            }}
            label="Last Name"
            {...profileForm.getInputProps("lastName")}
          />
        </div>
        <DatePickerInput
          label="Date of Birth"
          maxDate={new Date()}
          {...profileForm.getInputProps("dateOfBirth")}
        />
        <Select
          label="Sex Assigned at Birth"
          data={[
            {
              label: "Male",
              value: "male",
            },
            {
              label: "Female",
              value: "female",
            },
          ]}
          {...profileForm.getInputProps("sexAtBirth")}
        />
        <MultiSelect
          searchable
          label="Race/Ethnicity"
          data={ETHNICITIES.map((category) => ({
            label: category,
            value: category,
          }))}
          {...profileForm.getInputProps("ethnicity")}
        />
        <Select
          searchable
          label="State you are currently in"
          data={STATES.map((state) => ({
            label: state,
            value: state,
          }))}
          {...profileForm.getInputProps("state")}
        />
        <Select
          label="Pediatric Patient?"
          data={[
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
          ]}
          {...profileForm.getInputProps("pediatricPatient")}
        />
      </div>
      <div className="flex gap-x-4 w-full justify-between">
        <Button
          variant="outline"
          className="w-24"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="action"
          className="w-24"
          onClick={async () => {
            if (!isValidProfile(profileForm.values)) {
              toast.error({
                title: "Failed to add profile",
                message: "Please fill out all fields",
              });
            } else {
              form.setFieldValue("profile", profileForm.values);
              form.setFieldValue("patient", {
                ...profileForm.values,
                id: "new",
              });
              form.setFieldValue("history", INITIAL_HISTORY);
              setOpen(false);
            }
          }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
