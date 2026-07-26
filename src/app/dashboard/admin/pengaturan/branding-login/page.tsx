"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Badge, Button, Card } from "@/components/ui";
import {
  DEFAULT_LOGIN_BRANDING,
  LOGIN_BACKGROUND_POSITIONS,
  LoginBranding,
  LoginBackgroundPosition,
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
  "--color-danger": tokens.color.danger,
  "--shadow-card": tokens.shadow.card,
  "--font-family": tokens.typography.fontFamily,
} as React.CSSProperties;

type MessageState = {
  tone: "success" | "danger" | "info";
  text: string;
} | null;

function uploadLimitLabel(type: "logo" | "background") {
  return type === "logo" ? "PNG/JPG/WebP, maks. 2 MB" : "PNG/JPG/WebP, maks. 5 MB";
}

function validateClientFile(type: "logo" | "background", file: File) {
  const allowed = ["image/png", "image/jpeg", "image/webp"];
  const limit = type === "logo" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;

  if (!allowed.includes(file.type)) {
    return "Format file harus PNG, JPG, JPEG, atau WebP.";
  }

  if (file.size > limit) {
    return `Ukuran ${type === "logo" ? "logo" : "background"} melebihi ${type === "logo" ? "2 MB" : "5 MB"}.`;
  }

  return null;
}

function PreviewCard({
  branding,
  compact = false,
}: {
  branding: LoginBranding;
  compact?: boolean;
}) {
  return (
    <div
      className={compact ? styles.previewMobile : styles.previewDesktop}
      style={{
        "--preview-overlay-opacity": String(branding.loginOverlayOpacity),
        backgroundImage: `url("${branding.loginBackgroundUrl}"), url("${DEFAULT_LOGIN_BRANDING.loginBackgroundUrl}")`,
        backgroundPosition: `${branding.loginBackgroundPosition} center, center`,
      } as React.CSSProperties}
    >
      <div className={styles.previewOverlay} />
      <div className={styles.previewLoginCard}>
        <Image
          alt={`Logo ${branding.schoolName}`}
          className={styles.previewLogo}
          height={48}
          src={branding.logoUrl}
          unoptimized
          width={48}
        />
        <strong>{branding.schoolName}</strong>
        <span>Sistem Administrasi Guru</span>
        <h3>{branding.loginTitle}</h3>
        <p>{branding.loginSubtitle}</p>
        <div className={styles.previewInput} />
        <div className={styles.previewButton} />
      </div>
    </div>
  );
}

