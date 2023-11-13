"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "@mantine/core";

type Props = {
  setSlide: Dispatch<SetStateAction<"close" | "medical" | "hipaa">>;
};

const CloseSiteDisclaimer = ({ setSlide }: Props) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-center py-4 px-6 gap-y-4">
      <p className="text-2xl text-center">
        Close this site and call 911, if you or someone
      </p>
      <ul className="list-disc">
        <li>
          <p className="text-lg">
            Is not responsive, turning blue, or having severe difficulty
            breathing
          </p>
        </li>
        <li>
          <p className="text-lg">Cannot touch their chin to their chest</p>
        </li>
        <li>
          <p className="text-lg">Is excessively drooling or leaning forward</p>
        </li>
        <li>
          <p className="text-lg">
            Has extreme abdominal pain or pain in their testicles
          </p>
        </li>
        <li>
          <p className="text-lg">
            Has an obvious deformity after being hit by something or falling
          </p>
        </li>
        <li>
          <p className="text-lg">Has ingested a battery or magnet</p>
        </li>
        <li>
          <p className="text-lg">Is bleeding excessively</p>
        </li>
        <li>
          <p className="text-lg">Has suddenly lost their hearing or vision</p>
        </li>
        <li>
          <p className="text-lg">Is unable to open their mouth</p>
        </li>
        <li>
          <p className="text-lg">Is unable to walk or stand</p>
        </li>
        <li>
          <p className="text-lg">
            Is having a seizure or an extremely severe headache
          </p>
        </li>
        <li>
          <p className="text-lg">
            Is under 15 months of age and has a feever over 100.4°F
          </p>
        </li>
        <li>
          <p className="text-lg">
            Or if you feel this is a life threating event
          </p>
        </li>
      </ul>
      <div className="flex flex-col gap-y-4 items-center">
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          classNames={{
            body: "flex items-center gap-x-2",
          }}
          label={<p className="text-lg">I understand</p>}
        />
        <Button disabled={!checked} onClick={() => setSlide("hipaa")}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CloseSiteDisclaimer;
