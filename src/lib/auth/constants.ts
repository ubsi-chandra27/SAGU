export const ROLE = {
  ADMIN: "ADMIN",
  GURU: "GURU",
  WALI_KELAS: "WALI_KELAS",
  SISWA: "SISWA",
  ORANG_TUA: "ORANG_TUA",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export const PROTECTED_ROUTES: Record<string, Role[]> = {
  "/dashboard/admin": [ROLE.ADMIN],
  "/dashboard/guru": [ROLE.GURU],
  "/api/v1/dashboard/admin": [ROLE.ADMIN],
  "/api/v1/dashboard/guru": [ROLE.GURU],
};
