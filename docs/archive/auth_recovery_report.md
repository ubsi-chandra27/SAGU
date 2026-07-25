# Auth Recovery Report

**Tanggal:** 2026-07-25  
**Proyek:** SAGU (Sistem Administrasi Guru)  
**Fase Terakhir:** Auth Foundation (dijeda)  
**Tujuan:** Menentukan titik terakhir implementasi sebelum melanjutkan Auth Foundation

---

## 1. File yang Sudah Dibuat atau Diubah Selama Auth Foundation

### File di `src/` (Semua Belum Di-commit)
Berdasarkan inspeksi, seluruh struktur `src/` masih berupa direktori kosong. Belum ada file implementasi auth yang dibuat selama fase Auth Foundation.

**File yang ada:**
- `src/app/globals.css` — 0 bytes (kosong)

**Direktori yang ada tapi kosong:**
- `src/app/api/auth/[...nextauth]/`
- `src/app/api/v1/auth/`
- `src/app/api/v1/dashboard/`
- `src/app/api/v1/data/guru/`
- `src/app/api/v1/data/siswa/`
- `src/app/api/v1/pengaturan/`
- `src/app/dashboard/admin/`
- `src/app/dashboard/guru/`
- `src/app/dashboard/orang-tua/`
- `src/app/dashboard/wali-kelas/`
- `src/app/login/`
- `src/lib/`

### File Lain (Belum Di-commit)
- `.env.example`
- `git_commit_report.md`
- `next-env.d.ts`
- `next.config.mjs`
- `package.json`
- `tsconfig.json`

---

## 2. Struktur Folder `src/`

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/     ← direktori kosong
│   │   └── v1/
│   │       ├── auth/              ← direktori kosong
│   │       ├── dashboard/         ← direktori kosong
│   │       ├── data/
│   │       │   ├── guru/          ← direktori kosong
│   │       │   └── siswa/         ← direktori kosong
│   │       └── pengaturan/        ← direktori kosong
│   ├── dashboard/
│   │   ├── admin/                 ← direktori kosong
│   │   ├── guru/                  ← direktori kosong
│   │   ├── orang-tua/             ← direktori kosong
│   │   └── wali-kelas/            ← direktori kosong
│   ├── login/                     ← direktori kosong
│   └── globals.css                ← 0 bytes, kosong
└── lib/                           ← direktori kosong
```

**Catatan:** Seluruh struktur folder telah dibentuk mengikuti konvensi Next.js App Router, tetapi tidak ada satu pun file implementasi di dalamnya.

---

## 3. Status `package.json`

### Dependencies
| Package | Version | Relevansi Auth |
|---|---|---|
| `next` | ^14.2.0 | Framework |
| `react` | ^18.3.0 | UI |
| `react-dom` | ^18.3.0 | UI |
| `@prisma/client` | ^5.18.0 | ORM |
| `bcryptjs` | ^2.4.3 | Hash password |
| `jsonwebtoken` | ^9.0.2 | JWT token |
| `zod` | ^3.23.0 | Validasi |
| `dotenv` | ^16.4.0 | Env vars |

### DevDependencies
| Package | Version | Relevansi Auth |
|---|---|---|
| `typescript` | ^5.4.0 | Types |
| `prisma` | ^5.18.0 | ORM CLI |
| `@types/bcrypt` | ^5.0.2 | Tipe bcrypt |
| `@types/jsonwebtoken` | ^9.0.7 | Tipe JWT |
| `eslint` | ^8.57.0 | Linting |

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next eslint",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "prisma db seed",
  "prisma:studio": "prisma studio",
  "postinstall": "prisma generate"
}
```

