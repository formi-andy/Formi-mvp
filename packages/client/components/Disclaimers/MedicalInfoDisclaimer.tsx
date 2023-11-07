"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "@mantine/core";

type Props = {
  close: () => void;
};

const MedicalInfoDisclaimer = ({ close }: Props) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col justify-between h-full items-center px-16 py-4 gap-y-4">
      <div className="flex flex-col gap-y-8">
        <p className="text-2xl text-center">
          HomeScope Does Not Provide Medical Advice
        </p>
        <p className="text-lg">
          By checking this box, you acknowledge that the content contained on
          the HomeScope site is for informational purposes only. HomeScope is
          not intended to be a substitute for professional medical advice,
          diagnosis, or treatment.
        </p>
        <p className="text-lg">
          Always seek the advice of your phsyician or other qualified health
          provider with any questions you amy have regarding a medical
          condition.
        </p>
        <p className="text-lg">
          Never disregard professional medical advice or delay seeking care
          because of something you have read on HomeScope. Reliance on any
          information provided by HomeScope is solely at your own risk.
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
        <Button disabled={!checked} onClick={close}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MedicalInfoDisclaimer;
