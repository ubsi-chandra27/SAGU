import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken, AccessTokenPayload, RefreshTokenPayload } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/session";
import { badRequest, unauthorized, internalServerError } from "@/lib/errors";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieBase = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 60 * 15,
  };

  res.cookies.set("access_token", accessToken, {
    ...cookieBase,
    maxAge: 60 * 15,
  });

  res.cookies.set("refresh_token", refreshToken, {
    ...cookieBase,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);
    }

    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user) {
      return unauthorized("Username atau password salah");
    }

    if (!user.isActive) {
      return unauthorized("Akun dinonaktifkan");
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return unauthorized("Username atau password salah");
    }

    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.profile?.fullName || user.username,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      type: "refresh",
    };

    const accessToken = generateAccessToken(accessPayload);
    const refreshToken = generateRefreshToken(refreshPayload);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login berhasil",
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.profile?.fullName || user.username,
          } as SessionUser,
        },
      },
      { status: 200 }
    );

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return internalServerError("Terjadi kesalahan server");
  }
}
