import type { ReactNode } from "react";
import { Badge, Card } from "@/components/ui";
import { DashboardIcon } from "./dashboard-icons";
import styles from "./dashboard-widgets.module.css";

type PageHeaderProps = {
  badge: ReactNode;
  description: string;
  title: string;
};

type DashboardStateProps = {
  description: string;
  icon?: "book" | "calendar" | "clipboard" | "school";
  title: string;
};

type StatCardProps = {
  description?: string;
  label: string;
  value: string;
};

export function PageHeader({ badge, description, title }: PageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      {badge}
      <h1 className={styles.pageHeaderTitle}>{title}</h1>
      <p className={styles.pageHeaderDescription}>{description}</p>
    </header>
  );
}

export function DashboardEmptyState({
  description,
  icon = "clipboard",
  title,
}: DashboardStateProps) {
  return (
    <Card>
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>
          <DashboardIcon name={icon} />
        </span>
        <div>
          <h2 className={styles.stateTitle}>{title}</h2>
          <p className={styles.stateDescription}>{description}</p>
        </div>
      </div>
    </Card>
  );
}

export function DashboardErrorState({ description, title }: DashboardStateProps) {
  return (
    <Card>
      <div className={styles.errorState}>
        <span className={styles.errorIcon}>
          <DashboardIcon name="clipboard" />
        </span>
        <div>
          <h2 className={styles.stateTitle}>{title}</h2>
          <p className={styles.stateDescription}>{description}</p>
        </div>
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return <div aria-label="Memuat dashboard" className={styles.skeleton} />;
}

export function StatCard({ description, label, value }: StatCardProps) {
  return (
    <Card>
      <div className={styles.statCard}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
        {description ? <p className={styles.stateDescription}>{description}</p> : null}
      </div>
    </Card>
  );
}

export function RoleBadge({ children, tone }: { children: ReactNode; tone: "info" | "success" }) {
  return <Badge tone={tone}>{children}</Badge>;
}
