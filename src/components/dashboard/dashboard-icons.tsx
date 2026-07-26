import type { SVGProps } from "react";

type DashboardIconName =
  | "book"
  | "branding"
  | "calendar"
  | "chevronLeft"
  | "chevronRight"
  | "clipboard"
  | "close"
  | "dashboard"
  | "logout"
  | "menu"
  | "school"
  | "user";

type DashboardIconProps = SVGProps<SVGSVGElement> & {
  name: DashboardIconName;
};

const paths: Record<DashboardIconName, JSX.Element> = {
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 1 4 16.5Z" />
      <path d="M6.5 17H20" />
      <path d="M8 7h7" />
    </>
  ),
  branding: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m8 14 2.5-3 3 3.5 2-2.5L20 17" />
      <circle cx="8.5" cy="9" r="1.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </>
  ),
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4.5A2 2 0 0 1 11 3h2a2 2 0 0 1 2 1.5V6H9Z" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  dashboard: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </>
  ),
  logout: (
    <>
      <path d="M10 7V5a2 2 0 0 1 2-2h6v18h-6a2 2 0 0 1-2-2v-2" />
      <path d="M15 12H3" />
      <path d="m6 8-4 4 4 4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  school: (
    <>
      <path d="m3 9 9-5 9 5-9 5Z" />
      <path d="M7 12v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" />
      <path d="M21 9v6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

export function DashboardIcon({ name, ...props }: DashboardIconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
