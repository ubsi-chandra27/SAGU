import Link from "next/link";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { Badge, Card } from "@/components/ui";
import prisma from "@/lib/prisma";
import styles from "./page.module.css";

type StatKey = "teachers" | "students" | "rombels" | "assignments";
type AttendanceStatus = "HADIR" | "IZIN" | "SAKIT" | "ALPHA" | "TERLAMBAT";

const statMeta: {
  description: string;
  href: string;
  icon: "clipboard" | "school" | "user";
  key: StatKey;
  label: string;
}[] = [
  {
    key: "teachers",
    label: "Guru aktif",
    description: "Guru dengan akun aktif",
    href: "/dashboard/admin/data-master/guru",
    icon: "user",
  },
  {
    key: "students",
    label: "Siswa aktif",
    description: "Siswa nonarsip",
    href: "/dashboard/admin/data-master/siswa",
    icon: "school",
  },
  {
    key: "rombels",
    label: "Rombel aktif",
    description: "Rombongan belajar",
    href: "/dashboard/admin/data-master/rombel",
    icon: "school",
  },
  {
    key: "assignments",
    label: "Penugasan aktif",
    description: "Penugasan mengajar",
    href: "/dashboard/admin/data-master/penugasan-mengajar",
    icon: "clipboard",
  },
];

const quickActions = [
  {
    href: "/dashboard/admin/data-master/tahun-ajaran",
    icon: "calendar" as const,
    label: "Kelola Tahun Ajaran",
  },
  {
    href: "/dashboard/admin/data-master/guru",
    icon: "user" as const,
    label: "Tambah Guru",
  },
  {
    href: "/dashboard/admin/data-master/siswa",
    icon: "school" as const,
    label: "Tambah Siswa",
  },
  {
    href: "/dashboard/admin/data-master/penugasan-mengajar",
    icon: "clipboard" as const,
    label: "Buat Penugasan",
  },
];

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatAttendanceStatus(status: AttendanceStatus) {
  const labels: Record<AttendanceStatus, string> = {
    HADIR: "Hadir",
    IZIN: "Izin",
    SAKIT: "Sakit",
    ALPHA: "Alfa",
    TERLAMBAT: "Terlambat",
  };
  return labels[status];
}

