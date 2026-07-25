import type { CSSProperties, InputHTMLAttributes } from "react";
import { tokens, withAlpha } from "@/styles/tokens";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  helperText?: string;
  label: string;
};

const labelStyle: CSSProperties = {
  color: tokens.color.textPrimary,
  display: "block",
  fontSize: tokens.typography.small.fontSize,
  fontWeight: tokens.typography.weight.semibold,
  lineHeight: tokens.typography.small.lineHeight,
  marginBottom: tokens.spacing.sm,
};

export function Input({ error, helperText, id, label, required, style, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div style={{ width: "100%" }}>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
        {required ? <span style={{ color: tokens.color.danger }}> *</span> : null}
      </label>
      <input
        aria-invalid={Boolean(error)}
        id={inputId}
        required={required}
        style={{
          background: tokens.color.surface,
          border: `1px solid ${error ? tokens.color.danger : tokens.color.border}`,
          borderRadius: tokens.radius.sm,
          boxShadow: error ? `0 0 0 3px ${withAlpha(tokens.color.danger, 0.1)}` : "none",
          color: tokens.color.textPrimary,
          fontFamily: tokens.typography.fontFamily,
          fontSize: tokens.typography.body.fontSize,
          lineHeight: tokens.typography.body.lineHeight,
          minHeight: "44px",
          outline: "none",
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          width: "100%",
          ...style,
        }}
        {...props}
      />
      {error || helperText ? (
        <p
          style={{
            color: error ? tokens.color.danger : tokens.color.textMuted,
            fontSize: tokens.typography.caption.fontSize,
            lineHeight: tokens.typography.caption.lineHeight,
            margin: `${tokens.spacing.xs} 0 0`,
          }}
        >
          {error ?? helperText}
        </p>
      ) : null}
    </div>
  );
}
