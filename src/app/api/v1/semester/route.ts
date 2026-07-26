import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/request-user";
import {
  isDateRangeValid,
  isSemesterInsideAcademicYear,
  parseDateOnly,
  serializeSemester,
} from "@/lib/academic-periods";

const semesterSchema = z.object({
  academicYearId: z.string().uuid(),
  endDate: z.string(),
  isActive: z.boolean().optional(),
  name: z.string().trim().min(3).max(10),
  startDate: z.string(),
});

async function parseSemesterPayload(body: unknown) {
  const parsed = semesterSchema.safeParse(body);
  if (!parsed.success) {
    return {
      data: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Data semester tidak valid",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      ),
    };
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: { id: parsed.data.academicYearId, deletedAt: null },
  });

  if (!academicYear) {
    return {
      data: null,
      response: NextResponse.json(
        { success: false, message: "Tahun ajaran tidak ditemukan" },
        { status: 404 }
      ),
    };
  }

  const startDate = parseDateOnly(parsed.data.startDate);
  const endDate = parseDateOnly(parsed.data.endDate);

  if (
    !startDate ||
    !endDate ||
    !isDateRangeValid(startDate, endDate) ||
    !isSemesterInsideAcademicYear(
      startDate,
      endDate,
      academicYear.startDate,
      academicYear.endDate
    )
  ) {
    return {
      data: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Tanggal semester tidak valid",
          details: {
            startDate: !startDate ? ["Format tanggal mulai harus YYYY-MM-DD"] : undefined,
            endDate: !endDate ? ["Format tanggal selesai harus YYYY-MM-DD"] : undefined,
            dateRange:
              startDate && endDate && !isDateRangeValid(startDate, endDate)
                ? ["Tanggal selesai tidak boleh lebih awal dari tanggal mulai"]
                : undefined,
            academicYearRange:
              startDate &&
              endDate &&
              isDateRangeValid(startDate, endDate) &&
              !isSemesterInsideAcademicYear(
                startDate,
                endDate,
                academicYear.startDate,
                academicYear.endDate
              )
                ? ["Tanggal semester harus berada dalam rentang tahun ajaran"]
                : undefined,
          },
        },
        { status: 400 }
      ),
    };
  }

  return {
    data: {
      academicYear,
      academicYearId: parsed.data.academicYearId,
      endDate,
      isActive: parsed.data.isActive ?? false,
      name: parsed.data.name,
      startDate,
    },
    response: null,
  };
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const academicYearId = req.nextUrl.searchParams.get("academicYearId");
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const semesters = await prisma.semester.findMany({
    where: {
      ...(academicYearId ? { academicYearId } : {}),
      ...(includeArchived ? {} : { deletedAt: null }),
    },
    orderBy: [{ startDate: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(
    {
      success: true,
      message: "Daftar semester berhasil dimuat",
      data: semesters.map(serializeSemester),
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const payload = await parseSemesterPayload(await req.json());
  if (payload.response) return payload.response;

  const duplicate = await prisma.semester.findFirst({
    where: {
      academicYearId: payload.data.academicYearId,
      name: { equals: payload.data.name, mode: "insensitive" },
    },
  });

  if (duplicate) {
    return NextResponse.json(
      {
        success: false,
        message: "Nama semester sudah digunakan pada tahun ajaran ini",
      },
      { status: 409 }
    );
  }

  const semester = await prisma.$transaction(async (tx) => {
    if (payload.data.isActive) {
      await tx.academicYear.updateMany({ data: { isActive: false } });
      await tx.academicYear.update({
        where: { id: payload.data.academicYearId },
        data: { isActive: true },
      });
      await tx.semester.updateMany({ data: { isActive: false } });
    }

    return tx.semester.create({
      data: {
        academicYearId: payload.data.academicYearId,
        endDate: payload.data.endDate,
        isActive: payload.data.isActive,
        name: payload.data.name,
        startDate: payload.data.startDate,
      },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Semester berhasil dibuat",
      data: serializeSemester(semester),
    },
    { status: 201 }
  );
}
