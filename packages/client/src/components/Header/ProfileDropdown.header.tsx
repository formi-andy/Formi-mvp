"use client";

import Link from "next/link";
import Image from "next/image";

import { Menu } from "@mantine/core";
import { IoIosLogOut } from "react-icons/io";
import { BsPersonFill } from "react-icons/bs";
import { signOut } from "next-auth/react";

export default function ProfileDropdown({ url }: { url: string }) {
  return (
    <Menu shadow="md" width={200} trigger="hover">
      <Menu.Target>
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
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<BsPersonFill />}
          component={Link}
          href="/profile"
        >
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={<IoIosLogOut />}
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
