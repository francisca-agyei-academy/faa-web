import { NextResponse, type NextRequest } from "next/server";

// Set by the API next to the refresh cookie; holds only the role ("STUDENT" | "ADMIN").
// It is a hint for fast redirects, not proof of a session: the API checks every request,
// and the dashboard and admin layouts confirm the session before showing anything.
const SESSION_HINT_COOKIE = "faa_session";

const PROTECTED = ["/dashboard", "/my-courses", "/course", "/admin"];
const GUEST_ONLY = ["/login", "/register"];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = request.cookies.get(SESSION_HINT_COOKIE)?.value;

  if (matches(pathname, PROTECTED) && !role) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (matches(pathname, ["/admin"]) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (matches(pathname, GUEST_ONLY) && role) {
    return NextResponse.redirect(new URL(role === "ADMIN" ? "/admin" : "/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-courses/:path*",
    "/course/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
