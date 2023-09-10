"use client";
import styles from "./header.module.css";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useMobileMenu } from "@/hooks/useMobileMenu";

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const pathname = "";
  // const { pathname } = "router";
  return (
    <Link
      href={to}
      className={`px-4 text-2xl h-fit transition hover:text-white items-center flex font-izoard ${
        pathname === to ? "text-white" : "text-brandBlack"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default function MobileMenu() {
  const { opened, setOpened } = useMobileMenu();

  return (
    <aside
      className={styles.mobileHeaderContainer}
      style={{
        pointerEvents: opened ? "all" : "none",
      }}
    >
      <div
        className={styles.mobileHeader}
        style={{
          opacity: opened ? 1 : 0,
          pointerEvents: opened ? "all" : "none",
        }}
      >
        <MobileNavLink to={`/dashboard`} onClick={() => setOpened(false)}>
          Dashboard
        </MobileNavLink>
        <MobileNavLink to={`/record`} onClick={() => setOpened(false)}>
          Record
        </MobileNavLink>
        <MobileNavLink to={`/upload`} onClick={() => setOpened(false)}>
          Upload
        </MobileNavLink>
        <MobileNavLink to={`/profile`} onClick={() => setOpened(false)}>
          Profile
        </MobileNavLink>
        <button
          type="button"
          className="px-4 text-2xl h-fit transition hover:text-white items-center flex font-izoard"
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          Logout
        </button>
      </div>
      <div
        className={styles.mobileHeaderBackdrop}
        style={{
          opacity: opened ? 1 : 0,
        }}
      />
    </aside>
  );
}
