"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, Input } from "@/components/ui";
import { tokens, withAlpha } from "@/styles/tokens";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      const role = data.data.user.role.toLowerCase();
      router.push(`/dashboard/${role}`);
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        alignItems: "center",
        background: `linear-gradient(135deg, ${tokens.color.background} 0%, ${tokens.color.primarySoft} 100%)`,
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: tokens.spacing["2xl"],
      }}
    >
      <Card
        style={{
          boxShadow: tokens.shadow.soft,
          maxWidth: "440px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.md,
            marginBottom: tokens.spacing["2xl"],
            textAlign: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              alignItems: "center",
              background: tokens.color.primary,
              borderRadius: tokens.radius.sm,
              boxShadow: `0 10px 22px ${withAlpha(tokens.color.primary, 0.24)}`,
              color: tokens.color.surface,
              display: "flex",
              fontSize: tokens.typography.body.fontSize,
              fontWeight: tokens.typography.weight.bold,
              height: "44px",
              justifyContent: "center",
              width: "44px",
            }}
          >
            S
          </div>
          <div>
            <h1
              style={{
                color: tokens.color.textPrimary,
                fontSize: tokens.typography.heading1.fontSize,
                lineHeight: tokens.typography.heading1.lineHeight,
                margin: 0,
              }}
            >
              Masuk ke SAGU
            </h1>
            <p
              style={{
                color: tokens.color.textSecondary,
                fontSize: tokens.typography.body.fontSize,
                lineHeight: tokens.typography.body.lineHeight,
                margin: `${tokens.spacing.xs} 0 0`,
              }}
            >
              Sistem Administrasi Guru untuk operasional sekolah.
            </p>
          </div>
        </div>

        {error ? (
          <div style={{ marginBottom: tokens.spacing.lg }}>
            <Badge tone="danger">{error}</Badge>
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: tokens.spacing.lg }}>
            <Input
              autoComplete="username"
              label="Username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              required
              type="text"
              value={username}
            />
            <Input
              autoComplete="current-password"
              label="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              value={password}
            />
            <Button disabled={loading} fullWidth type="submit" variant="primary">
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </div>
        </form>

        <p
          style={{
            color: tokens.color.textMuted,
            fontSize: tokens.typography.small.fontSize,
            lineHeight: tokens.typography.small.lineHeight,
            margin: `${tokens.spacing.lg} 0 0`,
            textAlign: "center",
          }}
        >
          Password default: <strong>password123</strong>
        </p>
      </Card>
    </main>
  );
}
