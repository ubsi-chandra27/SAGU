import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const studentSchema = z.object({
  fullName: z.string().trim().min(2).max(255),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]).optional().nullable(),
  nis: z.string().trim().min(3).max(10),
  nisn: z.string().trim().min(3).max(10),
  parentEmail: z.string().trim().email().optional().or(z.literal("")).nullable(),
  parentName: z.string().trim().max(255).optional().nullable(),
  parentPhone: z.string().trim().max(15).optional().nullable(),
  rombelId: z.string().uuid().optional().nullable(),
});

const includeStudent = {
  rombel: { include: { class: true, academicYear: true, semester: true } },
  user: { include: { profile: true } },
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = studentSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data siswa tidak valid", 400, parsed.error.flatten().fieldErrors);

  const existing = await prisma.student.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Siswa tidak ditemukan", 404);

  const duplicate = await prisma.student.findFirst({
    where: {
      id: { not: params.id },
      OR: [{ nis: parsed.data.nis }, { nisn: parsed.data.nisn }],
    },
  });
  if (duplicate) return fail("NIS atau NISN sudah digunakan", 409);

  const student = await prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { userId: existing.userId },
      update: { fullName: parsed.data.fullName, gender: parsed.data.gender || null },
      create: {
        fullName: parsed.data.fullName,
        gender: parsed.data.gender || null,
        userId: existing.userId,
      },
    });

    return tx.student.update({
      where: { id: params.id },
      data: {
        nis: parsed.data.nis,
        nisn: parsed.data.nisn,
        parentEmail: parsed.data.parentEmail || null,
        parentName: parsed.data.parentName || null,
        parentPhone: parsed.data.parentPhone || null,
        rombelId: parsed.data.rombelId || null,
      },
      include: includeStudent,
    });
  });

  return ok("Siswa berhasil diperbarui", student);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.student.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Siswa tidak ditemukan", 404);

  const student = await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: existing.userId }, data: { isActive: false } });
    return tx.student.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
      include: includeStudent,
    });
  });

  return ok("Siswa berhasil diarsipkan", student);
}
