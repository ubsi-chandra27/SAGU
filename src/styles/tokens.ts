export const tokens = {
  color: {
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    primarySoft: "#DBEAFE",
    secondary: "#14B8A6",
    secondarySoft: "#CCFBF1",
    accent: "#FBBF24",
    accentSoft: "#FEF3C7",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F5F9",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
    divider: "#E5E7EB",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: { fontSize: "32px", lineHeight: "40px", fontWeight: 700 },
    heading1: { fontSize: "28px", lineHeight: "36px", fontWeight: 700 },
    heading2: { fontSize: "24px", lineHeight: "32px", fontWeight: 700 },
    heading3: { fontSize: "20px", lineHeight: "28px", fontWeight: 700 },
    body: { fontSize: "14px", lineHeight: "22px", fontWeight: 400 },
    small: { fontSize: "12px", lineHeight: "18px", fontWeight: 400 },
    caption: { fontSize: "11px", lineHeight: "16px", fontWeight: 500 },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "40px",
    "5xl": "48px",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    full: "9999px",
  },
  shadow: {
    soft: "0 12px 32px rgba(15, 23, 42, 0.08)",
    card: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
} as const;

export type TokenColor = keyof typeof tokens.color;

export function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
