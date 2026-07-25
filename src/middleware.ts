import { NextRequest, NextResponse } from "next/server";
import { ROLE } from "@/lib/auth/constants";

const PUBLIC_PATHS = [
  "/login",
  "/api/v1/auth/login",
  "/api/v1/auth/refresh",
  "/api/v1/auth/logout",
  "/api/v1/auth/me",
  "/_next",
  "/favicon.ico",
];

type AccessPayload = {
  email: string;
  exp?: number;
  fullName: string;
  role: string;
  sub: string;
  username: string;
};

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

function getRoleFromPath(pathname: string): string | null {
  if (pathname.startsWith("/dashboard/admin")) return ROLE.ADMIN;
  if (pathname.startsWith("/dashboard/guru")) return ROLE.GURU;
  if (pathname.startsWith("/api/v1/dashboard/admin")) return ROLE.ADMIN;
  if (pathname.startsWith("/api/v1/dashboard/guru")) return ROLE.GURU;
  return null;
}

function decodeJwtPayload(token: string): AccessPayload | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as AccessPayload;
  } catch {
    return null;
  }
}

function unauthorized(message: string) {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

function forbidden(message: string) {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");
  const accessToken =
    authHeader?.replace("Bearer ", "") || req.cookies.get("access_token")?.value;

  if (!accessToken) {
    if (pathname.startsWith("/api/")) {
      return unauthorized("Missing access token");
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = decodeJwtPayload(accessToken);
  const now = Math.floor(Date.now() / 1000);
  if (!payload || (payload.exp && payload.exp < now)) {
    if (pathname.startsWith("/api/")) {
      return unauthorized("Invalid or expired access token");
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const requiredRole = getRoleFromPath(pathname);
  if (requiredRole && payload.role !== requiredRole) {
    if (pathname.startsWith("/api/")) {
      return forbidden("Akses ditolak");
    }
    return NextResponse.redirect(
      new URL("/dashboard/" + payload.role.toLowerCase(), req.url)
    );
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.sub);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-email", payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
