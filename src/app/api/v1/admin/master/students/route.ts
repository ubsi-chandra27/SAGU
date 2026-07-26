import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { created, fail, ok } from "@/lib/api-response";
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

function studentUsername(nis: string) {
  return `siswa_${nis}`.toLowerCase();
}

function studentEmail(nis: string) {
  return `siswa_${nis}@sagu.local`;
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const search = req.nextUrl.searchParams.get("search")?.trim();
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const students = await prisma.student.findMany({
    include: includeStudent,
    where: {
      ...(includeArchived ? {} : { deletedAt: null }),
      ...(search
        ? {
            OR: [
              { nis: { contains: search, mode: "insensitive" } },
              { nisn: { contains: search, mode: "insensitive" } },
              { user: { profile: { fullName: { contains: search, mode: "insensitive" } } } },
              { rombel: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return ok("Daftar siswa berhasil dimuat", students);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = studentSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data siswa tidak valid", 400, parsed.error.flatten().fieldErrors);

  const duplicate = await prisma.student.findFirst({
    where: { OR: [{ nis: parsed.data.nis }, { nisn: parsed.data.nisn }] },
  });
  if (duplicate) return fail("NIS atau NISN sudah digunakan", 409);

  if (parsed.data.rombelId) {
    const rombel = await prisma.rombel.findFirst({
      where: { id: parsed.data.rombelId, deletedAt: null },
    });
    if (!rombel) return fail("Rombel tidak ditemukan", 404);
  }

  const student = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: studentEmail(parsed.data.nis),
        isActive: false,
        passwordHash: bcrypt.hashSync(randomUUID(), 10),
        role: "SISWA",
        username: studentUsername(parsed.data.nis),
      },
    });

    await tx.profile.create({
      data: {
        fullName: parsed.data.fullName,
        gender: parsed.data.gender || null,
        userId: user.id,
      },
    });

    return tx.student.create({
      data: {
        nis: parsed.data.nis,
        nisn: parsed.data.nisn,
        parentEmail: parsed.data.parentEmail || null,
        parentName: parsed.data.parentName || null,
        parentPhone: parsed.data.parentPhone || null,
        rombelId: parsed.data.rombelId || null,
        userId: user.id,
      },
      include: includeStudent,
    });
  });

  return created("Siswa berhasil dibuat", student);
}
