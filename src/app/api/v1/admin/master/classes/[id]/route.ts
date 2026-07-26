import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const classSchema = z.object({
  academicYearId: z.string().uuid(),
  capacity: z.coerce.number().int().min(1).max(100).optional().nullable(),
  level: z.string().trim().min(1).max(10),
  name: z.string().trim().min(1).max(20),
  semesterId: z.string().uuid().optional().nullable(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = classSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data kelas tidak valid", 400, parsed.error.flatten().fieldErrors);

  const existing = await prisma.class.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Kelas tidak ditemukan", 404);

  const classRecord = await prisma.class.update({
    where: { id: params.id },
    data: parsed.data,
    include: { academicYear: true, semester: true },
  });

  return ok("Kelas berhasil diperbarui", classRecord);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.class.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Kelas tidak ditemukan", 404);

  const classRecord = await prisma.class.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
    include: { academicYear: true, semester: true },
  });

  return ok("Kelas berhasil diarsipkan", classRecord);
}
