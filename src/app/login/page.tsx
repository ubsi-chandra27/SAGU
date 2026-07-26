"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge, Button, useToast } from "@/components/ui";
import {
  DEFAULT_LOGIN_BRANDING,
  LoginBranding,
} from "@/lib/branding-defaults";
import { tokens, withAlpha } from "@/styles/tokens";
import styles from "./page.module.css";

const cssVars = {
  "--color-primary": tokens.color.primary,
  "--color-primary-hover": tokens.color.primaryHover,
  "--color-primary-soft": tokens.color.primarySoft,
  "--color-surface": tokens.color.surface,
  "--color-surface-muted": tokens.color.surfaceMuted,
  "--color-text-primary": tokens.color.textPrimary,
  "--color-text-secondary": tokens.color.textSecondary,
  "--color-text-muted": tokens.color.textMuted,
  "--color-border": tokens.color.border,
  "--color-divider": tokens.color.divider,
  "--shadow-card": tokens.shadow.card,
  "--font-family": tokens.typography.fontFamily,
} as React.CSSProperties;

function LogoFallback() {
  return (
    <div className={styles.logoFallback} aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M6 10.5 16 5l10 5.5-10 5.5L6 10.5Z" fill="currentColor" />
        <path
          d="M9 14.5v6.2c0 .8.5 1.5 1.2 1.8l5.8 2.4 5.8-2.4c.7-.3 1.2-1 1.2-1.8v-6.2l-7 3.8-7-3.8Z"
          fill="currentColor"
          opacity="0.82"
        />
        <path
          d="M26 11v7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function TextInputIcon({ type }: { type: "user" | "lock" }) {
  if (type === "lock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" opacity="0.2" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 14v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.28" />
      <path d="M4.5 20c1.3-4 4-6 7.5-6s6.2 2 7.5 6" fill="currentColor" opacity="0.28" />
    </svg>
  );
}

function PasswordToggleIcon({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3.5 12s3.1-5 8.5-5 8.5 5 8.5 5-3.1 5-8.5 5-8.5-5-8.5-5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      {visible ? null : (
        <path d="M5 19 19 5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      )}
    </svg>
  );
}

export default function LoginPage() {
  const [branding, setBranding] = useState<LoginBranding>(
    DEFAULT_LOGIN_BRANDING
  );
  const [logoFailed, setLogoFailed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    async function loadBranding() {
      try {
        const response = await fetch("/api/v1/branding/login", {
          cache: "no-store",
        });
        const result = await response.json();

        if (active && response.ok && result.success && result.data) {
          setBranding({ ...DEFAULT_LOGIN_BRANDING, ...result.data });
          setLogoFailed(false);
        }
      } catch {
        if (active) setBranding(DEFAULT_LOGIN_BRANDING);
      }
    }

    loadBranding();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

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
        const message = data.message || "Login gagal. Periksa kembali kredensial Anda.";
        setError(message);
        showToast({
          description: message,
          title: "Login gagal",
          tone: "danger",
        });
        setLoading(false);
        return;
      }

      const role = data.data.user.role.toLowerCase();
      window.sessionStorage.setItem(
        "sagu:login-success",
        JSON.stringify({
          name: data.data.user.fullName || data.data.user.username || "",
          role: data.data.user.role,
        }),
      );
      router.push(`/dashboard/${role}`);
    } catch {
      const message = "Terjadi kesalahan jaringan. Coba beberapa saat lagi.";
      setError(message);
      showToast({
        description: message,
        title: "Login gagal",
        tone: "danger",
      });
      setLoading(false);
    }
  }

  const pageStyle = {
    ...cssVars,
    "--overlay-opacity": String(branding.loginOverlayOpacity),
    backgroundImage: `url("${branding.loginBackgroundUrl}"), url("${DEFAULT_LOGIN_BRANDING.loginBackgroundUrl}")`,
    backgroundPosition: `${branding.loginBackgroundPosition} center, center`,
  } as React.CSSProperties;

  return (
    <main className={styles.page} style={pageStyle}>
      <div className={styles.overlay} aria-hidden="true" />

      <section className={styles.brandIntro} aria-label="Branding sekolah">
        <div className={styles.brandRow}>
          {logoFailed ? (
            <LogoFallback />
          ) : (
            <Image
              alt=""
              className={styles.brandLogo}
              height={56}
              onError={() => setLogoFailed(true)}
              src={branding.logoUrl}
              unoptimized
              width={56}
            />
          )}
          <div>
            <span>{branding.schoolName}</span>
            <strong>Sistem Administrasi Guru</strong>
          </div>
        </div>
      </section>

      <section className={styles.formPanel} aria-label="Form login SAGU">
        <div className={styles.formCard}>
          <div className={styles.formBrand}>
            {logoFailed ? (
              <LogoFallback />
            ) : (
              <Image
                alt={`Logo ${branding.schoolName}`}
                className={styles.formLogo}
                height={76}
                onError={() => setLogoFailed(true)}
                src={branding.logoUrl}
                unoptimized
                width={76}
              />
            )}
            <h1>{branding.schoolName}</h1>
            <p>Sistem Administrasi Guru</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.formHeading}>
            <h2>{branding.loginTitle}</h2>
            <p>{branding.loginSubtitle}</p>
          </div>

          {error ? (
            <div className={styles.feedback} role="alert">
              <Badge tone="danger">{error}</Badge>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.field}>
              <span>Username</span>
              <div className={styles.inputShell}>
                <TextInputIcon type="user" />
                <input
                  autoComplete="username"
                  name="username"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Masukkan username"
                  required
                  type="text"
                  value={username}
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>Kata sandi</span>
              <div className={styles.inputShell}>
                <TextInputIcon type="lock" />
                <input
                  autoComplete="current-password"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan kata sandi"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  <PasswordToggleIcon visible={showPassword} />
                </button>
              </div>
            </label>

            <Button
              disabled={loading}
              fullWidth
              size="lg"
              style={{
                background: loading
                  ? tokens.color.primaryHover
                  : `linear-gradient(135deg, ${tokens.color.primary} 0%, ${tokens.color.primaryHover} 100%)`,
                borderColor: tokens.color.primary,
                boxShadow: `0 14px 28px ${withAlpha(tokens.color.primary, 0.22)}`,
                minHeight: "52px",
              }}
              type="submit"
              variant="primary"
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className={styles.poweredBy}>Powered by SAGU</div>
        </div>
      </section>
    </main>
  );
}
