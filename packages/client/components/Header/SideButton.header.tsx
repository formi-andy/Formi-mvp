"use client";

import { useHeader } from "@/context/HeaderContext";
import { Burger } from "@mantine/core";

export default function SideButton() {
  const { opened, setOpened } = useHeader();
  return (
    <Burger
      className="block"
      size={24}
      classNames={{
        burger: `${
          opened === false &&
          "bg-brandBlack dark:bg-white group-hover:bg-blue-500 dark:group-hover:bg-blue-400"
        } before:bg-brandBlack before:dark:bg-white after:bg-brandBlack after:dark:bg-white group-hover:before:dark:bg-blue-400 group-hover:after:dark:bg-blue-400 group-hover:before:bg-blue-500 group-hover:after:bg-blue-500 z-[150]`,
      }}
      opened={opened}
      onClick={() => setOpened((o) => !o)}
    />
  );
}
