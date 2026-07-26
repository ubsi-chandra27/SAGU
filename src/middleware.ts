import { NextRequest, NextResponse } from "next/server";
import { ROLE } from "@/lib/auth/constants";
import { verifyAccessTokenForMiddleware } from "@/lib/auth/edge-jwt";

const PUBLIC_PATHS = [
  "/login",
  "/api/v1/auth/login",
  "/api/v1/auth/refresh",
  "/api/v1/auth/logout",
  "/api/v1/auth/me",
  "/api/v1/branding/login",
  "/branding",
  "/uploads/branding",
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

function getAccessToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  return req.cookies.get("access_token")?.value;
}

function unauthorized(message: string) {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

function forbidden(message: string) {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

function clearAccessToken(response: NextResponse) {
  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  });

  return response;
}

function redirectToLogin(req: NextRequest, clearCookie = false) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  return clearCookie ? clearAccessToken(response) : response;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const accessToken = getAccessToken(req);

  if (pathname === "/login") {
    if (!accessToken) return NextResponse.next();

    const payload = await verifyAccessTokenForMiddleware(accessToken);
    if (!payload) return clearAccessToken(NextResponse.next());

    return NextResponse.redirect(
      new URL("/dashboard/" + payload.role.toLowerCase(), req.url)
    );
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!accessToken) {
    if (pathname.startsWith("/api/")) {
      return unauthorized("Missing access token");
    }
    return redirectToLogin(req);
  }

  const payload = await verifyAccessTokenForMiddleware(accessToken);
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return clearAccessToken(unauthorized("Invalid or expired access token"));
    }
    return redirectToLogin(req, true);
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
