import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { tokens, withAlpha } from "@/styles/tokens";

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, CSSProperties> = {
  success: {
    background: withAlpha(tokens.color.success, 0.12),
    borderColor: withAlpha(tokens.color.success, 0.22),
    color: tokens.color.success,
  },
  warning: {
    background: withAlpha(tokens.color.warning, 0.12),
    borderColor: withAlpha(tokens.color.warning, 0.22),
    color: tokens.color.warning,
  },
  danger: {
    background: withAlpha(tokens.color.danger, 0.12),
    borderColor: withAlpha(tokens.color.danger, 0.22),
    color: tokens.color.danger,
  },
  info: {
    background: withAlpha(tokens.color.info, 0.12),
    borderColor: withAlpha(tokens.color.info, 0.22),
    color: tokens.color.info,
  },
  neutral: {
    background: tokens.color.surfaceMuted,
    borderColor: tokens.color.border,
    color: tokens.color.textSecondary,
  },
};

export function Badge({ children, style, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      style={{
        alignItems: "center",
        borderRadius: tokens.radius.full,
        borderStyle: "solid",
        borderWidth: "1px",
        display: "inline-flex",
        fontSize: tokens.typography.caption.fontSize,
        fontWeight: tokens.typography.weight.semibold,
        gap: tokens.spacing.xs,
        lineHeight: tokens.typography.caption.lineHeight,
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        ...toneStyles[tone],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
