"use client";

import { useState } from "react";
import { Burger } from "@mantine/core";

export default function SideButton() {
  const [opened, setOpened] = useState(false);
  return (
    <Burger
      className="block"
      size={32}
      classNames={{
        burger: `${
          opened === false && "bg-brandBlack group-hover:bg-white"
        } before:bg-brandBlack after:bg-brandBlack group-hover:before:bg-white group-hover:after:bg-white`,
      }}
      opened={opened}
      onClick={() => setOpened((o) => !o)}
    />
  );
}
