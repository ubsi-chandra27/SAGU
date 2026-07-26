import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const teacherUpdateSchema = z.object({
  email: z.string().trim().email().max(100),
  fullName: z.string().trim().min(2).max(255),
  isActive: z.boolean().optional(),
  nip: z.string().trim().max(18).optional().nullable(),
  password: z.string().min(8).max(72).optional().or(z.literal("")),
  specialization: z.string().trim().max(100).optional().nullable(),
  username: z.string().trim().min(3).max(50),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = teacherUpdateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return fail("Data guru tidak valid", 400, parsed.error.flatten().fieldErrors);
  }

  const existing = await prisma.teacher.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Guru tidak ditemukan", 404);

  const duplicate = await prisma.user.findFirst({
    where: {
      id: { not: existing.userId },
      OR: [{ username: parsed.data.username }, { email: parsed.data.email }],
    },
  });
  if (duplicate) return fail("Username atau email sudah digunakan", 409);

  const teacher = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: existing.userId },
      data: {
        email: parsed.data.email,
        isActive: parsed.data.isActive ?? true,
        ...(parsed.data.password
          ? { passwordHash: bcrypt.hashSync(parsed.data.password, 10) }
          : {}),
        username: parsed.data.username,
      },
    });

    await tx.profile.upsert({
      where: { userId: existing.userId },
      update: { fullName: parsed.data.fullName },
      create: { fullName: parsed.data.fullName, userId: existing.userId },
    });

    return tx.teacher.update({
      where: { id: params.id },
      data: {
        nip: parsed.data.nip || null,
        specialization: parsed.data.specialization || null,
      },
      include: { user: { include: { profile: true } } },
    });
  });

  return ok("Guru berhasil diperbarui", teacher);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.teacher.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Guru tidak ditemukan", 404);

  const teacher = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: existing.userId },
      data: { isActive: false },
    });

    return tx.teacher.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
      include: { user: { include: { profile: true } } },
    });
  });

  return ok("Guru berhasil dinonaktifkan", teacher);
}
