import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { toErrorResponse, unauthorized } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("access_token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return toErrorResponse(unauthorized("Access token tidak ditemukan"));
    }

    let payload;
    try {
      payload = verifyAccessToken(accessToken);
    } catch {
      return toErrorResponse(unauthorized("Access token tidak valid atau kedaluwarsa"));
    }

    return NextResponse.json(
      {
        success: true,
        message: "OK",
        data: {
          id: payload.sub,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          fullName: payload.fullName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Me error:", error);
    return toErrorResponse(unauthorized("Terjadi kesalahan saat mengambil data user"));
  }
}
