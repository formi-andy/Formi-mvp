import { authMiddleware, redirectToSignIn, clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
// export const config = { matcher: ["/((?!...|_next).)", "/", "/(api|trpc)(.)"] };

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
  debug: true,
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
    const { hostname } = getURLParts(req);

    if (
      auth.isPublicRoute ||
      hostname === `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    ) {
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

function getURLParts(req: NextRequest) {
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    .replace(process.env.NEXT_PREVIEW_URL || "", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
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
  const path = `${req.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  const url = req.nextUrl;

  return { hostname, path, url };
}

function getSubdomain(req: NextRequest) {
  const hostname = req.headers.get("host") ?? req.nextUrl.host;
  const subdomain = hostname
    .replace("http://", "")
    .replace("https://", "")
    .replace("localhost:3000", "")
    .replace(process.env.NEXT_PUBLIC_ROOT_DOMAIN as string, "")
    .replace(".", ""); // e.g. app if (subdomain == "") { return null; } return subdomain;
  return subdomain;
}

function rewrites(req: NextRequest) {
  const { nextUrl: url } = req;
  const path = url.pathname;
  const subdomain = getSubdomain(req);
  const hostname = req.headers.get("host") ?? req.nextUrl.host;
  if (subdomain == "admin") {
    return NextResponse.rewrite(
      new URL(`/admin${path === "/" ? "" : path}`, req.url)
    );
  }
  if (hostname === "localhost:3000") {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
