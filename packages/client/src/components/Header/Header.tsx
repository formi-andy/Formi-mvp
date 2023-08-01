import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import SideButton from "./SideButton.header";
import ProfileDropdown from "./ProfileDropdown.header";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex justify-between items-center px-4 md:px-8 w-full border-b h-16 mb-8">
      <Link href="/" className="text-2xl font-medium">
        Homescope
      </Link>
      <nav className="h-full">
        <div className="hidden md:flex h-full items-center">
          {session ? (
            <div className="flex gap-x-4 h-full">
              <Link
                href="/dashboard"
                className="h-full px-4 flex items-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/record"
                className="h-full px-4 flex items-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
              >
                Record
              </Link>
              <Link
                href="/upload"
                className="h-full px-4 flex items-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
              >
                Upload
              </Link>
              <div className="h-full flex items-center relative">
                <ProfileDropdown url={session.user.image} />
              </div>
            </div>
          ) : (
            <Link href="/login" className="border rounded h-fit px-4 py-1">
              Login
            </Link>
          )}
          <div className="flex items-center md:hidden group">
            {/* <SideButton /> */}
          </div>
        </div>
      </nav>
      {/* <aside className="mobileHeaderContainer">
        <div
          className="mobileNavContainer"
          style={{
            opacity: opened ? 1 : 0,
            pointerEvents: opened ? "all" : "none",
          }}
        >
          {workerApp ? (
            <>
              <MobileNavLink
                to={`${ROUTE.WORKER_APP.PATH_NAME}${ROUTE.WORKER_APP.DASHBOARD}`}
                onClick={() => setOpened(false)}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink
                to={`${ROUTE.WORKER_APP.PATH_NAME}${ROUTE.WORKER_APP.PERFORMANCE}`}
                onClick={() => setOpened(false)}
              >
                Performance
              </MobileNavLink>
              <MobileNavLink
                to={`${ROUTE.WORKER_APP.PATH_NAME}${ROUTE.WORKER_APP.FINANCE}`}
                onClick={() => setOpened(false)}
              >
                Finance
              </MobileNavLink>
            </>
          ) : (
            <>
              <MobileNavLink
                to={`${ROUTE.APP.DASHBOARD}`}
                onClick={() => setOpened(false)}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink
                to={`${ROUTE.APP.PEOPLE}`}
                onClick={() => setOpened(false)}
              >
                People
              </MobileNavLink>
              <MobileNavLink
                to={`${ROUTE.APP.PROJECT}`}
                onClick={() => setOpened(false)}
              >
                Project
              </MobileNavLink>
              {user?.email === "office@trunk.tools" && (
                <MobileNavLink
                  to={`${ROUTE.APP.PAYMENT}`}
                  onClick={() => setOpened(false)}
                >
                  Payment
                </MobileNavLink>
              )}
            </>
          )}
          <MobileNavLink
            to={`${ROUTE.WORKER_APP.PATH_NAME}${ROUTE.WORKER_APP.PROFILE}`}
            onClick={() => setOpened(false)}
          >
            My Account
          </MobileNavLink>
          <MobileNavLink
            to={`${ROUTE.WORKER_APP.PATH_NAME}${ROUTE.WORKER_APP.CARDS}`}
            onClick={() => setOpened(false)}
          >
            My Card
          </MobileNavLink>
          <button
            type="button"
            className="px-4 text-2xl h-fit transition hover:text-white items-center flex font-izoard"
            onClick={logout}
          >
            Logout
          </button>
        </div>
        <div
          className="mobileHeaderOverlay"
          style={{
            opacity: opened ? 1 : 0,
            pointerEvents: opened ? "all" : "none",
          }}
        />
      </aside> */}
    </header>
  );
}
