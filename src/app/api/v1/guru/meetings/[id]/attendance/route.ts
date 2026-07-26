import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireGuru } from "@/lib/auth/request-user";
import { attendanceStatuses, buildAttendanceSummary } from "@/lib/attendance";

const rowSchema = z.object({
  note: z.string().trim().max(500).optional().nullable(),
  status: z.enum(["HADIR", "IZIN", "SAKIT", "ALPHA", "TERLAMBAT"]),
  studentId: z.string().uuid(),
});

const attendanceSchema = z.object({
  rows: z.array(rowSchema).min(1),
});

async function getOwnedMeeting(userId: string, meetingId: string) {
  const teacher = await prisma.teacher.findFirst({ where: { userId, deletedAt: null } });
  if (!teacher) return null;

  return prisma.meeting.findFirst({
    include: {
      attendances: true,
      teachingAssignment: {
        include: {
          academicYear: true,
          class: true,
          rombel: {
            include: {
              students: {
                where: { deletedAt: null },
                include: { user: { include: { profile: true } } },
                orderBy: { nis: "asc" },
              },
            },
          },
          semester: true,
          subject: true,
          teacher: { include: { user: { include: { profile: true } } } },
        },
      },
    },
    where: {
      deletedAt: null,
      id: meetingId,
      teachingAssignment: { teacherId: teacher.id },
    },
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireGuru(req);
  if (auth.response) return auth.response;

  const meeting = await getOwnedMeeting(auth.user.id, params.id);
  if (!meeting) return fail("Pertemuan tidak ditemukan atau bukan milik guru ini", 404);

  const school = await prisma.school.findFirst();
  const attendanceByStudent = new Map(
    meeting.attendances.map((attendance) => [attendance.studentId, attendance])
  );
  const rows = meeting.teachingAssignment.rombel.students.map((student) => {
    const attendance = attendanceByStudent.get(student.id);
    return {
      attendanceId: attendance?.id || null,
      note: attendance?.note || "",
      status: attendance?.status || "HADIR",
      student,
    };
  });

  return ok("Data absensi berhasil dimuat", {
    meeting,
    rows,
    school,
    statuses: attendanceStatuses,
    summary: buildAttendanceSummary(rows.map((row) => ({ status: row.status })), rows.length),
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireGuru(req);
  if (auth.response) return auth.response;

  const parsed = attendanceSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data absensi tidak valid", 400, parsed.error.flatten().fieldErrors);

  const meeting = await getOwnedMeeting(auth.user.id, params.id);
  if (!meeting) return fail("Pertemuan tidak ditemukan atau bukan milik guru ini", 404);

  const validStudentIds = new Set(meeting.teachingAssignment.rombel.students.map((student) => student.id));
  if (parsed.data.rows.some((row) => !validStudentIds.has(row.studentId))) {
    return fail("Terdapat siswa yang bukan anggota rombel pertemuan ini", 403);
  }

  const saved = await prisma.$transaction(async (tx) => {
    for (const row of parsed.data.rows) {
      await tx.attendance.upsert({
        create: {
          attendanceDate: meeting.meetingDate,
          meetingId: meeting.id,
          note: row.note || null,
          recordedById: auth.user.id,
          rombelId: meeting.teachingAssignment.rombelId,
          status: row.status,
          studentId: row.studentId,
        },
        update: {
          attendanceDate: meeting.meetingDate,
          note: row.note || null,
          recordedById: auth.user.id,
          rombelId: meeting.teachingAssignment.rombelId,
          status: row.status,
        },
        where: {
          studentId_meetingId: { meetingId: meeting.id, studentId: row.studentId },
        },
      });
    }

    return tx.attendance.findMany({
      where: { meetingId: meeting.id, deletedAt: null },
      orderBy: { student: { nis: "asc" } },
    });
  });

  return ok("Absensi berhasil disimpan", {
    rows: saved,
    summary: buildAttendanceSummary(saved, validStudentIds.size),
  });
}
