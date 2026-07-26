import type { AcademicYear, Semester } from "@prisma/client";

export type SerializedSemester = {
  academicYearId: string;
  createdAt: string;
  deletedAt: string | null;
  endDate: string;
  id: string;
  isActive: boolean;
  name: string;
  startDate: string;
  updatedAt: string;
};

export type SerializedAcademicYear = {
  createdAt: string;
  deletedAt: string | null;
  endDate: string;
  id: string;
  isActive: boolean;
  name: string;
  semesters?: SerializedSemester[];
  startDate: string;
  updatedAt: string;
};

export function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function serializeSemester(semester: Semester): SerializedSemester {
  return {
    id: semester.id,
    academicYearId: semester.academicYearId,
    name: semester.name,
    startDate: dateOnly(semester.startDate),
    endDate: dateOnly(semester.endDate),
    isActive: semester.isActive,
    createdAt: semester.createdAt.toISOString(),
    updatedAt: semester.updatedAt.toISOString(),
    deletedAt: semester.deletedAt?.toISOString() ?? null,
  };
}

export function serializeAcademicYear(
  academicYear: AcademicYear & { semesters?: Semester[] }
): SerializedAcademicYear {
  return {
    id: academicYear.id,
    name: academicYear.name,
    startDate: dateOnly(academicYear.startDate),
    endDate: dateOnly(academicYear.endDate),
    isActive: academicYear.isActive,
    createdAt: academicYear.createdAt.toISOString(),
    updatedAt: academicYear.updatedAt.toISOString(),
    deletedAt: academicYear.deletedAt?.toISOString() ?? null,
    semesters: academicYear.semesters?.map(serializeSemester),
  };
}

export function isDateRangeValid(startDate: Date, endDate: Date) {
  return startDate.getTime() <= endDate.getTime();
}

export function isSemesterInsideAcademicYear(
  semesterStartDate: Date,
  semesterEndDate: Date,
  academicYearStartDate: Date,
  academicYearEndDate: Date
) {
  return (
    semesterStartDate.getTime() >= academicYearStartDate.getTime() &&
    semesterEndDate.getTime() <= academicYearEndDate.getTime()
  );
}
