import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/request-user";
import { serializeAcademicYear } from "@/lib/academic-periods";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.academicYear.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.deletedAt) {
    return NextResponse.json(
      { success: false, message: "Tahun ajaran tidak ditemukan" },
      { status: 404 }
    );
  }

  const activated = await prisma.$transaction(async (tx) => {
    await tx.academicYear.updateMany({ data: { isActive: false } });
    await tx.semester.updateMany({
      where: { academicYearId: { not: params.id } },
      data: { isActive: false },
    });

    return tx.academicYear.update({
      where: { id: params.id },
      data: { isActive: true },
      include: {
        semesters: {
          orderBy: [{ startDate: "asc" }, { name: "asc" }],
        },
      },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Tahun ajaran berhasil diaktifkan",
      data: serializeAcademicYear(activated),
    },
    { status: 200 }
  );
}
