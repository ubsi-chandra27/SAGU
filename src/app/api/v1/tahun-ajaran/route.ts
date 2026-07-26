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

  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const academicYears = await prisma.academicYear.findMany({
    include: {
      semesters: {
        where: includeArchived ? undefined : { deletedAt: null },
        orderBy: [{ startDate: "asc" }, { name: "asc" }],
      },
    },
    where: includeArchived ? undefined : { deletedAt: null },
    orderBy: [{ startDate: "desc" }, { name: "desc" }],
  });

  return NextResponse.json(
    {
      success: true,
      message: "Daftar tahun ajaran berhasil dimuat",
      data: academicYears.map(serializeAcademicYear),
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const payload = parseAcademicYearPayload(await req.json());
  if (payload.response) return payload.response;

  const duplicate = await prisma.academicYear.findFirst({
    where: {
      deletedAt: null,
      name: { equals: payload.data.name, mode: "insensitive" },
    },
  });

  if (duplicate) {
    return NextResponse.json(
      {
        success: false,
        message: "Nama tahun ajaran sudah digunakan",
      },
      { status: 409 }
    );
  }

  const academicYear = await prisma.$transaction(async (tx) => {
    if (payload.data.isActive) {
      await tx.academicYear.updateMany({ data: { isActive: false } });
      await tx.semester.updateMany({ data: { isActive: false } });
    }

    return tx.academicYear.create({
      data: payload.data,
      include: { semesters: true },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Tahun ajaran berhasil dibuat",
      data: serializeAcademicYear(academicYear),
    },
    { status: 201 }
  );
}
