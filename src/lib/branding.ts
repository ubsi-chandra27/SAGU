import prisma from "@/lib/prisma";
import {
  DEFAULT_LOGIN_BRANDING,
  LOGIN_BACKGROUND_POSITIONS,
  LoginBranding,
  LoginBackgroundPosition,
} from "@/lib/branding-defaults";

const DEFAULT_SCHOOL_DATA = {
  name: "SAGU",
  address: "-",
};

export function normalizeLoginBranding(school: {
  name: string;
  logoUrl: string | null;
  loginBackgroundUrl: string | null;
  loginTitle: string | null;
  loginSubtitle: string | null;
  loginBackgroundPosition: string;
  loginOverlayOpacity: number;
} | null): LoginBranding {
  const position = LOGIN_BACKGROUND_POSITIONS.includes(
    school?.loginBackgroundPosition as LoginBackgroundPosition
  )
    ? (school?.loginBackgroundPosition as LoginBackgroundPosition)
    : DEFAULT_LOGIN_BRANDING.loginBackgroundPosition;

  const overlay = Number.isFinite(school?.loginOverlayOpacity)
    ? Math.min(0.8, Math.max(0, Number(school?.loginOverlayOpacity)))
    : DEFAULT_LOGIN_BRANDING.loginOverlayOpacity;

  return {
    schoolName: school?.name || DEFAULT_LOGIN_BRANDING.schoolName,
    logoUrl: school?.logoUrl || DEFAULT_LOGIN_BRANDING.logoUrl,
    loginBackgroundUrl:
      school?.loginBackgroundUrl || DEFAULT_LOGIN_BRANDING.loginBackgroundUrl,
    loginTitle: school?.loginTitle || DEFAULT_LOGIN_BRANDING.loginTitle,
    loginSubtitle:
      school?.loginSubtitle || DEFAULT_LOGIN_BRANDING.loginSubtitle,
    loginBackgroundPosition: position,
    loginOverlayOpacity: overlay,
  };
}

export async function getPrimarySchool() {
  const school = await prisma.school.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (school) return school;

  return prisma.school.create({
    data: DEFAULT_SCHOOL_DATA,
  });
}

export async function getLoginBranding() {
  const school = await prisma.school.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      name: true,
      logoUrl: true,
      loginBackgroundUrl: true,
      loginTitle: true,
      loginSubtitle: true,
      loginBackgroundPosition: true,
      loginOverlayOpacity: true,
    },
  });

  return normalizeLoginBranding(school);
}
