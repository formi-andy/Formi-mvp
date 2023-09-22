"use client";

import { useHeader } from "@/contexts/HeaderContext";
import { Burger } from "@mantine/core";

export default function SideButton() {
  const { opened, setOpened } = useHeader();
  return (
    <Burger
      className="block"
      size={24}
      classNames={{
        burger: `${
          opened === false && "bg-brandBlack group-hover:bg-blue-500"
        } before:bg-brandBlack after:bg-brandBlack group-hover:before:bg-blue-500 group-hover:after:bg-blue-500`,
      }}
      opened={opened}
      onClick={() => setOpened((o) => !o)}
    />
  );
}
