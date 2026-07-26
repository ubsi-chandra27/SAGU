import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { created, fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";

const subjectSchema = z.object({
  code: z.string().trim().min(2).max(10).transform((value) => value.toUpperCase()),
  description: z.string().trim().max(1000).optional().nullable(),
  name: z.string().trim().min(2).max(100),
});

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const search = req.nextUrl.searchParams.get("search")?.trim();
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";
  const subjects = await prisma.subject.findMany({
    where: {
      ...(includeArchived ? {} : { deletedAt: null }),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ deletedAt: "asc" }, { name: "asc" }],
  });

  return ok("Daftar mata pelajaran berhasil dimuat", subjects);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const parsed = subjectSchema.safeParse(await req.json());
  if (!parsed.success) {
    return fail("Data mata pelajaran tidak valid", 400, parsed.error.flatten().fieldErrors);
  }

  const duplicate = await prisma.subject.findUnique({
    where: { code: parsed.data.code },
  });
  if (duplicate) return fail("Kode mata pelajaran sudah digunakan", 409);

  const subject = await prisma.subject.create({
    data: {
      code: parsed.data.code,
      description: parsed.data.description || null,
      name: parsed.data.name,
    },
  });

  return created("Mata pelajaran berhasil dibuat", subject);
}
