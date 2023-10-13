import Link from "next/link";
import Image from "next/image";
import { auth, UserButton } from "@clerk/nextjs";

import SideButton from "./SideButton.header";
import MobileMenu from "./MobileMenu";
import styles from "./header.module.css";
import HeaderContext from "@/context/HeaderContext";

export default async function Header() {
  const { userId } = auth();

  return (
    <header className="flex justify-between items-center px-4 md:px-8 w-full border-b h-16 mb-8">
      <Link href="/" className={styles.headerLogo}>
        <Image
          priority
          src="/assets/logo.svg"
          alt="Homescope Logo"
          width={20}
          height={20}
        />
        Homescope
      </Link>
      <HeaderContext>
        <nav className={styles.headerNav}>
          <div className="hidden lg:flex h-full items-center">
            {userId ? (
              <div className="flex gap-x-4 h-full">
                <Link
                  href="/dashboard"
                  className="h-full px-4 flex items-center hover:text-blue-500 transition font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/record"
                  className="h-full px-4 flex items-center hover:text-blue-500 transition font-medium"
                >
                  Record
                </Link>
                <Link
                  href="/case/create"
                  className="h-full px-4 flex items-center hover:text-blue-500 transition font-medium"
                >
                  Create Case
                </Link>
                <div className="h-full flex items-center relative">
                  <UserButton afterSignOutUrl="/login" />
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="font-medium border rounded h-fit px-4 py-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
              >
                Log In
              </Link>
            )}
          </div>
          <div className="flex h-full lg:hidden justify-center items-center group">
            <SideButton />
          </div>
        </nav>
        <MobileMenu />
      </HeaderContext>
    </header>
  );
}