"use client";
import styles from "./header.module.css";
import Link from "next/link";
import { useHeader } from "@/context/HeaderContext";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";
import SideButton from "./SideButton.header";

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: ReactNode;
  onClick: () => void;
}) {
  const pathname = "";
  return (
    <Link
      href={to}
      className={`font-medium pl-4 md:pl-8 text-xl h-fit transition hover:text-blue-500 items-center flex ${
        pathname === to ? "text-white" : "text-brandBlack"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default function MobileMenu() {
  const { opened, setOpened } = useHeader();

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
        <SignedIn>
          <MobileNavLink to={`/dashboard`} onClick={() => setOpened(false)}>
            Dashboard
          </MobileNavLink>
          {/* <MobileNavLink to={`/record`} onClick={() => setOpened(false)}>
            Record
          </MobileNavLink> */}
          <MobileNavLink to={`/case/create`} onClick={() => setOpened(false)}>
            Create Case
          </MobileNavLink>
          <div className="relative left-4 md:left-8">
            <UserButton afterSignOutUrl="/login" />
          </div>
        </SignedIn>
        <SignedOut>
          <MobileNavLink to={`/about`} onClick={() => setOpened(false)}>
            About
          </MobileNavLink>
          <MobileNavLink to={`/students`} onClick={() => setOpened(false)}>
            For Students
          </MobileNavLink>
          <MobileNavLink to={`/contact`} onClick={() => setOpened(false)}>
            Contact
          </MobileNavLink>
          <MobileNavLink to={`/login`} onClick={() => setOpened(false)}>
            Log In
          </MobileNavLink>
        </SignedOut>
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
