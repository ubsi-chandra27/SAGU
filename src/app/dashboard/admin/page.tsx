import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Badge, Card } from "@/components/ui";
import { tokens } from "@/styles/tokens";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Pengguna", value: "5", tone: "info" as const },
    { label: "Total Siswa", value: "1", tone: "success" as const },
    { label: "Total Guru", value: "1", tone: "warning" as const },
    { label: "Rombel Aktif", value: "1", tone: "info" as const },
  ];

  return (
    <DashboardLayout role="admin">
      <div style={{ display: "grid", gap: tokens.spacing["2xl"] }}>
        <header>
          <Badge tone="info">Admin</Badge>
          <h1
            style={{
              color: tokens.color.textPrimary,
              fontSize: tokens.typography.heading1.fontSize,
              lineHeight: tokens.typography.heading1.lineHeight,
              margin: `${tokens.spacing.md} 0 ${tokens.spacing.xs}`,
            }}
          >
            Dashboard Admin
          </h1>
          <p
            style={{
              color: tokens.color.textSecondary,
              fontSize: tokens.typography.body.fontSize,
              lineHeight: tokens.typography.body.lineHeight,
              margin: 0,
            }}
          >
            Ringkasan awal untuk pengguna, siswa, guru, dan rombel aktif.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gap: tokens.spacing.lg,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {stats.map((item) => (
            <Card key={item.label}>
              <div style={{ display: "grid", gap: tokens.spacing.sm }}>
                <Badge tone={item.tone}>{item.label}</Badge>
                <strong
                  style={{
                    color: tokens.color.primary,
                    fontSize: tokens.typography.display.fontSize,
                    lineHeight: tokens.typography.display.lineHeight,
                  }}
                >
                  {item.value}
                </strong>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
