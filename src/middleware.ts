import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/session";
import { PROTECTED_ROUTES, ROLE } from "@/lib/auth/constants";
import { unauthorized, forbidden } from "@/lib/errors";

const PUBLIC_PATHS = [
  "/login",
  "/api/v1/auth/login",
  "/api/v1/auth/refresh",
  "/api/v1/auth/logout",
  "/api/v1/auth/me",
  "/_next",
  "/favicon.ico",
];

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

export function withAuth(
  handler: (req: NextRequest, user: SessionUser) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;

    if (isPublicPath(pathname)) {
      return handler(req, null as unknown as SessionUser);
    }

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.replace("Bearer ", "") || req.cookies.get("access_token")?.value;

    if (!accessToken) {
      if (pathname.startsWith("/api/")) {
        return unauthorized("Missing access token");
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    let payload: { sub: string; username: string; email: string; role: string; fullName: string };

    try {
      payload = verifyAccessToken(accessToken);
    } catch {
      if (pathname.startsWith("/api/")) {
        return unauthorized("Invalid or expired access token");
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user: SessionUser = {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
    };

    const requiredRole = getRoleFromPath(pathname);
    if (requiredRole && user.role !== requiredRole) {
      if (pathname.startsWith("/api/")) {
        return forbidden("Akses ditolak");
      }
      return NextResponse.redirect(new URL("/dashboard/" + user.role.toLowerCase(), req.url));
    }

    req.headers.set("x-user-id", user.id);
    req.headers.set("x-user-role", user.role);
    req.headers.set("x-user-email", user.email);

    return handler(req, user);
  };
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
