import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";
import { attendanceStatuses, buildAttendanceSummary } from "@/lib/attendance";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const [school, meeting] = await Promise.all([
    prisma.school.findFirst(),
    prisma.meeting.findFirst({
      include: {
        attendances: {
          include: { student: { include: { user: { include: { profile: true } } } } },
          orderBy: { student: { nis: "asc" } },
        },
        teachingAssignment: {
          include: {
            academicYear: true,
            class: true,
            rombel: { include: { homeroomTeacher: { include: { profile: true } } } },
            semester: true,
            subject: true,
            teacher: { include: { user: { include: { profile: true } } } },
          },
        },
      },
      where: { deletedAt: null, id: params.id },
    }),
  ]);

  if (!meeting) return fail("Pertemuan tidak ditemukan", 404);

  return ok("Absensi per pertemuan berhasil dimuat", {
    meeting,
    school,
    statuses: attendanceStatuses,
    summary: buildAttendanceSummary(meeting.attendances, meeting.attendances.length),
  });
}
