import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
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
    "/api/auth/signin",
    "/api/auth/signout",
  ],
  async afterAuth(auth, req, evt) {
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // console.log("METADATA", auth);
    // TODO: fix user being undefined
    if (
      auth.user?.publicMetadata.role ||
      req.nextUrl.pathname === "/onboarding"
    ) {
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
