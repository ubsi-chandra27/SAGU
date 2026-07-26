import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/request-user";
import { serializeSemester } from "@/lib/academic-periods";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.semester.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.deletedAt) {
    return NextResponse.json(
      { success: false, message: "Semester tidak ditemukan" },
      { status: 404 }
    );
  }

  const activated = await prisma.$transaction(async (tx) => {
    await tx.academicYear.updateMany({ data: { isActive: false } });
    await tx.academicYear.update({
      where: { id: existing.academicYearId },
      data: { isActive: true },
    });
    await tx.semester.updateMany({ data: { isActive: false } });

    return tx.semester.update({
      where: { id: params.id },
      data: { isActive: true },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Semester berhasil diaktifkan",
      data: serializeSemester(activated),
    },
    { status: 200 }
  );
}
