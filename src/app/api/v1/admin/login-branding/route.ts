import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getPrimarySchool, normalizeLoginBranding } from "@/lib/branding";
import { LOGIN_BACKGROUND_POSITIONS } from "@/lib/branding-defaults";
import { requireAdmin } from "@/lib/auth/request-user";

const brandingSchema = z.object({
  logoUrl: z.string().max(255).nullable().optional(),
  loginBackgroundUrl: z.string().max(255).nullable().optional(),
  loginTitle: z.string().trim().max(120).nullable().optional(),
  loginSubtitle: z.string().trim().max(255).nullable().optional(),
  loginBackgroundPosition: z.enum(LOGIN_BACKGROUND_POSITIONS).optional(),
  loginOverlayOpacity: z.number().min(0).max(0.8).optional(),
});

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const school = await getPrimarySchool();

  return NextResponse.json(
    {
      success: true,
      message: "Branding login berhasil dimuat",
      data: normalizeLoginBranding(school),
    },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const body = await req.json();
  const parsed = brandingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Data branding tidak valid",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const school = await getPrimarySchool();
  const updated = await prisma.school.update({
    where: { id: school.id },
    data: {
      logoUrl: parsed.data.logoUrl,
      loginBackgroundUrl: parsed.data.loginBackgroundUrl,
      loginTitle: parsed.data.loginTitle || null,
      loginSubtitle: parsed.data.loginSubtitle || null,
      loginBackgroundPosition:
        parsed.data.loginBackgroundPosition || school.loginBackgroundPosition,
      loginOverlayOpacity:
        parsed.data.loginOverlayOpacity ?? school.loginOverlayOpacity,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Branding login berhasil disimpan",
      data: normalizeLoginBranding(updated),
    },
    { status: 200 }
  );
}
