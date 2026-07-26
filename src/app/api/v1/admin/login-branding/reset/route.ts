import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPrimarySchool, normalizeLoginBranding } from "@/lib/branding";
import { DEFAULT_LOGIN_BRANDING } from "@/lib/branding-defaults";
import { requireAdmin } from "@/lib/auth/request-user";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const school = await getPrimarySchool();
  const updated = await prisma.school.update({
    where: { id: school.id },
    data: {
      logoUrl: null,
      loginBackgroundUrl: null,
      loginTitle: null,
      loginSubtitle: null,
      loginBackgroundPosition: DEFAULT_LOGIN_BRANDING.loginBackgroundPosition,
      loginOverlayOpacity: DEFAULT_LOGIN_BRANDING.loginOverlayOpacity,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Branding login dikembalikan ke default",
      data: normalizeLoginBranding(updated),
    },
    { status: 200 }
  );
}
