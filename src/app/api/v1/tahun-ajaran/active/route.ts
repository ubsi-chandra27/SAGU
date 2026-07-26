import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth/request-user";
import { serializeAcademicYear, serializeSemester } from "@/lib/academic-periods";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Autentikasi diperlukan" },
      { status: 401 }
    );
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: { deletedAt: null, isActive: true },
    orderBy: { startDate: "desc" },
  });

  const semester = academicYear
    ? await prisma.semester.findFirst({
        where: {
          academicYearId: academicYear.id,
          deletedAt: null,
          isActive: true,
        },
        orderBy: { startDate: "desc" },
      })
    : null;

  return NextResponse.json(
    {
      success: true,
      message: "Periode aktif berhasil dimuat",
      data: {
        academicYear: academicYear ? serializeAcademicYear(academicYear) : null,
        semester: semester ? serializeSemester(semester) : null,
      },
    },
    { status: 200 }
  );
}
