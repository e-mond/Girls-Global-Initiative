import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  const isAdminApi = pathname.startsWith("/api/admin");
  const signedIn = Boolean(req.auth?.user);

  if (!signedIn && isAdminApi) {
    return NextResponse.json(
      { error: { message: "Sign in required." } },
      { status: 401 },
    );
  }

  if (!signedIn && pathname.startsWith("/admin") && !isLogin) {
    const login = new URL("/admin/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (signedIn && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
