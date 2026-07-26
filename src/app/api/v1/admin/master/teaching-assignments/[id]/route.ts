import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = assignmentSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data penugasan tidak valid", 400, parsed.error.flatten().fieldErrors);

  const existing = await prisma.teachingAssignment.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Penugasan mengajar tidak ditemukan", 404);

  const duplicate = await prisma.teachingAssignment.findFirst({
    where: {
      academicYearId: parsed.data.academicYearId,
      id: { not: params.id },
      rombelId: parsed.data.rombelId,
      semesterId: parsed.data.semesterId,
      subjectId: parsed.data.subjectId,
      teacherId: parsed.data.teacherId,
    },
  });
  if (duplicate) return fail("Penugasan mengajar sudah ada", 409);

  const assignment = await prisma.teachingAssignment.update({
    where: { id: params.id },
    data: parsed.data,
    include: includeAssignment,
  });

  return ok("Penugasan mengajar berhasil diperbarui", assignment);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.teachingAssignment.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Penugasan mengajar tidak ditemukan", 404);

  const assignment = await prisma.teachingAssignment.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
    include: includeAssignment,
  });

  return ok("Penugasan mengajar berhasil diarsipkan", assignment);
}
