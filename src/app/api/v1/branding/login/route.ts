import { NextResponse } from "next/server";
import { DEFAULT_LOGIN_BRANDING } from "@/lib/branding-defaults";
import { getLoginBranding } from "@/lib/branding";

export async function GET() {
  try {
    const branding = await getLoginBranding();

    return NextResponse.json(
      {
        success: true,
        message: "Branding login berhasil dimuat",
        data: branding,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: true,
        message: "Branding default digunakan",
        data: DEFAULT_LOGIN_BRANDING,
      },
      { status: 200 }
    );
  }
}
