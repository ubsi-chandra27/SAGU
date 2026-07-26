import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const subjectSchema = z.object({
  code: z.string().trim().min(2).max(10).transform((value) => value.toUpperCase()),
  description: z.string().trim().max(1000).optional().nullable(),
  name: z.string().trim().min(2).max(100),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = subjectSchema.safeParse(await req.json());
  if (!parsed.success) {
    return fail("Data mata pelajaran tidak valid", 400, parsed.error.flatten().fieldErrors);
  }

  const existing = await prisma.subject.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Mata pelajaran tidak ditemukan", 404);

  const duplicate = await prisma.subject.findFirst({
    where: { code: parsed.data.code, id: { not: params.id } },
  });
  if (duplicate) return fail("Kode mata pelajaran sudah digunakan", 409);

  const subject = await prisma.subject.update({
    where: { id: params.id },
    data: {
      code: parsed.data.code,
      description: parsed.data.description || null,
      name: parsed.data.name,
    },
  });

  return ok("Mata pelajaran berhasil diperbarui", subject);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const existing = await prisma.subject.findUnique({ where: { id: params.id } });
  if (!existing || existing.deletedAt) return fail("Mata pelajaran tidak ditemukan", 404);

  const subject = await prisma.subject.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });

  return ok("Mata pelajaran berhasil diarsipkan", subject);
}
