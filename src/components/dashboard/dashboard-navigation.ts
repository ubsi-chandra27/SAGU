export type DashboardRole = "admin" | "guru";

export type DashboardNavItem = {
  href: string;
  icon:
    | "book"
    | "branding"
    | "calendar"
    | "clipboard"
    | "dashboard"
    | "print"
    | "school"
    | "user";
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
          label: "Mata Pelajaran",
          href: "/dashboard/admin/data-master/mata-pelajaran",
          icon: "book",
        },
        {
          label: "Guru",
          href: "/dashboard/admin/data-master/guru",
          icon: "user",
        },
        {
          label: "Siswa",
          href: "/dashboard/admin/data-master/siswa",
          icon: "school",
        },
        {
          label: "Kelas",
          href: "/dashboard/admin/data-master/kelas",
          icon: "clipboard",
        },
        {
          label: "Rombel",
          href: "/dashboard/admin/data-master/rombel",
          icon: "school",
        },
        {
          label: "Tahun Ajaran & Semester",
          href: "/dashboard/admin/data-master/tahun-ajaran",
          icon: "calendar",
        },
        {
          label: "Penugasan Mengajar",
          href: "/dashboard/admin/data-master/penugasan-mengajar",
          icon: "clipboard",
        },
      ],
    },
    {
      label: "Absensi",
      items: [
        {
          label: "Rekap Absensi",
          href: "/dashboard/admin/rekap-absensi",
          icon: "print",
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
    {
      label: "Mengajar",
      items: [
        {
          label: "Pertemuan",
          href: "/dashboard/guru/pertemuan",
          icon: "calendar",
        },
      ],
    },
  ],
};

const dashboardPageMeta: Record<string, DashboardPageMeta> = {
  "/dashboard/admin": {
    title: "Dashboard Admin",
    breadcrumbs: [{ label: "Dashboard" }],
  },
  "/dashboard/admin/pengaturan/branding-login": {
    title: "Branding Login",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Pengaturan" },
      { label: "Branding Login" },
    ],
  },
  "/dashboard/admin/data-master/tahun-ajaran": {
    title: "Tahun Ajaran dan Semester",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Tahun Ajaran & Semester" },
    ],
  },
  "/dashboard/admin/data-master/mata-pelajaran": {
    title: "Mata Pelajaran",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Mata Pelajaran" },
    ],
  },
  "/dashboard/admin/data-master/guru": {
    title: "Data Guru",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Guru" },
    ],
  },
  "/dashboard/admin/data-master/siswa": {
    title: "Data Siswa",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Siswa" },
    ],
  },
  "/dashboard/admin/data-master/kelas": {
    title: "Kelas",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Kelas" },
    ],
  },
  "/dashboard/admin/data-master/rombel": {
    title: "Rombel",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Rombel" },
    ],
  },
  "/dashboard/admin/data-master/penugasan-mengajar": {
    title: "Penugasan Mengajar",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Data Master" },
      { label: "Penugasan Mengajar" },
    ],
  },
  "/dashboard/admin/rekap-absensi": {
    title: "Rekap Absensi",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Absensi" },
      { label: "Rekap Absensi" },
    ],
  },
  "/dashboard/guru": {
    title: "Dashboard Guru",
    breadcrumbs: [{ label: "Dashboard Guru" }],
  },
  "/dashboard/guru/pertemuan": {
    title: "Pertemuan",
    breadcrumbs: [
      { label: "Dashboard Guru", href: "/dashboard/guru" },
      { label: "Pertemuan" },
    ],
  },
};

export function getDashboardPageMeta(pathname: string, role: DashboardRole): DashboardPageMeta {
  if (pathname.startsWith("/dashboard/guru/pertemuan/")) {
    return {
      title: pathname.includes("/cetak") ? "Cetak Absensi" : "Absensi Cepat",
      breadcrumbs: [
        { label: "Dashboard Guru", href: "/dashboard/guru" },
        { label: "Pertemuan", href: "/dashboard/guru/pertemuan" },
        { label: pathname.includes("/cetak") ? "Cetak Absensi" : "Absensi" },
      ],
    };
  }

  if (pathname.startsWith("/dashboard/admin/rekap-absensi/")) {
    return {
      title: pathname.includes("/cetak") ? "Cetak Rekap Absensi" : "Detail Rekap Absensi",
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Rekap Absensi", href: "/dashboard/admin/rekap-absensi" },
        { label: pathname.includes("/cetak") ? "Cetak" : "Detail" },
      ],
    };
  }

  return (
    dashboardPageMeta[pathname] || {
      title: role === "admin" ? "Dashboard Admin" : "Dashboard Guru",
      breadcrumbs: [{ label: role === "admin" ? "Dashboard" : "Dashboard Guru" }],
    }
  );
}

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard/admin" || href === "/dashboard/guru") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
