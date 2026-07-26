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

const semesterUpdateSchema = z.object({
  academicYearId: z.string().uuid(),
  endDate: z.string(),
  isActive: z.boolean().optional(),
  name: z.string().trim().min(3).max(10),
  startDate: z.string(),
});

async function parseSemesterPayload(body: unknown) {
  const parsed = semesterUpdateSchema.safeParse(body);
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
      academicYearId: parsed.data.academicYearId,
      endDate,
      isActive: parsed.data.isActive,
      name: parsed.data.name,
      startDate,
    },
    response: null,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const semester = await prisma.semester.findUnique({ where: { id: params.id } });

  if (!semester) {
    return NextResponse.json(
      { success: false, message: "Semester tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Semester berhasil dimuat",
      data: serializeSemester(semester),
    },
    { status: 200 }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const payload = await parseSemesterPayload(await req.json());
  if (payload.response) return payload.response;

  const existing = await prisma.semester.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.deletedAt) {
    return NextResponse.json(
      { success: false, message: "Semester tidak ditemukan" },
      { status: 404 }
    );
  }

  const duplicate = await prisma.semester.findFirst({
    where: {
      academicYearId: payload.data.academicYearId,
      id: { not: params.id },
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

  const updated = await prisma.$transaction(async (tx) => {
    if (payload.data.isActive === true) {
      await tx.academicYear.updateMany({ data: { isActive: false } });
      await tx.academicYear.update({
        where: { id: payload.data.academicYearId },
        data: { isActive: true },
      });
      await tx.semester.updateMany({ data: { isActive: false } });
    }

    return tx.semester.update({
      where: { id: params.id },
      data: {
        academicYearId: payload.data.academicYearId,
        endDate: payload.data.endDate,
        isActive: payload.data.isActive ?? existing.isActive,
        name: payload.data.name,
        startDate: payload.data.startDate,
      },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Semester berhasil diperbarui",
      data: serializeSemester(updated),
    },
    { status: 200 }
  );
}

export async function DELETE(
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

  const archived = await prisma.semester.update({
    where: { id: params.id },
    data: { deletedAt: new Date(), isActive: false },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Semester berhasil diarsipkan",
      data: serializeSemester(archived),
    },
    { status: 200 }
  );
}
