import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea =
    pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdminArea) {
    return NextResponse.next();
  }
  const isLoginPage =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const loggedIn = verifyAdminSessionToken(token);
  if (isLoginPage && loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/orders";
    return NextResponse.redirect(url);
  }
  if (isLoginPage) {
    return NextResponse.next();
  }
  if (!loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};