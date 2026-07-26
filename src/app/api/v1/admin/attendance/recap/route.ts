import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";
import { attendanceStatuses, buildAttendanceSummary, parseDateOnly } from "@/lib/attendance";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const academicYearId = req.nextUrl.searchParams.get("academicYearId") || undefined;
  const semesterId = req.nextUrl.searchParams.get("semesterId") || undefined;
  const rombelId = req.nextUrl.searchParams.get("rombelId") || undefined;
  const subjectId = req.nextUrl.searchParams.get("subjectId") || undefined;
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const dateFrom = from ? parseDateOnly(from) : null;
  const dateTo = to ? parseDateOnly(to) : null;

  const attendanceWhere = {
    deletedAt: null,
    ...(dateFrom || dateTo
      ? {
          attendanceDate: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: dateTo } : {}),
          },
        }
      : {}),
    meeting: {
      deletedAt: null,
      teachingAssignment: {
        ...(academicYearId ? { academicYearId } : {}),
        ...(semesterId ? { semesterId } : {}),
        ...(rombelId ? { rombelId } : {}),
        ...(subjectId ? { subjectId } : {}),
      },
    },
  };

  const [school, attendances, meetings] = await Promise.all([
    prisma.school.findFirst(),
    prisma.attendance.findMany({
      include: {
        meeting: { include: { teachingAssignment: { include: { subject: true } } } },
        student: { include: { user: { include: { profile: true } }, rombel: true } },
      },
      where: attendanceWhere,
      orderBy: [{ attendanceDate: "asc" }, { student: { nis: "asc" } }],
    }),
    prisma.meeting.findMany({
      include: {
        attendances: true,
        teachingAssignment: {
          include: {
            academicYear: true,
            class: true,
            rombel: true,
            semester: true,
            subject: true,
            teacher: { include: { user: { include: { profile: true } } } },
          },
        },
      },
      where: {
        deletedAt: null,
        ...(dateFrom || dateTo
          ? {
              meetingDate: {
                ...(dateFrom ? { gte: dateFrom } : {}),
                ...(dateTo ? { lte: dateTo } : {}),
              },
            }
          : {}),
        teachingAssignment: {
          ...(academicYearId ? { academicYearId } : {}),
          ...(semesterId ? { semesterId } : {}),
          ...(rombelId ? { rombelId } : {}),
          ...(subjectId ? { subjectId } : {}),
        },
      },
      orderBy: [{ meetingDate: "desc" }, { meetingNumber: "desc" }],
    }),
  ]);

  const byStudent = new Map<string, {
    alpha: number;
    hadir: number;
    izin: number;
    sakit: number;
    student: typeof attendances[number]["student"];
    terlambat: number;
    total: number;
  }>();

  attendances.forEach((attendance) => {
    const current =
      byStudent.get(attendance.studentId) ||
      {
        alpha: 0,
        hadir: 0,
        izin: 0,
        sakit: 0,
        student: attendance.student,
        terlambat: 0,
        total: 0,
      };

    if (attendance.status === "HADIR") current.hadir += 1;
    if (attendance.status === "IZIN") current.izin += 1;
    if (attendance.status === "SAKIT") current.sakit += 1;
    if (attendance.status === "ALPHA") current.alpha += 1;
    if (attendance.status === "TERLAMBAT") current.terlambat += 1;
    current.total += 1;
    byStudent.set(attendance.studentId, current);
  });

  const students = [...byStudent.values()].map((row) => ({
    ...row,
    percentage:
      row.total > 0 ? Math.round(((row.hadir + row.terlambat) / row.total) * 100) : 0,
  }));

  return ok("Rekap absensi berhasil dimuat", {
    meetings: meetings.map((meeting) => ({
      ...meeting,
      summary: buildAttendanceSummary(meeting.attendances, meeting.attendances.length),
    })),
    school,
    statuses: attendanceStatuses,
    students,
    summary: buildAttendanceSummary(attendances, attendances.length),
  });
}
