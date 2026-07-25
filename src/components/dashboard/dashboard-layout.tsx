"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { tokens, withAlpha } from "@/styles/tokens";

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  const menuItems: Record<string, { label: string; href: string }[]> = {
    admin: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Guru", href: "#" },
      { label: "Data Siswa", href: "#" },
      { label: "Rombel", href: "#" },
      { label: "Pengaturan", href: "#" },
    ],
    guru: [
      { label: "Dashboard", href: "/dashboard/guru" },
      { label: "Agenda Mengajar", href: "#" },
      { label: "Absensi", href: "#" },
      { label: "Penilaian", href: "#" },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <div
      style={{
        background: tokens.color.background,
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <aside style={{
        background: tokens.color.surface,
        borderRight: `1px solid ${tokens.color.border}`,
        color: tokens.color.textPrimary,
        padding: tokens.spacing["2xl"],
        width: "260px",
      }}>
        <h2
          style={{
            fontSize: tokens.typography.heading3.fontSize,
            lineHeight: tokens.typography.heading3.lineHeight,
            margin: `0 0 ${tokens.spacing["2xl"]}`,
          }}
        >
          SAGU
        </h2>
        <nav>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                borderRadius: tokens.radius.sm,
                color: item.href === "#" ? tokens.color.textSecondary : tokens.color.primary,
                display: "flex",
                fontSize: tokens.typography.body.fontSize,
                fontWeight: tokens.typography.weight.semibold,
                lineHeight: tokens.typography.body.lineHeight,
                marginBottom: tokens.spacing.xs,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                textDecoration: "none",
                background: item.href === "#" ? "transparent" : withAlpha(tokens.color.primary, 0.08),
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button
          onClick={handleLogout}
          size="sm"
          style={{
            marginTop: tokens.spacing["2xl"],
          }}
          variant="danger"
        >
          Keluar
        </Button>
      </aside>

      <main
        style={{
          flex: 1,
          padding: tokens.spacing["3xl"],
        }}
      >
        {children}
      </main>
    </div>
  );
}
