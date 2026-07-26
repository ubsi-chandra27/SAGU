import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/request-user";
import {
  isDateRangeValid,
  parseDateOnly,
  serializeAcademicYear,
} from "@/lib/academic-periods";

const academicYearSchema = z.object({
  endDate: z.string(),
  isActive: z.boolean().optional(),
  name: z.string().trim().min(3).max(20),
  startDate: z.string(),
});

function parseAcademicYearPayload(body: unknown) {
  const parsed = academicYearSchema.safeParse(body);
  if (!parsed.success) {
    return {
      data: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Data tahun ajaran tidak valid",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      ),
    };
  }

  const startDate = parseDateOnly(parsed.data.startDate);
  const endDate = parseDateOnly(parsed.data.endDate);

  if (!startDate || !endDate || !isDateRangeValid(startDate, endDate)) {
    return {
      data: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Tanggal tahun ajaran tidak valid",
          details: {
            startDate: !startDate ? ["Format tanggal mulai harus YYYY-MM-DD"] : undefined,
            endDate: !endDate ? ["Format tanggal selesai harus YYYY-MM-DD"] : undefined,
            dateRange:
              startDate && endDate && !isDateRangeValid(startDate, endDate)
                ? ["Tanggal selesai tidak boleh lebih awal dari tanggal mulai"]
                : undefined,
          },
        },
        { status: 400 }
      ),
    };
  }

  return {
    data: {
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

  const academicYear = await prisma.academicYear.findUnique({
    where: { id: params.id },
    include: {
      semesters: {
        orderBy: [{ startDate: "asc" }, { name: "asc" }],
      },
    },
  });

  if (!academicYear) {
    return NextResponse.json(
      { success: false, message: "Tahun ajaran tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Tahun ajaran berhasil dimuat",
      data: serializeAcademicYear(academicYear),
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

  const payload = parseAcademicYearPayload(await req.json());
  if (payload.response) return payload.response;

  const existing = await prisma.academicYear.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.deletedAt) {
    return NextResponse.json(
      { success: false, message: "Tahun ajaran tidak ditemukan" },
      { status: 404 }
    );
  }

  const duplicate = await prisma.academicYear.findFirst({
    where: {
      deletedAt: null,
      id: { not: params.id },
      name: { equals: payload.data.name, mode: "insensitive" },
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { success: false, message: "Nama tahun ajaran sudah digunakan" },
      { status: 409 }
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (payload.data.isActive === true) {
      await tx.academicYear.updateMany({ data: { isActive: false } });
      await tx.semester.updateMany({
        where: { academicYearId: { not: params.id } },
        data: { isActive: false },
      });
    }

    if (payload.data.isActive === false && existing.isActive) {
      await tx.semester.updateMany({
        where: { academicYearId: params.id },
        data: { isActive: false },
      });
    }

    return tx.academicYear.update({
      where: { id: params.id },
      data: {
        endDate: payload.data.endDate,
        isActive: payload.data.isActive ?? existing.isActive,
        name: payload.data.name,
        startDate: payload.data.startDate,
      },
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
      message: "Tahun ajaran berhasil diperbarui",
      data: serializeAcademicYear(updated),
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

  const existing = await prisma.academicYear.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.deletedAt) {
    return NextResponse.json(
      { success: false, message: "Tahun ajaran tidak ditemukan" },
      { status: 404 }
    );
  }

  const archivedAt = new Date();
  const archived = await prisma.$transaction(async (tx) => {
    await tx.semester.updateMany({
      where: { academicYearId: params.id, deletedAt: null },
      data: { deletedAt: archivedAt, isActive: false },
    });

    return tx.academicYear.update({
      where: { id: params.id },
      data: { deletedAt: archivedAt, isActive: false },
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
      message: "Tahun ajaran berhasil diarsipkan",
      data: serializeAcademicYear(archived),
    },
    { status: 200 }
  );
}
