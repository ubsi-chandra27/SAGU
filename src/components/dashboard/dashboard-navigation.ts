export type DashboardRole = "admin" | "guru";

export type DashboardNavItem = {
  href: string;
  icon: "branding" | "calendar" | "dashboard";
  label: string;
};

export type DashboardNavGroup = {
  items: DashboardNavItem[];
  label: string;
};

export type DashboardBreadcrumbItem = {
  href?: string;
  label: string;
};

export type DashboardPageMeta = {
  breadcrumbs: DashboardBreadcrumbItem[];
  title: string;
};

export const dashboardNavigation: Record<DashboardRole, DashboardNavGroup[]> = {
  admin: [
    {
      label: "Utama",
      items: [{ label: "Dashboard", href: "/dashboard/admin", icon: "dashboard" }],
    },
    {
      label: "Data Master",
      items: [
        {
          label: "Tahun Ajaran",
          href: "/dashboard/admin/data-master/tahun-ajaran",
          icon: "calendar",
        },
      ],
    },
    {
      label: "Pengaturan",
      items: [
        {
          label: "Branding Login",
          href: "/dashboard/admin/pengaturan/branding-login",
          icon: "branding",
        },
      ],
    },
  ],
  guru: [
    {
      label: "Utama",
      items: [{ label: "Dashboard Guru", href: "/dashboard/guru", icon: "dashboard" }],
    },
  ],
};

const dashboardPageMeta: Record<string, DashboardPageMeta> = {
  "/dashboard/admin": {
    title: "Dashboard Admin",
    breadcrumbs: [{ label: "Dashboard Admin" }],
  },
  "/dashboard/admin/pengaturan/branding-login": {
    title: "Branding Login",
    breadcrumbs: [
      { label: "Dashboard Admin", href: "/dashboard/admin" },
      { label: "Pengaturan" },
      { label: "Branding Login" },
    ],
  },
  "/dashboard/admin/data-master/tahun-ajaran": {
    title: "Tahun Ajaran dan Semester",
    breadcrumbs: [
      { label: "Dashboard Admin", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Tahun Ajaran" },
    ],
  },
  "/dashboard/guru": {
    title: "Dashboard Guru",
    breadcrumbs: [{ label: "Dashboard Guru" }],
  },
};

export function getDashboardPageMeta(pathname: string, role: DashboardRole): DashboardPageMeta {
  return (
    dashboardPageMeta[pathname] || {
      title: role === "admin" ? "Dashboard Admin" : "Dashboard Guru",
      breadcrumbs: [{ label: role === "admin" ? "Dashboard Admin" : "Dashboard Guru" }],
    }
  );
}

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard/admin" || href === "/dashboard/guru") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
