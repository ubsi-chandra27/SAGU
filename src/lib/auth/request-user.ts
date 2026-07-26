import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export type RequestUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string;
};

export function getAccessTokenFromRequest(req: NextRequest) {
  return (
    req.cookies.get("access_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "")
  );
}

export function getRequestUser(req: NextRequest): RequestUser | null {
  const token = getAccessTokenFromRequest(req);
  if (!token) return null;

  try {
    const payload = verifyAccessToken(token);
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
    };
  } catch {
    return null;
  }
}

export function requireAdmin(req: NextRequest) {
  const user = getRequestUser(req);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, message: "Autentikasi diperlukan" },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      user,
      response: NextResponse.json(
        { success: false, message: "Akses ditolak" },
        { status: 403 }
      ),
    };
  }

  return { user, response: null };
}