function getSlotStatus(startTime: Date, endTime: Date) {
  const now = new Date();
  if (now < startTime) return "Akan Datang";
  if (now > endTime) return "Selesai";
  return "Berlangsung";
}

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    activeTeachers,
    activeStudents,
    activeRombels,
    activeSubjects,
    activeAssignments,
    activeYear,
    activeSemester,
    attendanceSummary,
    todayMeetings,
    absentStudents,
  ] = await Promise.all([
    prisma.teacher.count({ where: { deletedAt: null, user: { isActive: true } } }),
    prisma.student.count({ where: { deletedAt: null } }),
    prisma.rombel.count({ where: { deletedAt: null } }),
    prisma.subject.count({ where: { deletedAt: null } }),
    prisma.teachingAssignment.count({ where: { deletedAt: null } }),
    prisma.academicYear.findFirst({
      where: { deletedAt: null, isActive: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.semester.findFirst({
      include: { academicYear: true },
      where: { deletedAt: null, isActive: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.attendance.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: { attendanceDate: today, deletedAt: null },
    }),
    prisma.meeting.findMany({
      include: {
        teachingAssignment: {
          include: {
            rombel: true,
          },
        },
      },
      orderBy: [{ startTime: "asc" }, { endTime: "asc" }],
      where: { deletedAt: null, meetingDate: today },
    }),
    prisma.attendance.findMany({
      include: {
        rombel: true,
        student: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
      orderBy: [{ rombel: { name: "asc" } }, { student: { nis: "asc" } }],
      take: 10,
      where: {
        attendanceDate: today,
        deletedAt: null,
        status: { in: ["IZIN", "SAKIT", "ALPHA", "TERLAMBAT"] },
      },
    }),
  ]);

  const stats: Record<StatKey, number> = {
    teachers: activeTeachers,
    students: activeStudents,
    rombels: activeRombels,
    assignments: activeAssignments,
  };

  const attendanceCounts = new Map<AttendanceStatus, number>(
    attendanceSummary.map((item) => [item.status as AttendanceStatus, item._count._all]),
  );
  const attendanceTotal = attendanceSummary.reduce((total, item) => total + item._count._all, 0);
  const readiness = [
    {
      href: "/dashboard/admin/data-master/tahun-ajaran",
      label: "Periode aktif",
      summary:
        activeYear && activeSemester
          ? `${activeYear.name} - ${activeSemester.name}`
          : "Tahun ajaran atau semester belum aktif",
      ready: Boolean(activeYear && activeSemester),
    },
    {
      href: "/dashboard/admin/data-master/guru",
      label: "Guru",
      summary: activeTeachers > 0 ? `${activeTeachers} guru aktif` : "Belum ada guru aktif",
      ready: activeTeachers > 0,
    },
    {
      href: "/dashboard/admin/data-master/siswa",
      label: "Siswa",
      summary: activeStudents > 0 ? `${activeStudents} siswa aktif` : "Belum ada siswa",
      ready: activeStudents > 0,
    },
    {
      href: "/dashboard/admin/data-master/rombel",
      label: "Rombel",
      summary: activeRombels > 0 ? `${activeRombels} rombel aktif` : "Belum ada rombel",
      ready: activeRombels > 0,
    },
    {
      href: "/dashboard/admin/data-master/mata-pelajaran",
      label: "Mata pelajaran",
      summary: activeSubjects > 0 ? `${activeSubjects} mata pelajaran` : "Belum ada mapel",
      ready: activeSubjects > 0,
    },
    {
      href: "/dashboard/admin/data-master/penugasan-mengajar",
      label: "Penugasan mengajar",
      summary:
        activeAssignments > 0
          ? `${activeAssignments} penugasan aktif`
          : "Belum ada penugasan",
      ready: activeAssignments > 0,
    },
  ];

  const meetingSlots = Array.from(
    todayMeetings.reduce((slots, meeting) => {
      const key = `${formatTime(meeting.startTime)}-${formatTime(meeting.endTime)}`;
      const current = slots.get(key) || {
        classCount: 0,
        endTime: meeting.endTime,
        label: `${formatTime(meeting.startTime)}-${formatTime(meeting.endTime)}`,
        rombels: new Set<string>(),
        startTime: meeting.startTime,
      };
      current.classCount += 1;
      current.rombels.add(meeting.teachingAssignment.rombel.name);
      slots.set(key, current);
      return slots;
    }, new Map<string, { classCount: number; endTime: Date; label: string; rombels: Set<string>; startTime: Date }>()),
  ).map(([, slot]) => slot);

  return (
    <DashboardLayout role="admin">
      <div className={styles.dashboard}>
        <section className={styles.header} aria-labelledby="admin-dashboard-title">
          <div>
            <h1 id="admin-dashboard-title">Dashboard Admin</h1>
            <p>Ringkasan operasional administrasi sekolah hari ini.</p>
          </div>
          <div className={styles.headerPeriod}>
            <span>Periode aktif</span>
            <strong>
              {activeYear && activeSemester
                ? `${activeYear.name} - ${activeSemester.name}`
                : "Belum lengkap"}
            </strong>
            <small>
              {formatDate(activeYear?.startDate)} - {formatDate(activeYear?.endDate)}
            </small>
          </div>
        </section>

        <section className={styles.statsGrid} aria-label="Ringkasan utama">
          {statMeta.map((item) => (
            <Link className={styles.statCard} href={item.href} key={item.key}>
              <span className={styles.statIcon}>
                <DashboardIcon name={item.icon} />
              </span>
              <span className={styles.statBody}>
                <span>{item.label}</span>
                <strong>{stats[item.key]}</strong>
                <small>{item.description}</small>
              </span>
              <DashboardIcon className={styles.cardArrow} name="chevronRight" />
            </Link>
          ))}
        </section>

        <section className={styles.operationalGrid} aria-label="Area operasional utama">
          <Card className={styles.readinessCard}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Kesiapan Operasional</span>
                <h2>Fondasi Data Sekolah</h2>
              </div>
            </div>
            <div className={styles.readinessList}>
              {readiness.map((item) => (
                <Link className={styles.readinessItem} href={item.href} key={item.label}>
                  <span className={styles.readinessStatus} data-ready={item.ready}>
                    <DashboardIcon name={item.ready ? "check" : "chevronRight"} />
                  </span>
                  <span className={styles.readinessCopy}>
                    <strong>{item.label}</strong>
                    <small>{item.summary}</small>
                  </span>
                  <Badge tone={item.ready ? "success" : "warning"}>
                    {item.ready ? "Siap" : "Cek"}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Absensi</span>
                <h2>Ringkasan Hari Ini</h2>
              </div>
              <Link className={styles.textLink} href="/dashboard/admin/rekap-absensi">
                Lihat rekap
              </Link>
            </div>
            {attendanceTotal > 0 ? (
              <div className={styles.attendanceList}>
                {(["HADIR", "IZIN", "SAKIT", "ALPHA", "TERLAMBAT"] as AttendanceStatus[]).map(
                  (status) => (
                    <div className={styles.attendanceRow} key={status}>
                      <span>{formatAttendanceStatus(status)}</span>
                      <strong>{attendanceCounts.get(status) || 0}</strong>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                Ringkasan absensi akan tersedia setelah modul pertemuan dan absensi digunakan.
              </div>
            )}
          </Card>
        </section>

        <section className={styles.lowerGrid} aria-label="Informasi harian">
          <Card>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Jadwal</span>
                <h2>Jadwal Mengajar Hari Ini</h2>
              </div>
            </div>
            {meetingSlots.length > 0 ? (
              <div className={styles.scheduleList}>
                {meetingSlots.map((slot) => (
                  <div className={styles.scheduleItem} key={slot.label}>
                    <strong>{slot.label}</strong>
                    <span>{slot.rombels.size} rombel</span>
                    <Badge tone={getSlotStatus(slot.startTime, slot.endTime) === "Berlangsung" ? "info" : "neutral"}>
                      {getSlotStatus(slot.startTime, slot.endTime)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                Jadwal mengajar hari ini belum tersedia dari pertemuan yang tercatat.
              </div>
            )}
          </Card>

          <Card>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Kehadiran</span>
                <h2>Siswa Tidak Hadir Hari Ini</h2>
              </div>
            </div>
            {absentStudents.length > 0 ? (
              <div className={styles.absentList}>
                {absentStudents.map((attendance) => (
                  <div className={styles.absentItem} key={attendance.id}>
                    <span>
                      <strong>
                        {attendance.student.user.profile?.fullName ||
                          attendance.student.user.username}
                      </strong>
                      <small>{attendance.rombel.name}</small>
                    </span>
                    <Badge tone={attendance.status === "TERLAMBAT" ? "warning" : "danger"}>
                      {formatAttendanceStatus(attendance.status as AttendanceStatus)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                Daftar siswa tidak hadir akan muncul setelah absensi hari ini diisi.
              </div>
            )}
          </Card>
        </section>

        <Card className={styles.quickCard}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Aksi Cepat</span>
              <h2>Tindakan Prioritas</h2>
            </div>
          </div>
          <div className={styles.quickGrid}>
            {quickActions.map((action) => (
              <Link className={styles.quickAction} href={action.href} key={action.href}>
                <DashboardIcon name={action.icon} />
                <span>{action.label}</span>
                <DashboardIcon className={styles.cardArrow} name="chevronRight" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
