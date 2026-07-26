import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { created, fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const assignmentSchema = z.object({
  academicYearId: z.string().uuid(),
  classId: z.string().uuid(),
  rombelId: z.string().uuid(),
  semesterId: z.string().uuid(),
  subjectId: z.string().uuid(),
  teacherId: z.string().uuid(),
});

const includeAssignment = {
  academicYear: true,
  class: true,
  rombel: true,
  semester: true,
  subject: true,
  teacher: { include: { user: { include: { profile: true } } } },
  _count: { select: { meetings: true } },
};

async function validateAssignmentPayload(data: z.infer<typeof assignmentSchema>) {
  const [teacher, subject, classRecord, rombel, semester] = await Promise.all([
    prisma.teacher.findFirst({ where: { id: data.teacherId, deletedAt: null, user: { isActive: true } } }),
    prisma.subject.findFirst({ where: { id: data.subjectId, deletedAt: null } }),
    prisma.class.findFirst({ where: { id: data.classId, academicYearId: data.academicYearId, deletedAt: null } }),
    prisma.rombel.findFirst({
      where: {
        academicYearId: data.academicYearId,
        classId: data.classId,
        deletedAt: null,
        id: data.rombelId,
        semesterId: data.semesterId,
      },
    }),
    prisma.semester.findFirst({
      where: { academicYearId: data.academicYearId, deletedAt: null, id: data.semesterId },
    }),
  ]);

  if (!teacher) return "Guru tidak ditemukan atau tidak aktif";
  if (!subject) return "Mata pelajaran tidak ditemukan";
  if (!classRecord) return "Kelas tidak sesuai tahun ajaran";
  if (!rombel) return "Rombel tidak sesuai kelas dan periode";
  if (!semester) return "Semester tidak sesuai tahun ajaran";
  return null;
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const search = req.nextUrl.searchParams.get("search")?.trim();
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const assignments = await prisma.teachingAssignment.findMany({
    include: includeAssignment,
    where: {
      ...(includeArchived ? {} : { deletedAt: null }),
      ...(search
        ? {
            OR: [
              { subject: { name: { contains: search, mode: "insensitive" } } },
              { rombel: { name: { contains: search, mode: "insensitive" } } },
              { teacher: { user: { profile: { fullName: { contains: search, mode: "insensitive" } } } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return ok("Daftar penugasan mengajar berhasil dimuat", assignments);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = assignmentSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data penugasan tidak valid", 400, parsed.error.flatten().fieldErrors);

  const validationError = await validateAssignmentPayload(parsed.data);
  if (validationError) return fail(validationError, 400);

  const duplicate = await prisma.teachingAssignment.findFirst({
    where: {
      academicYearId: parsed.data.academicYearId,
      rombelId: parsed.data.rombelId,
      semesterId: parsed.data.semesterId,
      subjectId: parsed.data.subjectId,
      teacherId: parsed.data.teacherId,
    },
  });
  if (duplicate) return fail("Penugasan mengajar sudah ada", 409);

  const assignment = await prisma.teachingAssignment.create({
    data: parsed.data,
    include: includeAssignment,
  });

  return created("Penugasan mengajar berhasil dibuat", assignment);
}
