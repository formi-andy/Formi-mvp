"use client";

import { useState } from "react";
import PlatformTutorialModal from "./PlatformTutorialModal";

const PlatformTutorial = () => {
  const [opened, setOpened] = useState(true);

  return <PlatformTutorialModal opened={opened} setOpened={setOpened} />;
};

export default PlatformTutorial;
