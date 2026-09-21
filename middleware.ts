import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

function isPublicAdminPath(pathname: string) {
  return (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password")
  );
}

function isPublicAdminApi(pathname: string) {
  return pathname.startsWith("/api/admin/password-reset/");
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  const isAdminApi = pathname.startsWith("/api/admin");
  const signedIn = Boolean(req.auth?.user);

  if (!signedIn && isAdminApi && !isPublicAdminApi(pathname)) {
    return NextResponse.json(
      { error: { message: "Sign in required." } },
      { status: 401 },
    );
  }

  if (
    !signedIn &&
    pathname.startsWith("/admin") &&
    !isPublicAdminPath(pathname)
  ) {
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
