import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, RefreshTokenPayload } from "@/lib/auth/jwt";
import { unauthorized, internalServerError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return unauthorized("Refresh token tidak ditemukan");
    }

    let payload: RefreshTokenPayload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return unauthorized("Refresh token tidak valid atau kedaluwarsa");
    }

    const newAccessToken = generateAccessToken({
      sub: payload.sub,
      username: "",
      email: "",
      role: "",
      fullName: "",
    });

    const newRefreshToken = generateRefreshToken({
      sub: payload.sub,
      type: "refresh",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Token berhasil diperbarui",
        data: {
          accessToken: newAccessToken,
        },
      },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict" as const,
      path: "/",
      maxAge: 60 * 15,
    });

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return internalServerError("Terjadi kesalahan server");
  }
}
