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
        className={`${styles.headerLogo} w-1/2 lg:w-1/4 flex justify-start text-black`}
      >
        <Image
          priority
          // src="/assets/logo.svg"
          src="/assets/formi_wordmark_grey.svg"
          alt="Formi Logo"
          width={128}
          height={32}
        />
      </Link>
      <div className="gap-x-16 items-center w-1/2 hidden lg:flex justify-center">
        <Link
          href="/"
          className="h-full hover:text-blue-500 transition text-base lg:text-lg"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="h-full hover:text-blue-500 transition text-base lg:text-lg"
        >
          About
        </Link>
        <Link
          href="/students"
          className="h-full hover:text-blue-500 transition text-base lg:text-lg"
        >
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
                  className="h-full px-6 rounded-3xl flex items-center py-1 bg-white text-black"
                >
                  Dashboard
                </Link>
                {/* <Link
                  href="/record"
                  className="h-full px-6 rounded-3xl flex items-center py-1 bg-formiblue text-white font-light"
                >
                  Record
                </Link> */}
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
                    className="font-medium rounded h-fit px-4 py-1 hover:bg-blue-500 bg-white hover:text-white transition"
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
          <div className="flex justify-between h-full lg:hidden items-center group text-black">
            <SideButton />
          </div>
        </nav>
        <MobileMenu />
      </HeaderContext>
    </header>
  );
}
