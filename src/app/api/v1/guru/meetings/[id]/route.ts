import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireGuru } from "@/lib/auth/request-user";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireGuru(req);
  if (auth.response) return auth.response;

  const teacher = await prisma.teacher.findFirst({ where: { userId: auth.user.id, deletedAt: null } });
  if (!teacher) return fail("Profil guru belum terhubung", 404);

  const meeting = await prisma.meeting.findFirst({
    include: {
      attendances: true,
      teachingAssignment: {
        include: {
          academicYear: true,
          class: true,
          rombel: { include: { students: { where: { deletedAt: null }, include: { user: { include: { profile: true } } } } } },
          semester: true,
          subject: true,
          teacher: { include: { user: { include: { profile: true } } } },
        },
      },
    },
    where: {
      deletedAt: null,
      id: params.id,
      teachingAssignment: { teacherId: teacher.id },
    },
  });
  if (!meeting) return fail("Pertemuan tidak ditemukan atau bukan milik guru ini", 404);

  return ok("Pertemuan berhasil dimuat", meeting);
}
