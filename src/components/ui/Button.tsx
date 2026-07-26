import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { tokens, withAlpha } from "@/styles/tokens";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: {
    minHeight: "36px",
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    ...tokens.typography.small,
    fontWeight: tokens.typography.weight.semibold,
  },
  md: {
    minHeight: "44px",
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
    ...tokens.typography.body,
    fontWeight: tokens.typography.weight.semibold,
  },
  lg: {
    minHeight: "48px",
    padding: `${tokens.spacing.md} ${tokens.spacing["2xl"]}`,
    ...tokens.typography.body,
    fontWeight: tokens.typography.weight.semibold,
  },
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: tokens.color.primary,
    borderColor: tokens.color.primary,
    color: tokens.color.surface,
  },
  secondary: {
    background: tokens.color.secondary,
    borderColor: tokens.color.secondary,
    color: tokens.color.surface,
  },
  outline: {
    background: tokens.color.surface,
    borderColor: tokens.color.border,
    color: tokens.color.textPrimary,
  },
  ghost: {
    background: "transparent",
    borderColor: "transparent",
    color: tokens.color.textSecondary,
  },
  danger: {
    background: tokens.color.danger,
    borderColor: tokens.color.danger,
    color: tokens.color.surface,
  },
};

export function Button({
  children,
  disabled,
  fullWidth = false,
  size = "md",
  style,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: tokens.radius.sm,
        boxShadow: variant === "primary" ? `0 8px 18px ${withAlpha(tokens.color.primary, 0.18)}` : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        gap: tokens.spacing.sm,
        justifyContent: "center",
        opacity: disabled ? 0.64 : 1,
        textDecoration: "none",
        transition: "150ms ease",
        width: fullWidth ? "100%" : undefined,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
