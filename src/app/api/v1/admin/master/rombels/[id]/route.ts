import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = rombelSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data rombel tidak valid", 400, parsed.error.flatten().fieldErrors);

  const existing = await prisma.rombel.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Rombel tidak ditemukan", 404);

  const duplicate = await prisma.rombel.findFirst({
    where: {
      academicYearId: parsed.data.academicYearId,
      classId: parsed.data.classId,
      id: { not: params.id },
      name: parsed.data.name,
      semesterId: parsed.data.semesterId,
    },
  });
  if (duplicate) return fail("Rombel sudah ada untuk kelas dan periode tersebut", 409);

  const rombel = await prisma.rombel.update({
    where: { id: params.id },
    data: parsed.data,
    include: includeRombel,
  });

  return ok("Rombel berhasil diperbarui", rombel);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.rombel.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Rombel tidak ditemukan", 404);

  const rombel = await prisma.rombel.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
    include: includeRombel,
  });

  return ok("Rombel berhasil diarsipkan", rombel);
}
