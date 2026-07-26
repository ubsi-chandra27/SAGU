import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, AccessTokenPayload, RefreshTokenPayload } from "@/lib/auth/jwt";
import { internalServerError, toErrorResponse, unauthorized } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return toErrorResponse(unauthorized("Refresh token tidak ditemukan"));
    }

    let payload: RefreshTokenPayload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return toErrorResponse(unauthorized("Refresh token tidak valid atau kedaluwarsa"));
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true },
    });

    if (!user) {
      return toErrorResponse(unauthorized("Refresh token tidak valid atau kedaluwarsa"));
    }

    if (!user.isActive) {
      return toErrorResponse(unauthorized("Akun dinonaktifkan"));
    }

    const accessPayload: AccessTokenPayload = {
      sub: payload.sub,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.profile?.fullName || user.username,
    };

    const newAccessToken = generateAccessToken(accessPayload);

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
    return toErrorResponse(internalServerError("Terjadi kesalahan server"));
  }
}
