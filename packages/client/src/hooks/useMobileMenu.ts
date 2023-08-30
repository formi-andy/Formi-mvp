"use client";

import { useState } from "react";

export function useMobileMenu() {
  const [opened, setOpened] = useState(false);

  return {
    opened,
    setOpened,
  };
}
