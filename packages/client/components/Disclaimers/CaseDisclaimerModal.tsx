"use client";

import React, { useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import HipaaDisclaimer from "./HipaaDisclaimer";
import CloseSiteDisclaimer from "./CloseSiteDisclaimer";
import MedicalInfoDisclaimer from "./MedicalInfoDisclaimer";

type Props = {};

const CaseDisclaimerModal = (props: Props) => {
  const [opened, { open, close }] = useDisclosure(true);
  const [slide, setSlide] = useState<"hipaa" | "close" | "medical">("close");
  const isMobile = useMediaQuery("(max-width: 820px)");

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      closeOnClickOutside={false}
      centered
      size={isMobile ? "80%" : "800"}
    >
      <div className="overflow-x-hidden">
        <div
          className={`flex w-full gap-x-4 transition-all duration-500 relative ${
            slide === "close"
              ? "right-0"
              : slide === "hipaa"
              ? "right-[100%]"
              : "right-[200%]"
          }`}
        >
          <div className="w-full relative h-full">
            <CloseSiteDisclaimer setSlide={setSlide} />
          </div>
          <div className="absolute left-[100%] w-full h-full">
            <HipaaDisclaimer setSlide={setSlide} />
          </div>
          <div className="absolute left-[200%] h-full w-full">
            <MedicalInfoDisclaimer close={close} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CaseDisclaimerModal;
