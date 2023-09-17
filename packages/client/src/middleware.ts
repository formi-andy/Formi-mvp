import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/not-found",
    "/api/auth/signin",
    "/api/auth/signout",
  ],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // redirect them to organization selection page
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/dashboard") {
      const orgSelection = new URL("/dashboard", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});
