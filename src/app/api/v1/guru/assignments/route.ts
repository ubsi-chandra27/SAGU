import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireGuru } from "@/lib/auth/request-user";

const includeAssignment = {
  academicYear: true,
  class: true,
  meetings: {
    orderBy: [{ meetingDate: "desc" as const }, { meetingNumber: "desc" as const }],
    take: 5,
  },
  rombel: { include: { _count: { select: { students: true } } } },
  semester: true,
  subject: true,
  teacher: { include: { user: { include: { profile: true } } } },
};

export async function GET(req: NextRequest) {
  const auth = requireGuru(req);
  if (auth.response) return auth.response;

  const teacher = await prisma.teacher.findFirst({
    where: { deletedAt: null, userId: auth.user.id },
  });
  if (!teacher) return fail("Profil guru belum terhubung", 404);

  const assignments = await prisma.teachingAssignment.findMany({
    include: includeAssignment,
    where: { deletedAt: null, teacherId: teacher.id },
    orderBy: { createdAt: "desc" },
  });

  return ok("Daftar penugasan guru berhasil dimuat", assignments);
}
