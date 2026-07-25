# Auth Current State Report — SAGU

**Tanggal:** 2026-07-25  
**Fase:** Auth Foundation (belum mulai)  
**Sumber:** Audit langsung workspace + `auth_recovery_report.md` + `pre_auth_final_audit.md`

---

## 1. File yang benar-benar sudah dibuat

### Prisma / Database
- `prisma/schema.prisma` — 673 baris, 20+ model, 7 enum, siap pakai.
- `prisma/seed.ts` — 739 baris, data dummy untuk 5 role, **masih pakai placeholder hash** dan ada bug `rombelId: ""` (tidak valid UUID).

### Dokumentasi & Plan
- `docs/AUTH_RBAC.md`
- `auth_implementation_plan.md`
- `pre_auth_final_audit.md`
- `auth_recovery_report.md`
- (Semua file dokumentasi 14-file di `docs/` sudah ada.)

### Konfigurasi Proyek
- `package.json` — dependensi auth (`bcryptjs`, `jsonwebtoken`, `zod`, `@prisma/client`) sudah dideklarasikan, **masih ada masalah dependency**.
- `tsconfig.json` — path alias `@/* → ./src/*` sudah dikonfigurasi.
- `next.config.mjs` — ada, **masih referensi `NEXTAUTH_URL`**.
- `.env.example` — ada, **masih pakai naming `NEXTAUTH_*`**.
- `next-env.d.ts` — types Next.js standar.

### Assets
- `src/app/globals.css` — file ada, **kosong (0 baris)**.

---

## 2. File yang masih kosong

- `src/app/globals.css`

---

## 3. File yang belum ada

### Auth Core
- `src/middleware.ts`
- `src/lib/prisma.ts`
- `src/lib/errors/http-error.ts`
- `src/lib/errors/index.ts`
- `src/lib/auth/jwt.ts`
- `src/lib/auth/password.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/constants.ts`

### Auth API Routes
- `src/app/api/v1/auth/login/route.ts`
- `src/app/api/v1/auth/logout/route.ts`
- `src/app/api/v1/auth/refresh/route.ts`
- `src/app/api/v1/auth/me/route.ts`

### Pages & Layout
- `src/app/login/page.tsx`
- `src/app/dashboard/admin/page.tsx`
- `src/app/dashboard/guru/page.tsx`

### Components
- `src/components/auth-guard.tsx`
- `src/components/dashboard/dashboard-layout.tsx`
- `src/components/dashboard/admin-sidebar.tsx`
- `src/components/dashboard/guru-sidebar.tsx`

### Types
- `src/types/next-auth.d.ts` (opsional)

### Infrastructure
- `node_modules/` — **belum diinstal**.

---

## 4. Kode yang sudah ditulis

### Database Schema (production-ready)
- `prisma/schema.prisma` — lengkap: User, Profile, Teacher, Student, Parent, Rombel, Class, Subject, AcademicYear, Semester, TeachingAssignment, CurriculumModule, LearningObjective, LearningObjectiveCP, Meeting, TeachingJournal, Attendance, FormativeAssessment, SummativeAssessment, GradingComponent, GradeDashboard, Raport, AuditLog, Setting, School.
- Relasi User untuk auth sudah ada (`password_hash`, `role`, `is_active`, `email`, `username`).

### Seed Data
- `prisma/seed.ts` — membuat sekolah, tahun ajaran, semester, kelas, 5 user (admin/guru/wali_kelas/siswa/orang_tua), profile, subject, teaching assignment, CP, LM, TP, grading component, meeting, attendance, formative assessment, summative assessment.

### Konfigurasi
- `tsconfig.json` — strict mode, path alias `@/*`.
- `package.json` — script `dev`, `build`, `prisma:*`.

---

## 5. Progress Auth Foundation dalam persen

**~0%**

Alasan:
- 0 dari 19 file implementasi auth yang direncanakan sudah dibuat.
- `src/` hanya berisi `globals.css` (kosong).
- Tidak ada middleware, API auth, halaman login, atau auth utilities.
- Prerequisite fixes (`package.json`, `.env.example`, `next.config.mjs`, `seed.ts`) juga belum dilakukan.

*Catatan: Database foundation dan dokumentasi sudah 100% siap, tapi lapisan aplikasi (kode) masih 0%.*

---

## 6. Apakah siap lanjut implementasi atau belum

**BELUM.**

Blocker sebelum mulai implementasi Auth Foundation:

| No | Blocker | File |
|---|---|---|
| 1 | Dependency `@types/bcrypt` salah (harus `@types/bcryptjs`) | `package.json` |
| 2 | `dotenv` duplikat di dependencies & devDependencies | `package.json` |
| 3 | Env var `NEXTAUTH_SECRET`/`NEXTAUTH_URL` misleading | `.env.example`, `next.config.mjs` |
| 4 | `globals.css` kosong | `src/app/globals.css` |
| 5 | Seed pakai placeholder hash + `rombelId: ""` invalid | `prisma/seed.ts` |
| 6 | `node_modules` belum diinstal | — |
| 7 | Tipe `SessionUser` untuk middlewareNext.js belum didefinisikan | belum ada |

Setelah 7 blocker di atas diperbaiki, implementasi bisa dilanjutkan sesuai urutan di `auth_implementation_plan.md` (Langkah 1 → Langkah 8).
