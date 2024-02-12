"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export default function LogoImage() {
  const { theme } = useTheme();
  return (
    <Image
      priority
      src={
        theme === "dark"
          ? "/assets/formi_wordmark_white.svg"
          : "/assets/formi_wordmark_grey.svg"
      }
      alt="Formi Logo"
      width={128}
      height={32}
    />
  );
}
