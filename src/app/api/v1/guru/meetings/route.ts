import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { created, fail, ok } from "@/lib/api-response";
import { requireGuru } from "@/lib/auth/request-user";
import { parseDateOnly, parseDateTime } from "@/lib/attendance";

const meetingSchema = z.object({
  meetingDate: z.string(),
  meetingNumber: z.coerce.number().int().min(1).max(300),
  startTime: z.string(),
  endTime: z.string(),
  teachingAssignmentId: z.string().uuid(),
  topicSummary: z.string().trim().min(3).max(1000),
});

const includeMeeting = {
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
};

export async function GET(req: NextRequest) {
  const auth = requireGuru(req);
  if (auth.response) return auth.response;

  const teacher = await prisma.teacher.findFirst({ where: { userId: auth.user.id, deletedAt: null } });
  if (!teacher) return fail("Profil guru belum terhubung", 404);

  const today = req.nextUrl.searchParams.get("today");
  const meetings = await prisma.meeting.findMany({
    include: includeMeeting,
    where: {
      deletedAt: null,
      teachingAssignment: { teacherId: teacher.id },
      ...(today ? { meetingDate: parseDateOnly(today) || undefined } : {}),
    },
    orderBy: [{ meetingDate: "desc" }, { meetingNumber: "desc" }],
  });

  return ok("Daftar pertemuan berhasil dimuat", meetings);
}

export async function POST(req: NextRequest) {
  const auth = requireGuru(req);
  if (auth.response) return auth.response;

  const parsed = meetingSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Data pertemuan tidak valid", 400, parsed.error.flatten().fieldErrors);

  const meetingDate = parseDateOnly(parsed.data.meetingDate);
  const startTime = meetingDate ? parseDateTime(parsed.data.meetingDate, parsed.data.startTime) : null;
  const endTime = meetingDate ? parseDateTime(parsed.data.meetingDate, parsed.data.endTime) : null;
  if (!meetingDate || !startTime || !endTime || startTime >= endTime) {
    return fail("Tanggal atau waktu pertemuan tidak valid", 400);
  }

  const teacher = await prisma.teacher.findFirst({ where: { userId: auth.user.id, deletedAt: null } });
  if (!teacher) return fail("Profil guru belum terhubung", 404);

  const assignment = await prisma.teachingAssignment.findFirst({
    where: { deletedAt: null, id: parsed.data.teachingAssignmentId, teacherId: teacher.id },
  });
  if (!assignment) return fail("Penugasan mengajar tidak ditemukan atau bukan milik guru ini", 404);

  const duplicate = await prisma.meeting.findUnique({
    where: {
      teachingAssignmentId_meetingNumber: {
        meetingNumber: parsed.data.meetingNumber,
        teachingAssignmentId: parsed.data.teachingAssignmentId,
      },
    },
  });
  if (duplicate && !duplicate.deletedAt) return fail("Nomor pertemuan sudah digunakan pada penugasan ini", 409);

  const meeting = await prisma.meeting.create({
    data: {
      endTime,
      meetingDate,
      meetingNumber: parsed.data.meetingNumber,
      startTime,
      teachingAssignmentId: parsed.data.teachingAssignmentId,
      topicSummary: parsed.data.topicSummary,
    },
    include: includeMeeting,
  });

  return created("Pertemuan berhasil dibuat", meeting);
}
