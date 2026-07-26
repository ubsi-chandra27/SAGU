import Link from "next/link";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import {
  DashboardEmptyState,
  PageHeader,
  RoleBadge,
  StatCard,
} from "@/components/dashboard/dashboard-widgets";
import { Button } from "@/components/ui";
import prisma from "@/lib/prisma";
import { tokens } from "@/styles/tokens";

const adminNextStates = [
  {
    title: "Data guru belum tersedia",
    description: "Modul Data Guru akan tersedia pada tahap Data Master Akademik.",
    icon: "school" as const,
  },
  {
    title: "Data siswa belum tersedia",
    description: "Ringkasan siswa akan muncul setelah data master siswa dibuat.",
    icon: "book" as const,
  },
  {
    title: "Rombel belum dikonfigurasi",
    description: "Informasi rombel aktif menunggu konfigurasi kelas dan rombel.",
    icon: "clipboard" as const,
  },
  {
    title: "Penugasan mengajar belum tersedia",
    description: "Rekap penugasan guru akan aktif setelah mapel dan rombel terhubung.",
    icon: "calendar" as const,
  },
];

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [activeTeachers, activeStudents, activeRombels, subjects, attendancesToday] =
    await Promise.all([
      prisma.teacher.count({ where: { deletedAt: null, user: { isActive: true } } }),
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.rombel.count({ where: { deletedAt: null } }),
      prisma.subject.count({ where: { deletedAt: null } }),
      prisma.attendance.count({ where: { attendanceDate: today, deletedAt: null } }),
    ]);

  const stats = [
    { label: "Guru Aktif", value: String(activeTeachers), description: "Record Teacher dengan akun aktif." },
    { label: "Siswa Aktif", value: String(activeStudents), description: "Siswa nonarsip." },
    { label: "Rombel", value: String(activeRombels), description: "Rombel operasional." },
    { label: "Mata Pelajaran", value: String(subjects), description: "Mapel nonarsip." },
    { label: "Absensi Hari Ini", value: String(attendancesToday), description: "Catatan absensi bertanggal hari ini." },
  ];

  return (
    <DashboardLayout role="admin">
      <div style={{ display: "grid", gap: tokens.spacing["2xl"] }}>
        <PageHeader
          badge={<RoleBadge tone="info">Admin</RoleBadge>}
          description="Ringkasan data operasional absensi dari database."
          title="Dashboard Admin"
        />

        <section
          aria-label="Statistik admin"
          style={{
            display: "grid",
            gap: tokens.spacing.lg,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {stats.map((item) => (
            <StatCard
              description={item.description}
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </section>

        <section style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacing.sm }}>
          <Link href="/dashboard/admin/data-master/mata-pelajaran"><Button>Mata Pelajaran</Button></Link>
          <Link href="/dashboard/admin/data-master/guru"><Button variant="outline">Data Guru</Button></Link>
          <Link href="/dashboard/admin/data-master/siswa"><Button variant="outline">Data Siswa</Button></Link>
          <Link href="/dashboard/admin/data-master/penugasan-mengajar"><Button variant="secondary">Penugasan Mengajar</Button></Link>
          <Link href="/dashboard/admin/rekap-absensi"><Button variant="outline">Rekap Absensi</Button></Link>
        </section>

        <section
          aria-label="Status modul lanjutan"
          style={{
            display: "grid",
            gap: tokens.spacing.lg,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {adminNextStates.map((item) => (
            <DashboardEmptyState
              description={item.description}
              icon={item.icon}
              key={item.title}
              title={item.title}
            />
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}
