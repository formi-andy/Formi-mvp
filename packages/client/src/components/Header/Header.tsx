import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import SideButton from "./SideButton.header";
import ProfileDropdown from "./ProfileDropdown.header";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex justify-between items-center px-4 md:px-8 w-full border-b h-16 mb-4">
      <Link href="/" className="text-2xl font-medium">
        Homescope
      </Link>
      <nav className="h-full">
        <div className="hidden md:flex h-full items-center">
          {session ? (
            <div className="flex gap-x-4 h-full">
              {/* <Link
                href="/dashboard"
                className="h-full px-4 flex items-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
              >
                Dashboard
              </Link> */}
              <Link
                href="/dashboard"
                className="h-full px-4 flex items-center hover:bg-slate-50 transition"
              >
                Dashboard
              </Link>
              {/* <Link
                href="/record"
                className="h-full px-4 flex items-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
              >
                Record
              </Link> */}
              <Link
                href="/record"
                className="h-full px-4 flex items-center hover:bg-slate-50 transition"
              >
                Record
              </Link>
              {/* <Link
                href="/upload"
                className="h-full px-4 flex items-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
              >
                Upload
              </Link> */}
              <Link
                href="/upload"
                className="h-full px-4 flex items-center hover:bg-slate-50 transition"
              >
                Upload
              </Link>
              <div className="h-full flex items-center relative">
                <ProfileDropdown url={session.user.image} />
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="border rounded h-fit px-4 py-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
            >
              Login
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
