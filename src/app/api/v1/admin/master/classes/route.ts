import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { created, fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const classSchema = z.object({
  academicYearId: z.string().uuid(),
  capacity: z.coerce.number().int().min(1).max(100).optional().nullable(),
  level: z.string().trim().min(1).max(10),
  name: z.string().trim().min(1).max(20),
  semesterId: z.string().uuid().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const search = req.nextUrl.searchParams.get("search")?.trim();
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const classes = await prisma.class.findMany({
    include: { academicYear: true, semester: true },
    where: {
      ...(includeArchived ? {} : { deletedAt: null }),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { level: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ deletedAt: "asc" }, { level: "asc" }, { name: "asc" }],
  });

  return ok("Daftar kelas berhasil dimuat", classes);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = classSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data kelas tidak valid", 400, parsed.error.flatten().fieldErrors);

  const academicYear = await prisma.academicYear.findFirst({
    where: { id: parsed.data.academicYearId, deletedAt: null },
  });
  if (!academicYear) return fail("Tahun ajaran tidak ditemukan", 404);

  if (parsed.data.semesterId) {
    const semester = await prisma.semester.findFirst({
      where: {
        academicYearId: parsed.data.academicYearId,
        deletedAt: null,
        id: parsed.data.semesterId,
      },
    });
    if (!semester) return fail("Semester tidak sesuai tahun ajaran", 400);
  }

  const classRecord = await prisma.class.create({
    data: parsed.data,
    include: { academicYear: true, semester: true },
  });

  return created("Kelas berhasil dibuat", classRecord);
}
