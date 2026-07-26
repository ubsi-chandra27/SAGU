import Link from "next/link";
import type { CSSProperties } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { Badge, Card } from "@/components/ui";
import prisma from "@/lib/prisma";
import styles from "./page.module.css";

type Tone = "blue" | "green" | "orange" | "violet";

const statMeta: {
  description: string;
  href: string;
  icon: "book" | "calendar" | "clipboard" | "school" | "user";
  key: "teachers" | "students" | "rombels" | "assignments";
  label: string;
  tone: Tone;
}[] = [
  {
    key: "teachers",
    label: "Total Guru",
    description: "Guru aktif terdaftar",
    href: "/dashboard/admin/data-master/guru",
    icon: "user",
    tone: "blue",
  },
  {
    key: "students",
    label: "Total Siswa",
    description: "Siswa nonarsip",
    href: "/dashboard/admin/data-master/siswa",
    icon: "school",
    tone: "green",
  },
  {
    key: "rombels",
    label: "Total Rombel",
    description: "Rombongan belajar aktif",
    href: "/dashboard/admin/data-master/rombel",
    icon: "school",
    tone: "orange",
  },
  {
    key: "assignments",
    label: "Penugasan Mengajar",
    description: "Penugasan aktif berjalan",
    href: "/dashboard/admin/data-master/penugasan-mengajar",
    icon: "clipboard",
    tone: "violet",
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
    label: "Kelola Guru",
  },
  {
    href: "/dashboard/admin/data-master/siswa",
    icon: "school" as const,
    label: "Kelola Siswa",
  },
  {
    href: "/dashboard/admin/data-master/rombel",
    icon: "school" as const,
    label: "Kelola Rombel",
  },
  {
    href: "/dashboard/admin/data-master/mata-pelajaran",
    icon: "book" as const,
    label: "Kelola Mapel",
  },
  {
    href: "/dashboard/admin/data-master/penugasan-mengajar",
    icon: "clipboard" as const,
    label: "Buat Penugasan Mengajar",
  },
  {
    href: "/dashboard/admin/rekap-absensi",
    icon: "print" as const,
    label: "Rekap Absensi",
  },
];

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    year: "numeric",
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
  ]);

  const stats = {
    teachers: activeTeachers,
    students: activeStudents,
    rombels: activeRombels,
    assignments: activeAssignments,
  };

  const attendanceTotal = attendanceSummary.reduce((total, item) => total + item._count._all, 0);
  const presentToday =
    attendanceSummary.find((item) => item.status === "HADIR")?._count._all || 0;
  const attendancePercent = attendanceTotal
    ? Math.round((presentToday / attendanceTotal) * 100)
    : 0;

  const readiness = [
    {
      href: "/dashboard/admin/data-master/tahun-ajaran",
      label: "Periode akademik",
      value: activeYear && activeSemester ? "Siap" : "Perlu dilengkapi",
      tone: activeYear && activeSemester ? "success" : "warning",
    },
    {
      href: "/dashboard/admin/data-master/guru",
      label: "Data guru",
      value: activeTeachers > 0 ? `${activeTeachers} aktif` : "Kosong",
      tone: activeTeachers > 0 ? "success" : "warning",
    },
    {
      href: "/dashboard/admin/data-master/siswa",
      label: "Data siswa",
      value: activeStudents > 0 ? `${activeStudents} siswa` : "Kosong",
      tone: activeStudents > 0 ? "success" : "warning",
    },
    {
      href: "/dashboard/admin/data-master/penugasan-mengajar",
      label: "Penugasan",
      value: activeAssignments > 0 ? `${activeAssignments} aktif` : "Kosong",
      tone: activeAssignments > 0 ? "success" : "warning",
    },
  ] as const;

  return (
    <DashboardLayout role="admin">
      <div className={styles.dashboard}>
        <section className={styles.hero} aria-labelledby="admin-dashboard-title">
          <div>
            <Badge tone="info">Admin</Badge>
            <h1 id="admin-dashboard-title">Dashboard Admin</h1>
            <p>
              Ringkasan operasional SAGU untuk periode aktif, data master, dan kesiapan
              absensi sekolah.
            </p>
          </div>
          <div className={styles.heroMeta}>
            <span>Terakhir diperbarui</span>
            <strong>{formatDateTime(new Date())}</strong>
          </div>
        </section>

        <section className={styles.statsGrid} aria-label="Statistik utama admin">
          {statMeta.map((item) => (
            <Link className={styles.statCard} href={item.href} key={item.key}>
              <span className={`${styles.statIcon} ${styles[item.tone]}`}>
                <DashboardIcon name={item.icon} />
              </span>
              <span className={styles.statBody}>
                <span className={styles.statLabel}>{item.label}</span>
                <strong>{stats[item.key]}</strong>
                <span>{item.description}</span>
              </span>
              <DashboardIcon className={styles.cardArrow} name="chevronRight" />
            </Link>
          ))}
        </section>

        <section className={styles.mainGrid} aria-label="Status operasional admin">
          <Card className={styles.attendanceCard}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Absensi</span>
                <h2>Kehadiran Hari Ini</h2>
              </div>
              <Link className={styles.textLink} href="/dashboard/admin/rekap-absensi">
                Lihat Rekap
              </Link>
            </div>

            <div className={styles.attendanceContent}>
              <div
                className={styles.attendanceRing}
                style={{ "--ring-value": `${attendancePercent}%` } as CSSProperties}
              >
                <span>{attendancePercent}%</span>
                <small>Hadir</small>
              </div>
              <div className={styles.attendanceRows}>
                {attendanceSummary.length > 0 ? (
                  attendanceSummary.map((item) => (
                    <div className={styles.attendanceRow} key={item.status}>
                      <span>{item.status}</span>
                      <strong>{item._count._all}</strong>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyNote}>
                    Belum ada catatan absensi untuk hari ini.
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className={styles.periodCard}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Periode Akademik</span>
                <h2>Periode Aktif</h2>
              </div>
              <Badge tone={activeYear && activeSemester ? "success" : "warning"}>
                {activeYear && activeSemester ? "Aktif" : "Perlu dicek"}
              </Badge>
            </div>
            <div className={styles.periodGrid}>
              <div className={styles.periodBox}>
                <span>Tahun Ajaran</span>
                <strong>{activeYear?.name || "Belum diatur"}</strong>
                <small>
                  {formatDate(activeYear?.startDate)} - {formatDate(activeYear?.endDate)}
                </small>
              </div>
              <div className={styles.periodBox}>
                <span>Semester</span>
                <strong>{activeSemester?.name || "Belum diatur"}</strong>
                <small>
                  {formatDate(activeSemester?.startDate)} - {formatDate(activeSemester?.endDate)}
                </small>
              </div>
            </div>
            <Link className={styles.primaryAction} href="/dashboard/admin/data-master/tahun-ajaran">
              Kelola Tahun Ajaran & Semester
              <DashboardIcon name="chevronRight" />
            </Link>
          </Card>
        </section>

        <section className={styles.lowerGrid} aria-label="Aksi dan kesiapan data">
          <Card>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Akses Cepat</span>
                <h2>Tindakan Operasional</h2>
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

          <Card>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Kesiapan Data</span>
                <h2>Fondasi Operasional</h2>
              </div>
            </div>
            <div className={styles.readinessList}>
              {readiness.map((item) => (
                <Link className={styles.readinessItem} href={item.href} key={item.label}>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.value}</small>
                  </span>
                  <Badge tone={item.tone}>{item.tone === "success" ? "Siap" : "Cek"}</Badge>
                </Link>
              ))}
              <div className={styles.readinessItem}>
                <span>
                  <strong>Mata pelajaran</strong>
                  <small>{activeSubjects > 0 ? `${activeSubjects} mapel` : "Kosong"}</small>
                </span>
                <Badge tone={activeSubjects > 0 ? "success" : "warning"}>
                  {activeSubjects > 0 ? "Siap" : "Cek"}
                </Badge>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
