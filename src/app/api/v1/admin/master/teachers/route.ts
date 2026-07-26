import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { created, fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const teacherSchema = z.object({
  email: z.string().trim().email().max(100),
  fullName: z.string().trim().min(2).max(255),
  isActive: z.boolean().optional(),
  nip: z.string().trim().max(18).optional().nullable(),
  password: z.string().min(8).max(72),
  specialization: z.string().trim().max(100).optional().nullable(),
  username: z.string().trim().min(3).max(50),
});

async function ensureGuruTeacherRecords() {
  const guruUsers = await prisma.user.findMany({
    where: { role: "GURU", deletedAt: null },
    include: { teacher: true },
  });

  const missing = guruUsers.filter((user) => !user.teacher);
  for (const user of missing) {
    await prisma.teacher.create({ data: { userId: user.id } });
  }
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  await ensureGuruTeacherRecords();

  const search = req.nextUrl.searchParams.get("search")?.trim();
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const teachers = await prisma.teacher.findMany({
    include: { user: { include: { profile: true } } },
    where: {
      ...(includeArchived ? {} : { deletedAt: null, user: { deletedAt: null } }),
      ...(search
        ? {
            OR: [
              { nip: { contains: search, mode: "insensitive" } },
              { specialization: { contains: search, mode: "insensitive" } },
              { user: { username: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              { user: { profile: { fullName: { contains: search, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return ok("Daftar guru berhasil dimuat", teachers);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = teacherSchema.safeParse(await req.json());
  if (!parsed.success) {
    return fail("Data guru tidak valid", 400, parsed.error.flatten().fieldErrors);
  }

  const duplicate = await prisma.user.findFirst({
    where: {
      OR: [{ username: parsed.data.username }, { email: parsed.data.email }],
    },
  });
  if (duplicate) return fail("Username atau email sudah digunakan", 409);

  const teacher = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: parsed.data.email,
        isActive: parsed.data.isActive ?? true,
        passwordHash: bcrypt.hashSync(parsed.data.password, 10),
        role: "GURU",
        username: parsed.data.username,
      },
    });

    await tx.profile.create({
      data: { fullName: parsed.data.fullName, userId: user.id },
    });

    return tx.teacher.create({
      data: {
        nip: parsed.data.nip || null,
        specialization: parsed.data.specialization || null,
        userId: user.id,
      },
      include: { user: { include: { profile: true } } },
    });
  });

  return created("Guru berhasil dibuat", teacher);
}
