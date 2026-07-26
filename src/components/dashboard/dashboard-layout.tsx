"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { tokens, withAlpha } from "@/styles/tokens";
import { DashboardIcon } from "./dashboard-icons";
import {
  type DashboardRole,
  dashboardNavigation,
  getDashboardPageMeta,
  isNavItemActive,
} from "./dashboard-navigation";
import styles from "./dashboard-layout.module.css";

type DashboardLayoutProps = {
  children: ReactNode;
  role: DashboardRole | string;
};

type SessionUser = {
  email?: string;
  fullName?: string;
  role?: string;
  username?: string;
};

type ActivePeriod = {
  academicYear?: { name: string } | null;
  semester?: { name: string } | null;
};

const roleLabels: Record<DashboardRole, string> = {
  admin: "Admin",
  guru: "Guru",
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const dashboardRole: DashboardRole = role === "guru" ? "guru" : "admin";
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [academicStatus, setAcademicStatus] = useState("Periode belum diatur");

  const pageMeta = useMemo(
    () => getDashboardPageMeta(pathname, dashboardRole),
    [dashboardRole, pathname],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem("sagu-dashboard-sidebar-collapsed");
    setCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sagu-dashboard-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    let ignore = false;

    async function loadSessionUser() {
      try {
        const response = await fetch("/api/v1/auth/me", { cache: "no-store" });
        if (!response.ok) return;

        const payload = await response.json();
        if (!ignore) {
          setSessionUser(payload.data?.user || payload.user || payload.data || null);
        }
      } catch {
        if (!ignore) setSessionUser(null);
      }
    }

    loadSessionUser();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadActivePeriod() {
      try {
        const response = await fetch("/api/v1/tahun-ajaran/active", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const payload = await response.json();
        const period = payload.data as ActivePeriod;

        if (!ignore) {
          if (period?.academicYear?.name && period.semester?.name) {
            setAcademicStatus(`${period.academicYear.name} - ${period.semester.name}`);
          } else if (period?.academicYear?.name) {
            setAcademicStatus(`${period.academicYear.name} - semester belum diatur`);
          } else {
            setAcademicStatus("Periode belum diatur");
          }
        }
      } catch {
        if (!ignore) setAcademicStatus("Periode belum diatur");
      }
    }

    loadActivePeriod();
    window.addEventListener("sagu-active-period-changed", loadActivePeriod);

    return () => {
      ignore = true;
      window.removeEventListener("sagu-active-period-changed", loadActivePeriod);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setUserMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  const layoutVars = {
    "--dashboard-background": tokens.color.background,
    "--dashboard-surface": tokens.color.surface,
    "--dashboard-surface-muted": tokens.color.surfaceMuted,
    "--dashboard-border": tokens.color.border,
    "--dashboard-divider": tokens.color.divider,
    "--dashboard-primary": tokens.color.primary,
    "--dashboard-primary-soft": tokens.color.primarySoft,
    "--dashboard-danger": tokens.color.danger,
    "--dashboard-danger-soft": withAlpha(tokens.color.danger, 0.1),
    "--dashboard-text-primary": tokens.color.textPrimary,
    "--dashboard-text-secondary": tokens.color.textSecondary,
    "--dashboard-text-muted": tokens.color.textMuted,
    "--dashboard-shadow": tokens.shadow.card,
  } as CSSProperties;

  const displayName =
    sessionUser?.fullName || sessionUser?.username || sessionUser?.email || "Pengguna SAGU";
  const displayRole = roleLabels[dashboardRole];

  return (
    <div className={styles.shell} style={layoutVars}>
      <aside
        aria-label="Navigasi dashboard"
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}
      >
        <SidebarContent
          collapsed={collapsed}
          displayName={displayName}
          displayRole={displayRole}
          onCollapseToggle={() => setCollapsed((value) => !value)}
          onLogout={handleLogout}
          pathname={pathname}
          role={dashboardRole}
        />
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <button
            aria-label="Buka menu navigasi"
            className={styles.mobileMenuButton}
            onClick={() => setDrawerOpen(true)}
            type="button"
          >
            <DashboardIcon name="menu" />
          </button>

          <div className={styles.topbarContext}>
            <Breadcrumb breadcrumbs={pageMeta.breadcrumbs} />
            <h1 className={styles.topbarTitle}>{pageMeta.title}</h1>
          </div>

          <div className={styles.topbarActions}>
            <span className={styles.academicStatus}>
              <DashboardIcon name="calendar" />
              Periode Aktif: <strong>{academicStatus}</strong>
            </span>
            <div className={styles.userMenu}>
              <button
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                className={styles.userButton}
                onClick={() => setUserMenuOpen((value) => !value)}
                type="button"
              >
                <span className={styles.userAvatar}>{displayName.slice(0, 1).toUpperCase()}</span>
                <span className={styles.userText}>
                  <strong>{displayName}</strong>
                  <span>{displayRole}</span>
                </span>
              </button>

              {userMenuOpen ? (
                <div className={styles.userDropdown} role="menu">
                  <div className={styles.userDropdownIdentity}>
                    <strong>{displayName}</strong>
                    <span>{displayRole}</span>
                  </div>
                  <button className={styles.userDropdownItem} onClick={handleLogout} type="button">
                    <DashboardIcon name="logout" />
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
        <footer className={styles.dashboardFooter}>
          SAGU - Sistem Administrasi Guru
        </footer>
      </div>

      {drawerOpen ? (
        <>
          <button
            aria-label="Tutup menu navigasi"
            className={styles.mobileBackdrop}
            onClick={() => setDrawerOpen(false)}
            type="button"
          />
          <aside
            aria-label="Navigasi dashboard mobile"
            className={styles.mobileDrawer}
            data-dashboard-drawer="true"
          >
            <div className={styles.drawerHeader}>
              <Brand collapsed={false} />
              <button
                aria-label="Tutup drawer navigasi"
                className={styles.drawerClose}
                onClick={() => setDrawerOpen(false)}
                type="button"
              >
                <DashboardIcon name="close" />
              </button>
            </div>
            <NavigationLinks
              collapsed={false}
              onNavigate={() => setDrawerOpen(false)}
              pathname={pathname}
              role={dashboardRole}
            />
            <SidebarFooter
              collapsed={false}
              displayName={displayName}
              displayRole={displayRole}
              onLogout={handleLogout}
            />
          </aside>
        </>
      ) : null}
    </div>
  );
}

function SidebarContent({
  collapsed,
  displayName,
  displayRole,
  onCollapseToggle,
  onLogout,
  pathname,
  role,
}: {
  collapsed: boolean;
  displayName: string;
  displayRole: string;
  onCollapseToggle: () => void;
  onLogout: () => void;
  pathname: string;
  role: DashboardRole;
}) {
  return (
    <>
      <div className={styles.sidebarHeader}>
        <Brand collapsed={collapsed} />
        <button
          aria-label={collapsed ? "Perbesar sidebar" : "Perkecil sidebar"}
          className={styles.collapseButton}
          onClick={onCollapseToggle}
          title={collapsed ? "Perbesar sidebar" : "Perkecil sidebar"}
          type="button"
        >
          <DashboardIcon name={collapsed ? "chevronRight" : "chevronLeft"} />
        </button>
      </div>

      <NavigationLinks collapsed={collapsed} pathname={pathname} role={role} />
      <SidebarFooter
        collapsed={collapsed}
        displayName={displayName}
        displayRole={displayRole}
        onLogout={onLogout}
      />
    </>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={styles.brand}>
      <span className={styles.brandMark}>S</span>
      {!collapsed ? (
        <span className={styles.brandText}>
          <strong>SAGU</strong>
          <span>Sistem Administrasi Guru</span>
        </span>
      ) : null}
    </div>
  );
}

function NavigationLinks({
  collapsed,
  onNavigate,
  pathname,
  role,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  pathname: string;
  role: DashboardRole;
}) {
  const groups = dashboardNavigation[role];

  return (
    <nav className={styles.nav}>
      {groups.map((group) => (
        <div className={styles.navGroup} key={`${role}-${group.label}`}>
          {!collapsed ? <p className={styles.navGroupLabel}>{group.label}</p> : null}
          {group.items.map((item) => {
            const active = isNavItemActive(pathname, item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                href={item.href}
                key={`${role}-${item.href}`}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
              >
                <DashboardIcon className={styles.navIcon} name={item.icon} />
                {!collapsed ? <span className={styles.navText}>{item.label}</span> : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({
  collapsed,
  displayName,
  displayRole,
  onLogout,
}: {
  collapsed: boolean;
  displayName: string;
  displayRole: string;
  onLogout: () => void;
}) {
  return (
    <div className={styles.sidebarFooter}>
      <div className={styles.sidebarUser} title={collapsed ? `${displayName} - ${displayRole}` : undefined}>
        <span className={styles.sidebarAvatar}>{displayName.slice(0, 1).toUpperCase()}</span>
        {!collapsed ? (
          <span className={styles.sidebarUserText}>
            <strong>{displayName}</strong>
            <span>{displayRole}</span>
          </span>
        ) : null}
      </div>
      <Button
        className={styles.logoutButton}
        onClick={onLogout}
        size="sm"
        title={collapsed ? "Keluar" : undefined}
        variant="danger"
      >
        <DashboardIcon name="logout" />
        {!collapsed ? <span>Keluar</span> : null}
      </Button>
    </div>
  );
}

function Breadcrumb({ breadcrumbs }: { breadcrumbs: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map((item, index) => {
          const last = index === breadcrumbs.length - 1;

          return (
            <li className={styles.breadcrumbItem} key={`${item.label}-${index}`}>
              {item.href && !last ? (
                <Link className={styles.breadcrumbLink} href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.breadcrumbCurrent}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
