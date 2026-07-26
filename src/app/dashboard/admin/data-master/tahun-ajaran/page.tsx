import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Badge } from "@/components/ui";
import { PageHeader } from "@/components/dashboard/dashboard-widgets";
import { AcademicPeriodManager } from "./academic-period-manager";
import { tokens } from "@/styles/tokens";

export default function AcademicPeriodPage() {
  return (
    <DashboardLayout role="admin">
      <div style={{ display: "grid", gap: tokens.spacing["2xl"] }}>
        <PageHeader
          badge={<Badge tone="info">Data Master</Badge>}
          description="Kelola tahun ajaran dan semester aktif yang menjadi dasar konfigurasi akademik SAGU."
          title="Tahun Ajaran dan Semester"
        />
        <AcademicPeriodManager />
      </div>
    </DashboardLayout>
  );
}
