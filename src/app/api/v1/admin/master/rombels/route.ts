import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { created, fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const rombelSchema = z.object({
  academicYearId: z.string().uuid(),
  classId: z.string().uuid(),
  homeroomTeacherId: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1).max(50),
  semesterId: z.string().uuid(),
});

const includeRombel = {
  academicYear: true,
  class: true,
  homeroomTeacher: { include: { profile: true } },
  semester: true,
  _count: { select: { students: true } },
};

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const search = req.nextUrl.searchParams.get("search")?.trim();
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const rombels = await prisma.rombel.findMany({
    include: includeRombel,
    where: {
      ...(includeArchived ? {} : { deletedAt: null }),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: [{ deletedAt: "asc" }, { name: "asc" }],
  });

  return ok("Daftar rombel berhasil dimuat", rombels);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = rombelSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data rombel tidak valid", 400, parsed.error.flatten().fieldErrors);

  const classRecord = await prisma.class.findFirst({
    where: { academicYearId: parsed.data.academicYearId, deletedAt: null, id: parsed.data.classId },
  });
  if (!classRecord) return fail("Kelas tidak sesuai tahun ajaran", 400);

  const semester = await prisma.semester.findFirst({
    where: { academicYearId: parsed.data.academicYearId, deletedAt: null, id: parsed.data.semesterId },
  });
  if (!semester) return fail("Semester tidak sesuai tahun ajaran", 400);

  if (parsed.data.homeroomTeacherId) {
    const teacherUser = await prisma.user.findFirst({
      where: {
        id: parsed.data.homeroomTeacherId,
        isActive: true,
        role: { in: ["GURU", "WALI_KELAS"] },
      },
    });
    if (!teacherUser) return fail("Wali kelas harus user guru aktif", 400);
  }

  const duplicate = await prisma.rombel.findFirst({
    where: {
      academicYearId: parsed.data.academicYearId,
      classId: parsed.data.classId,
      name: parsed.data.name,
      semesterId: parsed.data.semesterId,
    },
  });
  if (duplicate) return fail("Rombel sudah ada untuk kelas dan periode tersebut", 409);

  const rombel = await prisma.rombel.create({
    data: parsed.data,
    include: includeRombel,
  });

  return created("Rombel berhasil dibuat", rombel);
}
