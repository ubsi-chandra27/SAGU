import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { tokens } from "@/styles/tokens";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  padded?: boolean;
};

export function Card({ children, footer, header, padded = true, style, ...props }: CardProps) {
  const dividerStyle: CSSProperties = {
    borderColor: tokens.color.divider,
    borderStyle: "solid",
    borderWidth: 0,
  };

  return (
    <section
      style={{
        background: tokens.color.surface,
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.md,
        boxShadow: tokens.shadow.card,
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {header ? (
        <div
          style={{
            ...dividerStyle,
            borderBottomWidth: "1px",
            padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
          }}
        >
          {header}
        </div>
      ) : null}
      <div style={{ padding: padded ? tokens.spacing.lg : 0 }}>{children}</div>
      {footer ? (
        <div
          style={{
            ...dividerStyle,
            borderTopWidth: "1px",
            padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}
