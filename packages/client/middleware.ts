import { authMiddleware, redirectToSignIn, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

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
