> Status: rencana ini sudah dieksekusi (lihat commit auth foundation). Dipertahankan di root sebagai referensi aktif, bukan arsip.

# Auth Foundation Implementation Plan

**Tanggal:** 2026-07-25  
**Proyek:** SAGU (Sistem Administrasi Guru)  
**Fase:** Tahap 3 - Implementasi Auth Foundation (Tahap 2 dari 5)  
**Fokus:** Login Page, JWT Authentication, Auth Middleware, RBAC Middleware, Session User, Dashboard Placeholder (Admin dan Guru saja)

---

## 1. Tujuan

Membangun fondasi autentikasi dan otorisasi SAGU menggunakan JWT + RBAC, dengan halaman login, API auth, middleware proteksi route, dan placeholder dashboard terbuka untuk Admin dan Guru.

Fase ini **tidak** mencakup:
- Data Master (Guru, Siswa, Orang Tua, Rombel, Tahun Ajaran, Semester, Mata Pelajaran)
- Absensi
- Penilaian
- Dashboard Wali Kelas, Siswa, Orang Tua

---

## 2. Dependensi yang Dibutuhkan

### 2.1 Paket yang Sudah Ada (tidak perlu instalasi baru)

| Package | Versi | Kegunaan |
|---|---|---|
| `next` | ^14.2.0 | Framework App Router |
| `react` | ^18.3.0 | UI |
| `@prisma/client` | ^5.18.0 | ORM |
| `bcryptjs` | ^2.4.3 | Hash password |
| `jsonwebtoken` | ^9.0.2 | JWT access token |
| `zod` | ^3.23.0 | Validasi input |
| `dotenv` | ^16.4.0 | Env vars |

### 2.2 Perbaikan Dependensi Wajib BLM Implementasi

| Masalah | Solusi |
|---|---|
| `@types/bcrypt` vs `bcryptjs` | Ganti `@types/bcrypt` menjadi `@types/bcryptjs` |
| `dotenv` ada di dependencies **dan** devDependencies | Hapus dari salah satu (sebaiknya hapus dari devDependencies) |
| Env var `NEXTAUTH_SECRET`/`NEXTAUTH_URL` misleading (tanpa NextAuth) | Ganti menjadi `JWT_SECRET`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `APP_URL` |
| `next.config.mjs` masih referensi `NEXTAUTH_URL` | Perbarui ke `APP_URL` |

### 2.3 Env Variables Baru

```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<min-32-chars-random>
JWT_REFRESH_SECRET=<min-32-chars-random>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 3. Struktur File yang Akan Dibuat

```
prisma/
  schema.prisma                          ← TIDAK DIUBAH (No schema changes)
  seed.ts                                ← PERBAIKI: ganti password placeholder

src/
  lib/
    prisma.ts                            ← PrismaClient singleton
    errors/
      http-error.ts                      ← Class error HTTP terstruktur
      index.ts                           ← Export helper errors
    auth/
      jwt.ts                             ← Utility generate/verify JWT access & refresh
      password.ts                        ← Utility hash & compare password (bcryptjs)
      session.ts                         ← Type definitions untuk SessionUser
      constants.ts                       ← Role enum, permission constants

  middleware.ts                          ← Next.js Middleware (auth + RBAC)

  app/
    login/
      page.tsx                           ← Halaman Login UI

    api/
      v1/
        auth/
          login/route.ts                 ← POST /api/v1/auth/login
          logout/route.ts                ← POST /api/v1/auth/logout
          refresh/route.ts               ← POST /api/v1/auth/refresh
          me/route.ts                    ← GET  /api/v1/auth/me

        dashboard/
          admin/page.tsx                 ← Placeholder dashboard Admin
          guru/page.tsx                  ← Placeholder dashboard Guru

  components/
    auth-guard.tsx                       ← Client wrapper proteksi route dashboard
    dashboard/
      admin-sidebar.tsx                  ← Sidebar Admin
      guru-sidebar.tsx                   ← Sidebar Guru
      dashboard-layout.tsx               ← Layout wrapper dashboard dengan sidebar + header

  types/
    next-auth.d.ts                       ← Dummy type agar Tidak ada konflik NextAuth types
                                        ← BISA DILEWATI jika tidak ada konflik nyata