### ⚠️ Masalah yang Ditemukan
1. **Tidak ada `next-auth`** — meskipun ada direktori `[...nextauth]` dan env var `NEXTAUTH_SECRET`/`NEXTAUTH_URL`, package `next-auth` tidak terinstal. Desain auth aktual menggunakan custom JWT (sesuai `AUTH_RBAC.md`).
2. **`@types/bcrypt` vs `bcryptjs`** — tipe yang terinstal adalah untuk `bcrypt`, bukan `bcryptjs`. Seharusnya `@types/bcryptjs` yang digunakan.
3. Nama env var `NEXTAUTH_*` misleading karena tidak menggunakan NextAuth.

---

## 4. Status `prisma/schema.prisma`

### Enums
- `Role`: ADMIN, GURU, WALI_KELAS, SISWA, ORANG_TUA
- `Gender`: LAKI_LAKI, PEREMPUAN
- `AttendanceStatus`: HADIR, IZIN, SAKIT, ALPHA, TERLAMBAT
- `AssessmentCategory`: FORMATIF, SUMATIF
- `AssessmentTypeDetail`: HARIAN, TUGAS, UTS, UAS, PORTOFOLIO
- `GradeLetter`: A, B, C, D, E
- `Predicate`: SANGAT_BAIK, BAIK, CUKUP, KURANG, TIDAK_MEMENUHI

### Model yang Ada (20+)
- **User** — inti auth (username, email, passwordHash, role, isActive)
- Profile — relasi 1:1 dengan User
- Teacher — relasi dengan User (NIP, specialization)
- Student — relasi dengan User (NIS, NISN, rombelId)
- Parent — relasi dengan User + Student
- Attendance — relasi dengan Student, Rombel, User
- AuditLog — pelacakan aksi user
- Rombel — relasi dengan User (homeroomTeacher)
- TeachingAssignment, Class, Subject, Semester, AcademicYear, dan model akademik lainnya

### Relasi User
```
User → Profile (1:1)
User → Teacher (1:1)
User → Student (1:1)
User → Parent[] (1:Many)
User → Attendance[] (1:Many)
User → AuditLog[] (1:Many)
User → Rombel[] as "HomeroomTeacher" (1:Many)
User → SummativeAssessment[] as "PublishedBy" (1:Many)
User → TeachingJournal[] (1:Many)
```

### ⚠️ Kesenjangan Auth
1. **Tidak ada model Account, Session, VerificationToken** — untuk NextAuth.
2. **Tidak ada model token/session kustom** — untuk JWT-based auth yang dijelaskan di `AUTH_RBAC.md`. Tidak ada model untuk menyimpan refresh token di server.
3. **Tidak ada field token, refreshToken, atau OAuth** di model User.

---

## 5. File Auth yang Sudah Ada

**Tidak ada file implementasi auth yang ada.**

Hanya direktori kosong berikut:
- `src/app/api/auth/[...nextauth]/` — kosong
- `src/app/api/v1/auth/` — kosong
- `src/app/login/` — kosong

Tidak ada file `auth.ts`, `auth.js`, atau file auth API lainnya.

---

## 6. File Middleware yang Sudah Ada

**Tidak ada file middleware yang ada.**

Berdasarkan `AUTH_RBAC.md`, seharusnya ada 3 lapisan middleware:
1. Auth middleware
2. Authorize middleware
3. Audit middleware

Tidak ada `middleware.ts` atau `middleware.js` di `src/` atau root proyek.

---

## 7. Halaman Login yang Sudah Ada

**Tidak ada halaman login yang diimplementasikan.**

Direktori `src/app/login/` ada tapi kosong. Tidak ada `page.tsx` atau komponen login apapun.

Menurut `ROUTES.md`, API route `POST /api/v1/auth/login` seharusnya ada, tetapi direktori `src/app/api/v1/auth/` juga kosong.

---

## 8. Error atau Pekerjaan yang Belum Selesai

### A. Ketidaksesuaian Struktur
| Masalah | Detail |
|---|---|
| NextAuth tanpa NextAuth | Direktori `[...nextauth]` ada tapi package tidak terinstal. Auth design menggunakan custom JWT. |
| Env var misleading | `NEXTAUTH_SECRET` dan `NEXTAUTH_URL` sebaiknya diganti nama sesuai custom JWT (misal `JWT_SECRET`, `APP_URL`). |
| Route mismatch | `[...nextauth]` di `src/app/api/auth/` sementara route aktual per `ROUTES.md` adalah di `/api/v1/auth/`. |

