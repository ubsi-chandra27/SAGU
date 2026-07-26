import type { AttendanceStatus } from "@prisma/client";

export const attendanceStatuses: AttendanceStatus[] = [
  "HADIR",
  "IZIN",
  "SAKIT",
  "ALPHA",
  "TERLAMBAT",
];

export function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseDateTime(date: string, time: string) {
  if (!/^\d{2}:\d{2}$/.test(time)) return null;
  const value = new Date(`${date}T${time}:00.000`);
  return Number.isNaN(value.getTime()) ? null : value;
}

export function buildAttendanceSummary(
  rows: { status: AttendanceStatus }[],
  totalStudents = rows.length
) {
  const summary = attendanceStatuses.reduce<Record<AttendanceStatus, number>>((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<AttendanceStatus, number>);

  rows.forEach((row) => {
    summary[row.status] += 1;
  });

  const presentCount = summary.HADIR + summary.TERLAMBAT;
  const percentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return {
    alpha: summary.ALPHA,
    hadir: summary.HADIR,
    izin: summary.IZIN,
    persentase: percentage,
    sakit: summary.SAKIT,
    terlambat: summary.TERLAMBAT,
    total: totalStudents,
  };
}
