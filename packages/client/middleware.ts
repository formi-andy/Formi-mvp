import { authMiddleware, redirectToSignIn, clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except for:
//      * 1. /api routes
//      * 2. /_next (Next.js internals)
//      * 3. /_static (inside /public)
//      * 4. all root files inside /public (e.g. /favicon.ico)
//      */
//     "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
//   ],
// };

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/not-found",
    "/students",
    "/api/auth/signin",
    "/api/auth/signout",
    "/api/check-password",
  ],
  beforeAuth: (req) => {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    let hostname = req.headers
      .get("host")!
      .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    // special case for Vercel preview deployment URLs
    if (
      hostname.includes("---") &&
      hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
      hostname = `${hostname.split("---")[0]}.${
        process.env.NEXT_PUBLIC_ROOT_DOMAIN
      }`;
    }

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // rewrites for app pages
    // if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    //   if (!session && path !== "/login") {
    //     return NextResponse.redirect(new URL("/login", req.url));
    //   } else if (session && path == "/login") {
    //     return NextResponse.redirect(new URL("/", req.url));
    //   }
    //   return NextResponse.rewrite(
    //     new URL(`/app${path === "/" ? "" : path}`, req.url)
    //   );
    // }
    if (hostname == `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
      return NextResponse.rewrite(
        new URL(`/admin${path === "/" ? "" : path}`, req.url)
      );
    }

    // special case for `vercel.pub` domain
    // if (hostname === "vercel.pub") {
    //   return NextResponse.redirect(
    //     "https://vercel.com/blog/platforms-starter-kit"
    //   );
    // }

    // rewrite root application to `/home` folder
    if (
      hostname === "localhost:3000" ||
      hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ) {
      return NextResponse.rewrite(
        new URL(`/home${path === "/" ? "" : path}`, req.url)
      );
    }

    // rewrite everything else to `/[domain]/[slug] dynamic route
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  },
  async afterAuth(auth, req, evt) {
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    // users not logged in trying to access private routes
    if (!auth.userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const clerkUser = await clerkClient.users.getUser(auth.userId);

    if (
      clerkUser.publicMetadata.role &&
      req.nextUrl.pathname === "/onboarding"
    ) {
      const dashboard = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboard);
    } else if (clerkUser.publicMetadata.role) {
      return NextResponse.next();
    } else if (req.nextUrl.pathname === "/onboarding") {
      return NextResponse.next();
    } else {
      const onboarding = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboarding);
    }
    // redirect them to organization selection page
    // if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/dashboard") {
    //   const orgSelection = new URL("/dashboard", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
  },
});
