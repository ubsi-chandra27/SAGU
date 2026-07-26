import Link from "next/link";
import { cookies } from "next/headers";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import {
  DashboardEmptyState,
  PageHeader,
  RoleBadge,
  StatCard,
} from "@/components/dashboard/dashboard-widgets";
import { Button } from "@/components/ui";
import { verifyAccessToken } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import { tokens } from "@/styles/tokens";

const guruNextStates = [
  {
    title: "Jadwal mengajar belum tersedia",
    description: "Jadwal akan muncul setelah penugasan guru dan rombel dibuat.",
    icon: "calendar" as const,
  },
  {
    title: "Belum ada pertemuan hari ini",
    description: "Tombol mulai pertemuan akan tersedia setelah jadwal aktif dibuat.",
    icon: "school" as const,
  },
  {
    title: "Absensi menunggu jadwal",
    description: "Absensi akan tersedia setelah jadwal dan penugasan mengajar dibuat.",
    icon: "clipboard" as const,
  },
  {
    title: "Jurnal mengajar belum tersedia",
    description: "Jurnal mengajar akan muncul setelah pertemuan kelas dibuat.",
    icon: "book" as const,
  },
];

function currentUserId() {
  const token = cookies().get("access_token")?.value;
  if (!token) return null;
  try {
    return verifyAccessToken(token).sub;
  } catch {
    return null;
  }
}

export default async function GuruDashboardPage() {
  const userId = currentUserId();
  const teacher = userId
    ? await prisma.teacher.findFirst({ where: { userId, deletedAt: null } })
    : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [assignmentCount, meetingsToday, doneToday, unfinishedToday] = teacher
    ? await Promise.all([
        prisma.teachingAssignment.count({ where: { teacherId: teacher.id, deletedAt: null } }),
        prisma.meeting.count({
          where: { deletedAt: null, meetingDate: today, teachingAssignment: { teacherId: teacher.id } },
        }),
        prisma.meeting.count({
          where: {
            attendances: { some: { deletedAt: null } },
            deletedAt: null,
            meetingDate: today,
            teachingAssignment: { teacherId: teacher.id },
          },
        }),
        prisma.meeting.count({
          where: {
            attendances: { none: { deletedAt: null } },
            deletedAt: null,
            meetingDate: today,
            teachingAssignment: { teacherId: teacher.id },
          },
        }),
      ])
    : [0, 0, 0, 0];

  const stats = [
    { label: "Penugasan", value: String(assignmentCount), description: "Penugasan mengajar aktif." },
    { label: "Pertemuan Hari Ini", value: String(meetingsToday), description: "Pertemuan bertanggal hari ini." },
    { label: "Absensi Selesai", value: String(doneToday), description: "Pertemuan hari ini sudah punya absensi." },
    { label: "Belum Absensi", value: String(unfinishedToday), description: "Pertemuan hari ini belum punya absensi." },
  ];

  return (
    <DashboardLayout role="guru">
      <div style={{ display: "grid", gap: tokens.spacing["2xl"] }}>
        <PageHeader
          badge={<RoleBadge tone="success">Guru</RoleBadge>}
          description="Ringkasan penugasan dan absensi dari database."
          title="Dashboard Guru"
        />

        <section
          aria-label="Statistik guru"
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
          <Link href="/dashboard/guru/pertemuan"><Button>Mulai Pertemuan</Button></Link>
          <Link href="/dashboard/guru/pertemuan"><Button variant="outline">Lanjutkan Absensi</Button></Link>
          <Link href="/dashboard/guru/pertemuan"><Button variant="ghost">Lihat Rekap</Button></Link>
        </section>

        <section
          aria-label="Status alur lanjutan guru"
          style={{
            display: "grid",
            gap: tokens.spacing.lg,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {guruNextStates.map((item) => (
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
