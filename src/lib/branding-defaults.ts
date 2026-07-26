export const DEFAULT_LOGIN_BRANDING = {
  schoolName: "SAGU",
  logoUrl: "/branding/default-sagu-logo.svg",
  loginBackgroundUrl: "/branding/default-login-background.svg",
  loginTitle: "Selamat Datang",
  loginSubtitle: "Masuk untuk mengakses dashboard Admin atau Guru.",
  loginBackgroundPosition: "center",
  loginOverlayOpacity: 0.46,
} as const;

export const LOGIN_BACKGROUND_POSITIONS = [
  "left",
  "center",
  "right",
] as const;

export type LoginBackgroundPosition =
  (typeof LOGIN_BACKGROUND_POSITIONS)[number];

export type LoginBranding = {
  schoolName: string;
  logoUrl: string;
  loginBackgroundUrl: string;
  loginTitle: string;
  loginSubtitle: string;
  loginBackgroundPosition: LoginBackgroundPosition;
  loginOverlayOpacity: number;
};