```

### Catatan Penting:
- **Tidak ada perubahan Prisma schema** — fase ini hanya memakai model yang sudah ada (`users`, `profiles`, dll).
- `src/app/api/auth/[...nextauth]/` — tidak digunakan, bisa diabaikan atau dihapus sesuai kebutuhan.
- File error handler dan prisma client tidak termasuk scope kita, tapi itu merupakan file yang WAJIB ada agar implementasi auth berjalan. Jadi perlu diperhitungkan.

---

## 4. Urutan Implementasi

### Langkah 1: Persiapan Dependensi (15 menit)

1. Perbaiki `@types/bcrypt` → `@types/bcryptjs`
2. Bersihkan duplikasi `dotenv` di `package.json`
3. Perbarui `.env.example` dengan env var JWT baru
4. Perbarui `next.config.mjs` untuk menghapus referensi `NEXTAUTH_URL`

### Langkah 2: Core Auth Libraries (45 menit)

1. **`src/lib/prisma.ts`** — PrismaClient singleton
2. **`src/lib/errors/http-error.ts`** — Error class terstruktur
3. **`src/lib/auth/password.ts`** — `hashPassword()`, `comparePassword()`
4. **`src/lib/auth/jwt.ts`** — `generateAccessToken()`, `generateRefreshToken()`, `verifyAccessToken()`, `verifyRefreshToken()`
5. **`src/lib/auth/session.ts`** — Tipe `SessionUser` (id, username, email, role, fullName)
6. **`src/lib/auth/constants.ts`** — Enum Role, permission map

### Langkah 3: Auth API Routes (30 menit)

1. **`POST /api/v1/auth/login`** — Validasi input (Zod), cari user, verify password, cek `isActive`, generate JWT pair, return tokens + user info
2. **`POST /api/v1/auth/logout`** — Accept refresh token, return 204 (MVP: token stateless, tidak ada server-side invalidation)
3. **`POST /api/v1/auth/refresh`** — Verify refresh token, generate new access + refresh token
4. **`GET /api/v1/auth/me`** — Return current user info dari token

**Response format (seragam):**
```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

**Error format:**
```json
{
  "success": false,
  "message": "Error message",
  "error": { "code": 401, "details": "..." }
}
```

### Langkah 4: Auth Middleware (30 menit)

**`src/middleware.ts`** (Next.js Middleware)

