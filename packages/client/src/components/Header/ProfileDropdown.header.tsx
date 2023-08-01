"use client";

import Link from "next/link";
import Image from "next/image";

import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { IoIosLogOut } from "react-icons/io";
import { BsPersonFill } from "react-icons/bs";
import { signOut } from "next-auth/react";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <Link href="/profile" className="w-40 flex gap-x-2 items-center">
        <BsPersonFill /> Profile
      </Link>
    ),
  },
  {
    key: "2",
    onClick: () => signOut({ callbackUrl: "/" }),
    label: (
      <div className="w-24 flex gap-x-2 items-center">
        <IoIosLogOut /> Logout
      </div>
    ),
  },
];
export default function ProfileDropdown({ url }: { url: string }) {
  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Link href="/profile">
        <Image
          src={url}
          alt="Profile Picture"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
      </Link>
    </Dropdown>
  );
}
