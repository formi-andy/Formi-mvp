import Link from "next/link";
import Image from "next/image";
import { auth, UserButton } from "@clerk/nextjs";

import SideButton from "./SideButton.header";
import MobileMenu from "./MobileMenu";
import styles from "./header.module.css";
import HeaderContext from "@/context/HeaderContext";
import { Montserrat } from "next/font/google";

const mont = Montserrat({ subsets: ["latin"] });

export default async function PublicHeader() {
  const { userId } = auth();

  return (
    <header className="flex justify-between items-center px-4 md:px-8 w-full border-b h-16 bg-lightblue border-none">
      <Link
        href="/"
        className={`${styles.headerLogo} w-1/4 flex justify-start text-formiblue`}
      >
        <Image
          priority
          // src="/assets/logo.svg"
          src="/assets/formi_ant_blue.svg"
          alt="Formi Logo"
          width={32}
          height={32}
        />
        Formi
      </Link>
      <div className="flex gap-x-16 items-center w-1/2 justify-center">
        <Link href="/" className="h-full text-darktext text-xl">
          Home
        </Link>
        <Link href="/about" className="h-full text-darktext text-xl">
          About
        </Link>
        <Link href="/students" className="h-full text-darktext text-xl">
          For Students
        </Link>
      </div>
      <HeaderContext>
        <nav className="w-1/4 flex justify-end">
          <div className="hidden lg:flex h-full items-center">
            {userId ? (
              <div className="flex gap-x-4 h-full items-center">
                <Link
                  href="/dashboard"
                  className="h-full px-6 rounded-3xl flex items-center py-1 bg-white text-formiblue font-light"
                >
                  Dashboard
                </Link>
                <Link
                  href="/record"
                  className="h-full px-6 rounded-3xl flex items-center py-1 bg-formiblue text-white font-light"
                >
                  Record
                </Link>
                <div className="h-full flex items-center relative">
                  <UserButton afterSignOutUrl="/login" />
                </div>
              </div>
            ) : (
              <div
                className={`flex justify-between w-full items-center ${mont.className}`}
              >
                <div className="flex gap-x-4 items-center">
                  <Link
                    href="/login"
                    className="h-full px-6 rounded-3xl flex items-center py-1 bg-white text-formiblue font-light"
                  >
                    Log In
                  </Link>
                  {/* <Link
                    href="/"
                    className="h-full px-6 rounded-3xl flex items-center py-1 bg-formiblue text-white font-light"
                  >
                    Learn more
                  </Link> */}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between h-full lg:hidden items-center group text-formiblue">
            <Link href="/" className={styles.headerLogo}>
              <Image
                priority
                // src="/assets/logo.svg"
                src="/assets/formi_ant_blue.svg"
                alt="Formi Logo"
                width={32}
                height={32}
              />
              Formi
            </Link>
            <SideButton />
          </div>
        </nav>
        <MobileMenu />
      </HeaderContext>
    </header>
  );
}