1. **Auth Middleware** — Verifikasi `Authorization: Bearer <token>` atau cookie `access_token`. Lewati untuk route publik (`/login`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/forgot-password`, `/api/v1/auth/reset-password`).
2. **RBAC Middleware** — Cek role pengguna terhadap route yang diizinkan. Map route → allowed roles. Return 403 jika tidak sesuai.
3. **Session injection** — Inject `token` dan `user` ke `request` headers agar API route bisa membaca.

**Config route protection:**
```typescript
const protectedRoutes: Record<string, Role[]> = {
  '/api/v1/dashboard/admin': ['ADMIN'],
  '/api/v1/dashboard/guru': ['GURU'],
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/guru': ['GURU'],
}
```

### Langkah 5: Login Page (45 menit)

**`src/app/login/page.tsx`**

- Form username + password (Zod validation)
- Submit ke `POST /api/v1/auth/login`
- Simpan `access_token` di httpOnly cookie + `refresh_token` di httpOnly cookie
- Redirect ke `/dashboard/admin` (ADMIN) atau `/dashboard/guru` (GURU)
- Pesan error untuk kredensial salah / akun nonaktif

**Security notes:**
- Jangan simpan token di `localStorage` (rentan XSS)
- Gunakan httpOnly cookie untuk access token
- SameSite: Strict untuk cookie
- CSRF protection via SameSite + double submit cookie pattern (opsional MVP)

### Langkah 6: Dashboard Placeholder (30 menit)

1. **`src/app/dashboard/admin/page.tsx`** — Placeholder "Dashboard Admin", statistik dummy, sidebar Admin
2. **`src/app/dashboard/guru/page.tsx`** — Placeholder "Dashboard Guru", statistik dummy, sidebar Guru
3. **`src/components/dashboard/dashboard-layout.tsx`** — Layout wrapper dengan sidebar + header profil
4. **`src/components/auth-guard.tsx`** — Client guard untuk redirect ke `/login` jika belum auth

### Langkah 7: Seed Data Perbaikan (15 menit)

**`prisma/seed.ts`**

1. Ganti password placeholder dengan hash valid dari bcryptjs
2. Verifikasi seed berjalan tanpa error
3. Catat password default untuk setiap role di `.env.example`

### Langkah 8: Verifikasi & Testing (30 menit)

1. Test login sukses → redirect ke dashboard
2. Test login gagal → pesan error
3. Test akses route tanpa token → 401
4. Test akses route dengan role salah → 403
5. Test middleware chain: Auth → RBAC → API
6. Test refresh token flow
7. Test logout → token terhapus dari cookie

---

## 5. Acceptance Criteria

### Login Page

- [ ] Halaman `/login` dapat diakses tanpa autentikasi
- [ ] Validasi form berjalan (username & password wajib diisi)
- [ ] Login sukses dengan kredensial valid → redirect ke dashboard sesuai role
- [ ] Login gagal → pesan error "Username atau password salah" (tanpa bocor informasi mana yang salah)
- [ ] Akun dengan `is_active = false` → pesan error "Akun dinonaktifkan"
- [ ] Token disimpan di httpOnly cookie (bukan localStorage)
- [ ] Setelah login, `/api/v1/auth/me` mengembalikan data user

### JWT Authentication

- [ ] Access token berhasil di-generate saat login
- [ ] Access token berisi: `sub` (userId), `role`, `username`, `email`
- [ ] Refresh token berhasil di-generate dan di-rotate
- [ ] Token expired → API mengembalikan 401
- [ ] `POST /api/v1/auth/refresh` mengembalikan access token baru
- [ ] `POST /api/v1/auth/logout` menghapus cookie

### Auth Middleware

- [ ] Route publik (`/login`, `/api/v1/auth/login`, dll.) bisa diakses tanpa token
- [ ] Route dilindungi tanpa token → 401
- [ ] Route dilindungi dengan token invalid/expired → 401
- [ ] Route dengan role yang tidak sesuai → 403

### RBAC Middleware

- [ ] ADMIN bisa akses `/dashboard/admin` dan `/api/v1/dashboard/admin`
- [ ] GURU bisa akses `/dashboard/guru` dan `/api/v1/dashboard/guru`
- [ ] GURU yang mencoba akses `/dashboard/admin` → 403
- [ ] ADMIN yang mencoba akses `/dashboard/guru` → 403 (opsional: bisa diizinkan)
- [ ] Request tanpa role di middleware → 403

### Session User

- [ ] `GET /api/v1/auth/me` mengembalikan: `id`, `username`, `email`, `role`, `fullName`
- [ ] `SessionUser` type konsisten di semua file
- [ ] Token yang di-verify mengembalikan data user yang valid

### Dashboard Placeholder

- [ ] `/dashboard/admin` hanya bisa diakses oleh ADMIN
- [ ] `/dashboard/guru` hanya bisa diakses oleh GURU
- [ ] Setelah logout, redirect ke `/login`
- [ ] Sidebar menampilkan role user yang sesuai
- [ ] Header menampilkan nama lengkap user

### Secara Umum

- [ ] Semua response API menggunakan format JSON standar (`success`, `message`, `data`, `error`)
- [ ] Tidak ada perubahan Prisma schema
- [ ] Kode ditulis dengan tipe TypeScript yang ketat
- [ ] Password di-hash dengan bcrypt (salt rounds minimum 10)
- [ ] Env var `JWT_SECRET` tidak pernah di-log atau di-return ke client

---

## 6. Risiko Teknis

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Cookie httpOnly tidak bisa dibaca client JS** | Aplikasi tidak bisa cek status auth di client | Gunakan `auth-guard.tsx` dengan API call ke `/api/v1/auth/me` saat mount |
| **JWT stateless → tidak bisa invalidate token sebelum expiry** | Logout tidak sepenuhnya aman | Untuk MVP, cukup hapus cookie client. Rollback ke server-side session jika diperlukan nanti. |
| **Middleware Next.js 14 edge runtime** | Tidak semua API Node.js tersedia di edge | Gunakan `config.matcher` dengan `runtime: 'nodejs'` jika perlu, atau batasi middleware ke verifikasi header saja |
| **Akses CORS keff when dijalankan dari domain berbeda** | API gagal diakses dari frontend | Konfigurasi CORS dengan `origin` sesuai `APP_URL`, bukan `*` |
| **Seed password placeholder tidak valid** | Admin tidak bisa login setelah reset DB | Ganti dengan hash valid dan catat password default |
| **TypeScript strict mode + Next.js types** | Type conflict pada `Request` object di middleware | Tambahkan type declaration lokal untuk menambahkan field custom ke `NextRequest` |
| **Refresh token rotation complexity** | Jika tidak diimplementasi dengan benar, token bisa direbut | MVP: implementasi simple rotate. Juga pertimbangkan untuk menunda fitur ini ke tahap berikut jika kompleks |
| **Route `/refresh` tidak ada Middleware** | Cookie terkirim tapi route dilindungi middleware | Pastikan `/api/v1/auth/refresh` ada di daftar route publik middleware |

---

## 7. Keputusan Teknis

### 7.1 Token Storage: httpOnly Cookie

- **Access token**: disimpan di httpOnly cookie, SameSite: Strict
- **Refresh token**: disimpan di httpOnly cookie, SameSite: Strict
- Alasan: mencegah XSS, memudahkan otomatis attach ke request

### 7.2 JWT Payload

```json
{
  "sub": "uuid-user",
  "username": "admin",
  "email": "admin@sagu.sch.id",
  "role": "ADMIN",
  "fullName": "Administrator SAGU",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### 7.3 RBAC Scope (MVP)

Hanya 2 role yang punya dashboard di fase ini: ADMIN dan GURU.

| Role | Route yang Diizinkan |
|---|---|
| ADMIN | `/dashboard/admin`, `/api/v1/dashboard/admin` |
| GURU | `/dashboard/guru`, `/api/v1/dashboard/guru` |

Middleware tetap mendukung semua 5 role untuk expansibilitas.

### 7.4 Rate Limiting

Dilakukan di layer middleware menggunakan header-based simple check (opsional untuk MVP). Jika diimplementasi, gunakan in-memory store sederhana.

### 7.5 Audit Log

Hanya dicatat pada fase ini: login sukses, login gagal. Audit log untuk aksi sensitif lain ditunda ke tahap implementasi modul.

---

## 8. Draft Acceptance Test

### Test 1: Login Berhasil
```
1. Buka http://localhost:3000/login
2. Masukkan username: admin, password: <password-seed>
3. Klik "Masuk"
4. Harus redirect ke /dashboard/admin
5. Harus menampilkan "Administrator SAGU" di header
```

### Test 2: Login Gagal
```
1. Buka http://localhost:3000/login
2. Masukkan username: admin, password: salah
3. Klik "Masuk"
4. Harus menampilkan pesan error "Username atau password salah"
5. Tetap di halaman /login
```

### Test 3: Akses Route Dilindungi Tanpa Token
```
1. Buka http://localhost:3000/dashboard/admin (clear cookies dulu)
2. Harus redirect ke /login
```

### Test 4: RBAC — Guru Akses Admin Dashboard
```
1. Login sebagai guru_informatika
2. Buka http://localhost:3000/dashboard/admin
3. Harus redirect ke /dashboard/guru atau tampil 403
```

### Test 5: API Auth Middleware
```
1. Clear cookies
2. GET http://localhost:3000/api/v1/dashboard/admin
3. Response: 401 Unauthorized
```

### Test 6: Session User
```
1. Login sebagai admin
2. GET http://localhost:3000/api/v1/auth/me
3. Response berisi data user (id, username, email, role, fullName)
```

---

## 9. File yang DIBUAT vs DIUBAH vs TIDAK DIUBAH

### DIBUAT (baru)
- `src/lib/prisma.ts`
- `src/lib/errors/http-error.ts`
- `src/lib/errors/index.ts`
- `src/lib/auth/jwt.ts`
- `src/lib/auth/password.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/constants.ts`
- `src/middleware.ts`
- `src/app/login/page.tsx`
- `src/app/api/v1/auth/login/route.ts`
- `src/app/api/v1/auth/logout/route.ts`
- `src/app/api/v1/auth/refresh/route.ts`
- `src/app/api/v1/auth/me/route.ts`
- `src/app/dashboard/admin/page.tsx`
- `src/app/dashboard/guru/page.tsx`
- `src/components/auth-guard.tsx`
- `src/components/dashboard/dashboard-layout.tsx`

### DIUBAH
- `package.json` — hapus `dotenv` dari devDependencies, ganti `@types/bcrypt` → `@types/bcryptjs`
- `next.config.mjs` — hapus env NEXTAUTH_URL, ganti APP_URL
- `.env.example` — ganti env var JWT
- `prisma/seed.ts` — ganti password placeholder dengan hash valid
- `tsconfig.json` — tambahkan path untuk `@/lib/*`, `@/components/*` jika perlu (cek apakah sudah ada)
- `README.md` — update status proyek (opsional, bisa dilakukan setelah implementasi selesai)

### TIDAK DIUBAH
- `prisma/schema.prisma`

---

## 10. Catatan Kepatuhan

Semua keputusan di atas selaras dengan:
- `docs/AUTH_RBAC.md` — desain JWT + RBAC
- `docs/ROUTES.md` — endpoint auth yang didefinisikan
- `docs/DATABASE_SCHEMA.md` — struktur data yang ada (tanpa perubahan)
- `docs/PRD.md` — scope MVP
- `PROJECT_RULES.md` — modular, pisahkan auth dari modul lain

---

## Status Akhir

**READY TO IMPLEMENT AUTH FOUNDATION**