### B. Kesenjangan Implementasi
| Pekerjaan | Status |
|---|---|
| API route login (`POST /api/v1/auth/login`) | ❌ Belum dibuat |
| API route register/signup | ❌ Belum dibuat |
| API route refresh token | ❌ Belum dibuat |
| API route logout | ❌ Belum dibuat |
| Halaman login UI | ❌ Belum dibuat |
| Auth middleware | ❌ Belum dibuat |
| RBAC authorization middleware | ❌ Belum dibuat |
| Audit middleware | ❌ Belum dibuat |
| Auth utilities (`lib/auth.ts`, dll) | ❌ Belum dibuat |
| Token/session model di Prisma | ❌ Belum dibuat |
| `error.ts` dan `loading.ts` di route groups | ❌ Belum dibuat |
| Seed data untuk user admin default | ❌ Belum dibuat (seed menggunakan placeholder hash) |

### C. Masalah Teknis
| Masalah | Detail |
|---|---|
| `@types/bcrypt` vs `bcryptjs` | Installed types for `bcrypt` but dependency is `bcryptjs` |
| Placeholder hash di seed | `prisma/seed.ts` menggunakan placeholder hash yang tidak valid |
| `globals.css` kosong | File 0 bytes, belum diisi styling dasar |
| Stale file | `prisma/test_write.txt` ada tapi seharusnya di-`.gitignore` |

### D. Status TODO
Semua item Tahap 3 (Auth Foundation) di `TODO.md` masih **belum dicentang**:
- [ ] Implementasi autentikasi
- [ ] Implementasi RBAC
- [ ] Implementasi auth middleware
- [ ] Implementasi layout dasar dashboard

---

## 9. Titik Terakhir Implementasi

**Titik terakhir sebelum fase Auth Foundation dihentikan:**

1. **Struktur direktori `src/` sudah dibentuk** mengikuti Next.js App Router convention.
2. **Prisma schema sudah finalized** untuk domain akademik (20+ model, enums, relasi).
3. **`package.json` sudah diisi** dengan dependencies inti (Next.js, Prisma, bcryptjs, jsonwebtoken, zod).
4. **`AUTH_RBAC.md` dan `ROUTES.md` sudah didefinisikan** sebagai specification untuk auth.
5. **Pre-auth audit sudah lulus** — proyek dinyatakan "SIAP MASUK AUTH FOUNDATION".

**Yang BELUM DIMULAI:**
- Tidak ada satu pun kode implementasi auth yang ditulis.
- Tidak ada API route auth.
- Tidak ada UI login.
- Tidak ada middleware.
- Tidak ada auth utilities.

---

## 10. Rekomendasi Lanjutan

1. **Bersihkan ketidaksesuaian naming**: Ganti `NEXTAUTH_SECRET`/`NEXTAUTH_URL` menjadi `JWT_SECRET`/`APP_URL` atau sesuai convention yang dipilih.
2. **Perbaiki `@types/bcrypt`**: Ganti menjadi `@types/bcryptjs` agar sesuai dengan dependency `bcryptjs`.
3. **Tambahkan model auth di Prisma**: Buat model untuk refresh token, session, atau verifikasi token sesuai desain JWT.
4. **Implementasi berurutan**:
   - Auth utilities (`lib/auth.ts`)
   - API routes auth (`/api/v1/auth/`)
   - Middleware auth + authorize + audit
   - Halaman login
   - Layout dashboard dengan proteksi route
5. **Perbaiki seed data**: Gunakan hash password yang valid untuk user admin default.

---

*Laporan ini dibuat untuk menentukan titik pengambilan lanjut implementasi Auth Foundation.*