export default function LoginBrandingPage() {
  const [branding, setBranding] = useState<LoginBranding>(DEFAULT_LOGIN_BRANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "background" | null>(null);
  const [message, setMessage] = useState<MessageState>(null);

  useEffect(() => {
    let active = true;

    async function loadBranding() {
      try {
        const response = await fetch("/api/v1/admin/login-branding", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Branding gagal dimuat");
        }

        if (active) {
          setBranding({ ...DEFAULT_LOGIN_BRANDING, ...result.data });
          setMessage(null);
        }
      } catch (error) {
        if (active) {
          setMessage({
            tone: "danger",
            text:
              error instanceof Error
                ? error.message
                : "Branding gagal dimuat.",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBranding();

    return () => {
      active = false;
    };
  }, []);

  function updateBranding<K extends keyof LoginBranding>(
    key: K,
    value: LoginBranding[K]
  ) {
    setBranding((current) => ({ ...current, [key]: value }));
  }

  async function uploadFile(
    type: "logo" | "background",
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationMessage = validateClientFile(type, file);
    if (validationMessage) {
      setMessage({ tone: "danger", text: validationMessage });
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);

    setUploading(type);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/admin/login-branding/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload gagal");
      }

      setBranding({ ...DEFAULT_LOGIN_BRANDING, ...result.data.branding });
      setMessage({
        tone: "success",
        text:
          type === "logo"
            ? "Logo sekolah berhasil diperbarui."
            : "Background login berhasil diperbarui.",
      });
    } catch (error) {
      setMessage({
        tone: "danger",
        text: error instanceof Error ? error.message : "Upload gagal.",
      });
    } finally {
      setUploading(null);
    }
  }

  async function saveBranding() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/admin/login-branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl: branding.logoUrl,
          loginBackgroundUrl: branding.loginBackgroundUrl,
          loginTitle: branding.loginTitle,
          loginSubtitle: branding.loginSubtitle,
          loginBackgroundPosition: branding.loginBackgroundPosition,
          loginOverlayOpacity: branding.loginOverlayOpacity,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Branding gagal disimpan");
      }

      setBranding({ ...DEFAULT_LOGIN_BRANDING, ...result.data });
      setMessage({ tone: "success", text: "Branding login berhasil disimpan." });
    } catch (error) {
      setMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : "Branding gagal disimpan.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function resetBranding() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/admin/login-branding/reset", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Branding gagal dikembalikan");
      }

      setBranding({ ...DEFAULT_LOGIN_BRANDING, ...result.data });
      setMessage({
        tone: "success",
        text: "Branding login dikembalikan ke default.",
      });
    } catch (error) {
      setMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : "Branding gagal dikembalikan.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className={styles.page} style={cssVars}>
        <header className={styles.header}>
          <Badge tone="info">Pengaturan</Badge>
          <h1>Branding Halaman Login</h1>
          <p>
            Atur logo sekolah, background, judul, subjudul, posisi gambar, dan
            overlay halaman login.
          </p>
        </header>

        {message ? (
          <div className={styles.message} role="status">
            <Badge tone={message.tone}>{message.text}</Badge>
          </div>
        ) : null}

        <div className={styles.grid}>
          <Card>
            <div className={styles.formSection}>
              <h2>Konten Branding</h2>

              {loading ? (
                <p className={styles.muted}>Memuat branding...</p>
              ) : (
                <>
                  <label className={styles.field}>
                    <span>Logo sekolah</span>
                    <input
                      accept="image/png,image/jpeg,image/webp"
                      disabled={Boolean(uploading) || saving}
                      onChange={(event) => uploadFile("logo", event)}
                      type="file"
                    />
                    <small>{uploadLimitLabel("logo")}</small>
                  </label>

                  <label className={styles.field}>
                    <span>Background login</span>
                    <input
                      accept="image/png,image/jpeg,image/webp"
                      disabled={Boolean(uploading) || saving}
                      onChange={(event) => uploadFile("background", event)}
                      type="file"
                    />
                    <small>{uploadLimitLabel("background")}</small>
                  </label>

                  <label className={styles.field}>
                    <span>Judul login</span>
                    <input
                      maxLength={120}
                      onChange={(event) =>
                        updateBranding("loginTitle", event.target.value)
                      }
                      type="text"
                      value={branding.loginTitle}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Subjudul login</span>
                    <textarea
                      maxLength={255}
                      onChange={(event) =>
                        updateBranding("loginSubtitle", event.target.value)
                      }
                      rows={3}
                      value={branding.loginSubtitle}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Posisi background</span>
                    <select
                      onChange={(event) =>
                        updateBranding(
                          "loginBackgroundPosition",
                          event.target.value as LoginBackgroundPosition
                        )
                      }
                      value={branding.loginBackgroundPosition}
                    >
                      {LOGIN_BACKGROUND_POSITIONS.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.field}>
                    <span>Overlay background</span>
                    <input
                      max="0.8"
                      min="0"
                      onChange={(event) =>
                        updateBranding(
                          "loginOverlayOpacity",
                          Number(event.target.value)
                        )
                      }
                      step="0.05"
                      type="range"
                      value={branding.loginOverlayOpacity}
                    />
                    <small>{Math.round(branding.loginOverlayOpacity * 100)}%</small>
                  </label>

                  <div className={styles.actions}>
                    <Button
                      disabled={saving || Boolean(uploading)}
                      onClick={saveBranding}
                      type="button"
                      variant="primary"
                    >
                      {saving ? "Menyimpan..." : "Simpan"}
                    </Button>
                    <Button
                      disabled={saving || Boolean(uploading)}
                      onClick={resetBranding}
                      type="button"
                      variant="outline"
                    >
                      Kembalikan ke Default
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>

          <div className={styles.previewStack}>
            <Card>
              <div className={styles.previewHeader}>
                <h2>Pratinjau Desktop</h2>
                <Badge tone="neutral">Desktop</Badge>
              </div>
              <PreviewCard branding={branding} />
            </Card>

            <Card>
              <div className={styles.previewHeader}>
                <h2>Pratinjau Mobile</h2>
                <Badge tone="neutral">Mobile</Badge>
              </div>
              <PreviewCard branding={branding} compact />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
