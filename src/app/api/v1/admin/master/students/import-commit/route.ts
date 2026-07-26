import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const importRowSchema = z.object({
  fullName: z.string().trim().min(2).max(255),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  nis: z.string().trim().min(3).max(10),
  nisn: z.string().trim().min(3).max(10),
  rombelId: z.string().uuid(),
});

const importSchema = z.object({
  rows: z.array(importRowSchema).min(1).max(500),
});

function studentUsername(nis: string) {
  return `siswa_${nis}`.toLowerCase();
}

function studentEmail(nis: string) {
  return `siswa_${nis}@sagu.local`;
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = importSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data import siswa tidak valid", 400, parsed.error.flatten().fieldErrors);

  const nisValues = parsed.data.rows.map((row) => row.nis);
  const nisnValues = parsed.data.rows.map((row) => row.nisn);
  const duplicate = await prisma.student.findFirst({
    where: { OR: [{ nis: { in: nisValues } }, { nisn: { in: nisnValues } }] },
  });
  if (duplicate) return fail("Import dibatalkan karena ada NIS atau NISN yang sudah tersimpan", 409);

  const result = await prisma.$transaction(async (tx) => {
    let created = 0;
    for (const row of parsed.data.rows) {
      const user = await tx.user.create({
        data: {
          email: studentEmail(row.nis),
          isActive: false,
          passwordHash: bcrypt.hashSync(randomUUID(), 10),
          role: "SISWA",
          username: studentUsername(row.nis),
        },
      });
      await tx.profile.create({
        data: { fullName: row.fullName, gender: row.gender, userId: user.id },
      });
      await tx.student.create({
        data: {
          nis: row.nis,
          nisn: row.nisn,
          rombelId: row.rombelId,
          userId: user.id,
        },
      });
      created += 1;
    }

    return { created };
  });

  return ok("Import siswa berhasil disimpan", {
    failed: 0,
    success: result.created,
    total: parsed.data.rows.length,
  });
}
