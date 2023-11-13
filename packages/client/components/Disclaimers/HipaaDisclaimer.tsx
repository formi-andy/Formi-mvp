"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "@mantine/core";

type Props = {
  setSlide: Dispatch<SetStateAction<"close" | "medical" | "hipaa">>;
};

const HipaaDisclaimer = ({ setSlide }: Props) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col justify-between h-full items-center px-16 py-4 gap-y-4">
      <div className="flex flex-col gap-y-8">
        <p className="text-2xl text-center">Formi is Not HIPAA Compliant</p>
        <p className="text-lg">
          This prototype is NOT compliant with the Health Insurance Portability
          and Accountability Act (HIPAA) or any other patient privacy laws. As
          such, it should not be used to process, store, or transmit any real
          patient health information (PHI).
        </p>
        <p className="text-lg">
          As this is a non-HIPAA compliant prototype, we cannot guarantee the
          confidentiality or security of any data entered into the system. Users
          are strongly discouraged from entering or using any real patient data.
        </p>
        <p className="text-lg">
          By checking this box you acknowledge that the submission of real
          patient data is at the risk of the user
        </p>
      </div>
      <div className="flex flex-col gap-y-4 items-center">
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          classNames={{
            body: "flex items-center gap-x-2",
          }}
          label={<p className="text-lg">I understand</p>}
        />
        <Button disabled={!checked} onClick={() => setSlide("medical")}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default HipaaDisclaimer;
