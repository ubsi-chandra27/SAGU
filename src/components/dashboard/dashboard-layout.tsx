"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{
        width: "250px",
        backgroundColor: "#1a365d",
        color: "#fff",
        padding: "1.5rem",
      }}>
        <h2 style={{ marginBottom: "2rem", fontSize: "1.25rem" }}>SAGU</h2>
        <nav>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "0.75rem 0",
                color: "#e2e8f0",
                textDecoration: "none",
                borderBottom: "1px solid #2d3748",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "2rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#c53030",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Keluar
        </button>
      </aside>

      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
