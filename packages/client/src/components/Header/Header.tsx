"use client";
import { UserButton, useAuth } from "@clerk/nextjs";

import Link from "next/link";
import SideButton from "./SideButton.header";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex justify-between items-center px-4 md:px-8 w-full border-b h-16 mb-4">
      <Link href="/" className="text-2xl font-medium">
        Homescope
      </Link>
      <nav className="h-full">
        <div className="hidden md:flex h-full items-center">
          {isSignedIn ? (
            <div className="flex gap-x-4 h-full">
              <Link
                href="/dashboard"
                className="h-full px-4 flex items-center hover:bg-slate-50 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/record"
                className="h-full px-4 flex items-center hover:bg-slate-50 transition"
              >
                Record
              </Link>
              <Link
                href="/upload"
                className="h-full px-4 flex items-center hover:bg-slate-50 transition"
              >
                Upload
              </Link>
              <div className="h-full flex items-center relative">
                <UserButton afterSignOutUrl="/login" />
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="border rounded h-fit px-4 py-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
            >
              Log In
            </Link>
          )}
        </div>
        <div className="flex h-full md:hidden justify-center items-center group">
          <SideButton />
        </div>
      </nav>
      <MobileMenu />
    </header>
  );
}
