# Audit Auth dan Dashboard SAGU

## 1. Ringkasan Eksekutif

- Status: NOT READY
- Temuan kritis: middleware menerima payload JWT tanpa verifikasi signature; build gagal karena route handler mengembalikan `HttpError`, bukan `Response`.
- Temuan menengah: refresh token membuat access token baru dengan `role`, `username`, dan `email` kosong; login belum mendukung email walaupun spesifikasi menyebut username/email; RBAC baru mencakup Admin dan Guru; dashboard masih statis dan belum terhubung database.
- Temuan minor: navigasi belum memiliki topbar, drawer mobile, collapse sidebar, breadcrumb, active menu berbasis route, dan beberapa menu masih `#`.

Dokumen yang diperiksa: `AGENTS.md`, `MEMORY.md`, `README.md`, `docs/PRD.md`, `docs/ROUTES.md`, `docs/DATABASE_SCHEMA.md`, `docs/TASKS.md`, `docs/AUTH_RBAC.md`, dan `prisma/schema.prisma`. File root `TASKS.md`, `docs/FEATURE_REQUIREMENTS.md`, dan `docs/RBAC.md` tidak tersedia; dokumen terdekat yang tersedia adalah `docs/TASKS.md` dan `docs/AUTH_RBAC.md`.

## 2. Arsitektur Aktual

### Mekanisme autentikasi

Autentikasi aktual menggunakan custom JWT, bukan NextAuth. Endpoint login berada di `src/app/api/v1/auth/login/route.ts`. Request divalidasi dengan Zod untuk `username` dan `password` wajib isi (`src/app/api/v1/auth/login/route.ts:8-10`), lalu user dicari dengan `prisma.user.findUnique({ where: { username } })` (`src/app/api/v1/auth/login/route.ts:52-54`). Password diverifikasi memakai `bcrypt.compare` melalui `comparePassword` (`src/lib/auth/password.ts:7-11`).

Model user mendukung `username`, `email`, `passwordHash`, `role`, dan `isActive` (`prisma/schema.prisma:99-106`). Login menolak user tidak aktif (`src/app/api/v1/auth/login/route.ts:64-68`).

### Mekanisme session/token

Login menghasilkan access token dan refresh token (`src/app/api/v1/auth/login/route.ts:92-93`). Keduanya disimpan sebagai cookie `httpOnly`, `sameSite: "strict"`, `path: "/"`, `secure` hanya saat production, dengan umur 15 menit dan 7 hari (`src/app/api/v1/auth/login/route.ts:13-31`). Access token juga dikembalikan di body response (`src/app/api/v1/auth/login/route.ts:95-107`).

Token dibuat dengan `jsonwebtoken` (`src/lib/auth/jwt.ts:1`). Secret diambil dari `JWT_ACCESS_SECRET` dan `JWT_REFRESH_SECRET` (`src/lib/auth/jwt.ts:16-17`). Ada konstanta expiry dari env (`src/lib/auth/jwt.ts:18-19`), tetapi fungsi signing masih hard-coded `15m` dan `7d` (`src/lib/auth/jwt.ts:21-27`).

Logout hanya mengosongkan cookie `access_token` dan `refresh_token` dengan `maxAge: 0` (`src/app/api/v1/auth/logout/route.ts:12-25`). Tidak ada tabel session atau refresh token server-side untuk invalidasi token yang sudah terbit.

### Middleware

Middleware berada di `src/middleware.ts` dan berlaku untuk semua path kecuali static/image/favicon (`src/middleware.ts:107-109`). Path publik mencakup `/login`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`, dan `/api/v1/auth/me` (`src/middleware.ts:4-12`).

Middleware mengambil access token dari header Authorization atau cookie (`src/middleware.ts:65-67`), lalu memanggil `decodeJwtPayload` (`src/middleware.ts:76`). Fungsi `decodeJwtPayload` hanya base64-decode payload JWT dan `JSON.parse` hasilnya (`src/middleware.ts:37-44`). Tidak ada verifikasi signature JWT di middleware.

### Pemetaan role dan route

Role database terdiri dari `ADMIN`, `GURU`, `WALI_KELAS`, `SISWA`, dan `ORANG_TUA` (`prisma/schema.prisma:11-16`). Konstanta role juga memuat lima role tersebut (`src/lib/auth/constants.ts:1-7`).

Proteksi role aktual di middleware baru memetakan:

| Path | Role |
| --- | --- |
| `/dashboard/admin` | ADMIN |
| `/dashboard/guru` | GURU |
| `/api/v1/dashboard/admin` | ADMIN |
| `/api/v1/dashboard/guru` | GURU |

Bukti: `src/middleware.ts:29-34`. `PROTECTED_ROUTES` juga baru mencakup Admin dan Guru (`src/lib/auth/constants.ts:11-16`). Route API dashboard untuk Wali Kelas, Siswa, dan Orang Tua ada di dokumentasi (`docs/ROUTES.md:31-35`), tetapi belum ada implementasi route handler API dashboard selain auth (`Get-ChildItem src\app\api` hanya menemukan `login`, `logout`, `me`, `refresh`).

### Sumber data dashboard

Dashboard Admin dan Guru saat ini memakai array statis lokal. Admin memakai `stats` hard-coded (`src/app/dashboard/admin/page.tsx:6-11`). Guru memakai `stats` hard-coded (`src/app/dashboard/guru/page.tsx:6-11`). Tidak ada query database, server action, API call dashboard, loading state, empty state, error state, tabel, atau grafik pada dua halaman tersebut.

## 3. Hasil Audit Autentikasi

- Login tersedia di `POST /api/v1/auth/login` (`src/app/api/v1/auth/login/route.ts:34`).
- Validasi input hanya memastikan `username` dan `password` tidak kosong (`src/app/api/v1/auth/login/route.ts:8-10`). Belum ada dukungan login via email, walaupun `docs/AUTH_RBAC.md:9` menyebut username/email.
- Pencarian user memakai `username` saja (`src/app/api/v1/auth/login/route.ts:52-54`).
- Password hashing memakai bcrypt dengan salt rounds 10 di helper (`src/lib/auth/password.ts:3-5`) dan seed (`prisma/seed.ts:150`, `prisma/seed.ts:162`, `prisma/seed.ts:174`, `prisma/seed.ts:186`, `prisma/seed.ts:198`).
- Login menolak akun tidak aktif (`src/app/api/v1/auth/login/route.ts:64-68`), tetapi token yang sudah terbit tidak divalidasi ulang terhadap `isActive` pada middleware atau endpoint `/me`.
- Cookie auth memakai `httpOnly`, `sameSite: "strict"`, `path: "/"`, dan `secure` saat production (`src/app/api/v1/auth/login/route.ts:13-31`; `src/app/api/v1/auth/logout/route.ts:12-25`; `src/app/api/v1/auth/refresh/route.ts:45-60`).
- Access token dikembalikan di body login (`src/app/api/v1/auth/login/route.ts:100`) walaupun juga disimpan dalam httpOnly cookie.
- Refresh endpoint hanya membaca refresh token dari cookie (`src/app/api/v1/auth/refresh/route.ts:7`) dan tidak menerima body `refresh_token`, berbeda dari spesifikasi API yang mendokumentasikan body (`docs/API_SPEC.md:87`).
- Refresh endpoint membuat access token baru dengan `username`, `email`, `role`, dan `fullName` kosong (`src/app/api/v1/auth/refresh/route.ts:21-27`). Ini akan merusak RBAC setelah refresh.
- Logout tersedia di `POST /api/v1/auth/logout` dan menghapus cookie (`src/app/api/v1/auth/logout/route.ts:3-28`). Karena token stateless, logout tidak menginvalidasi token di server.
- Kredensial seed hard-coded tersedia untuk 5 role (`prisma/seed.ts:144-200`) dan juga dicantumkan di README (`README.md:21-25`). Ini cocok untuk data lokal, tetapi harus dipastikan tidak dipakai produksi.

## 4. Hasil Audit RBAC

- ADMIN diarahkan oleh login ke `/dashboard/admin` karena role `ADMIN` diubah menjadi lowercase (`src/app/login/page.tsx:35-36`). Route ini tersedia (`src/app/dashboard/admin/page.tsx:5`).
- GURU diarahkan ke `/dashboard/guru` dengan mekanisme yang sama (`src/app/login/page.tsx:35-36`). Route ini tersedia (`src/app/dashboard/guru/page.tsx:5`).
- Pengguna tanpa token akan diarahkan ke `/login` untuk route non-API (`src/middleware.ts:69-73`) dan mendapat JSON 401 untuk API (`src/middleware.ts:69-72`).
- Guru yang membuka `/dashboard/admin` melalui URL langsung akan ditolak berdasarkan `payload.role !== requiredRole` (`src/middleware.ts:85-92`). Namun keputusan ini memakai payload JWT yang tidak diverifikasi signature oleh middleware (`src/middleware.ts:37-44`), sehingga proteksi route kritis belum layak disebut aman.
- Pemeriksaan role server-side saat ini hanya ada di middleware untuk route dashboard Admin/Guru (`src/middleware.ts:29-34`). Tidak ada route handler API dashboard aktual yang memverifikasi role di level handler/service.
- Role `WALI_KELAS`, `SISWA`, dan `ORANG_TUA` ada di schema (`prisma/schema.prisma:11-16`) dan seed (`prisma/seed.ts:168-200`), tetapi belum memiliki halaman dashboard aktif. Direktori `src/app/dashboard/wali-kelas` dan `src/app/dashboard/orang-tua` ada, tetapi tidak berisi `page.tsx`; dashboard siswa tidak terlihat di hasil listing.
- Login untuk `WALI_KELAS` akan membentuk `/dashboard/wali_kelas` (`src/app/login/page.tsx:35-36`), sedangkan direktori yang tersedia memakai format `wali-kelas`. Ini mismatch slug.
- Middleware saat role salah mengarahkan ke `/dashboard/` + `payload.role.toLowerCase()` (`src/middleware.ts:90-92`), sehingga role `WALI_KELAS` juga diarahkan ke slug underscore yang tidak sesuai direktori/dokumentasi.

## 5. Hasil Audit Dashboard Admin

Inventarisasi aktual:

| Elemen | Lokasi | Kondisi Aktual |
| --- | --- | --- |
| Header | `src/app/dashboard/admin/page.tsx:16-38` | Badge `Admin`, judul, deskripsi statis |
| Card statistik | `src/app/dashboard/admin/page.tsx:6-11`, `40-63` | 4 card statis: Total Pengguna 5, Total Siswa 1, Total Guru 1, Rombel Aktif 1 |
| Menu sidebar | `src/components/dashboard/dashboard-layout.tsx:25-32` | Dashboard aktif, Data Guru/Data Siswa/Rombel/Pengaturan masih `#` |
| Tabel | - | Belum ada |
| Grafik | - | Belum ada |
| Menu cepat | - | Belum ada komponen quick action khusus |
| Loading state | - | Belum ada |
| Empty state | - | Belum ada |
| Error state | - | Belum ada |

Semua angka dashboard Admin masih dummy/statis karena tidak ada query Prisma, fetch API, atau server action di `src/app/dashboard/admin/page.tsx`.

## 6. Hasil Audit Dashboard Guru

Inventarisasi aktual:

| Elemen | Lokasi | Kondisi Aktual |
| --- | --- | --- |
| Header | `src/app/dashboard/guru/page.tsx:16-38` | Badge `Guru`, judul, deskripsi statis |
| Card statistik | `src/app/dashboard/guru/page.tsx:6-11`, `40-63` | 4 card statis: Mata Pelajaran 1, Rombel 1, Pertemuan 2, Siswa 1 |
| Menu sidebar | `src/components/dashboard/dashboard-layout.tsx:33-38` | Dashboard aktif, Agenda Mengajar/Absensi/Penilaian masih `#` |
| Jadwal hari ini | - | Belum ada |
| Aktivitas | - | Belum ada |
| Loading state | - | Belum ada |
| Empty state | - | Belum ada |
| Error state | - | Belum ada |

Desain saat ini belum mendukung alur `jadwal hari ini -> mulai pertemuan -> absensi -> jurnal mengajar`. Halaman hanya menampilkan ringkasan statis dan belum memiliki CTA, state pertemuan, atau data jadwal.

## 7. Hasil Audit Navigasi dan Responsivitas

- Sidebar desktop tersedia sebagai `<aside>` dengan lebar tetap `260px` (`src/components/dashboard/dashboard-layout.tsx:51-57`).
- Collapse/minimize sidebar belum tersedia; tidak ada state atau tombol untuk toggle sidebar di `DashboardLayout`.
- Drawer mobile belum tersedia; layout memakai `display: "flex"` tanpa breakpoint atau media query (`src/components/dashboard/dashboard-layout.tsx:43-109`).
- Topbar belum tersedia.
- Breadcrumb belum tersedia.
- Active menu belum berdasarkan route aktual. Style saat ini hanya membedakan `href === "#"` vs bukan `#` (`src/components/dashboard/dashboard-layout.tsx:72-83`).
- Beberapa item menu memakai `href: "#"` (`src/components/dashboard/dashboard-layout.tsx:28-31`, `35-37`), sehingga tombol navigasi belum menuju route aktif.
- `key={item.href}` dipakai untuk item menu (`src/components/dashboard/dashboard-layout.tsx:68-71`). Karena beberapa href bernilai `#`, key React duplikat dapat terjadi.
- Logout tersedia dari sidebar dashboard (`src/components/dashboard/dashboard-layout.tsx:16-22`, `89-98`). Tidak ada titik logout lain karena topbar/profil belum ada.
- Login page responsif dasar melalui card lebar penuh dan `maxWidth: "440px"` (`src/app/login/page.tsx:54-59`), tetapi dashboard belum punya penyesuaian mobile eksplisit.

## 8. Hasil Pemeriksaan Keamanan

- Critical: middleware tidak memverifikasi signature JWT. `decodeJwtPayload` hanya membaca bagian payload (`src/middleware.ts:37-44`) dan role check memakai payload tersebut (`src/middleware.ts:85-92`). Token palsu dengan payload role dapat melewati middleware bila format dan `exp` dibuat sesuai.
- Secret JWT diambil dari env (`src/lib/auth/jwt.ts:16-17`, `30`, `34`). File `.env` ada dan `.gitignore` mengecualikan `.env` (`.gitignore:3`). Nilai tidak dicatat di laporan ini.
- `.env.example` masih memakai placeholder lemah `change-me-in-production` untuk JWT secret (`.env.example:2-3`). Aman sebagai contoh jika diganti, tetapi perlu validasi startup agar tidak dipakai produksi.
- Cookie auth sudah memakai `httpOnly`, `sameSite: "strict"`, dan `secure` saat production (`src/app/api/v1/auth/login/route.ts:13-31`).
- Access token dikirim di body response login (`src/app/api/v1/auth/login/route.ts:100`) dan refresh (`src/app/api/v1/auth/refresh/route.ts:38-40`), yang memperluas permukaan eksposur token.
- Tidak ditemukan open redirect berbasis parameter eksternal. Redirect memakai path internal dari role (`src/app/login/page.tsx:35-36`, `src/middleware.ts:90-92`). Namun slug role tidak dinormalisasi untuk `WALI_KELAS` dan `ORANG_TUA`.
- API auth `/me` dan `/refresh` memakai helper error yang mengembalikan `HttpError` (`src/lib/errors/http-error.ts:16-33`) bukan response HTTP; ini terbukti membuat build gagal dan bisa menyebabkan error runtime pada branch error.
- Tidak ada rate limiting login, lockout login gagal, CAPTCHA, atau audit log auth aktif. Dokumen keamanan meminta pembatasan login gagal (`docs/SECURITY.md:35-36`, `174-176`), tetapi implementasi login hanya mengembalikan 401 tanpa pencatatan (`src/app/api/v1/auth/login/route.ts:57-76`).
- Log server menggunakan `console.error` pada error login, refresh, dan me (`src/app/api/v1/auth/login/route.ts:117`, `src/app/api/v1/auth/refresh/route.ts:64`, `src/app/api/v1/auth/me/route.ts:35`). Response error tidak mengembalikan stack trace, tetapi log perlu dipastikan tidak memuat body request sensitif.

## 9. Hasil Validasi Teknis

| Perintah | Hasil | Output / Error |
| --- | --- | --- |
| `npx prisma validate` | PASS | `Environment variables loaded from .env`; `Prisma schema loaded from prisma\schema.prisma`; `The schema at prisma\schema.prisma is valid` |
| `npx prisma generate` | FAIL | `EPERM: operation not permitted, rename 'C:\laragon\www\sagu\node_modules\.prisma\client\query_engine-windows.dll.node.tmp14788' -> 'C:\laragon\www\sagu\node_modules\.prisma\client\query_engine-windows.dll.node'` |
| `npm run lint` | FAIL | `next lint` membuka prompt interaktif: `How would you like to configure ESLint? ... Strict (recommended) / Base / Cancel`. Tidak dipilih karena audit tidak boleh mengubah setup. |
| `npm run typecheck` | SKIPPED | Script `typecheck` tidak tersedia di `package.json`; scripts hanya `dev`, `build`, `start`, `lint`, `prisma:*`, dan `postinstall` (`package.json:5-14`). |
| `npm run build` | FAIL | Build compile awal sukses, lalu type check gagal: `.next/types/app/api/v1/auth/me/route.ts:59:7 Type error: Type '{ __tag__: "GET"; __return_type__: Promise<HttpError | NextResponse<...>>; }' does not satisfy the constraint ... Type 'HttpError' is not assignable to type 'void | Response'.` |

## 10. Data Dummy, Placeholder, dan Route Belum Aktif

| Lokasi | Jenis | Kondisi Aktual | Dampak | Rekomendasi |
| --- | --- | --- | --- | --- |
| `src/app/dashboard/admin/page.tsx:6-11` | Dummy data | Statistik Admin hard-coded | Angka tidak mencerminkan database | Ambil agregasi dari Prisma/API dashboard Admin |
| `src/app/dashboard/guru/page.tsx:6-11` | Dummy data | Statistik Guru hard-coded | Tidak personal sesuai guru login | Ambil data berdasarkan user/teacher login |
| `src/components/dashboard/dashboard-layout.tsx:28-31` | Placeholder link | Menu Admin selain Dashboard memakai `#` | Klik tidak membuka modul | Buat route nyata atau nonaktifkan dengan state eksplisit |
| `src/components/dashboard/dashboard-layout.tsx:35-37` | Placeholder link | Menu Guru selain Dashboard memakai `#` | Alur agenda/absensi/penilaian belum bisa dimulai | Buat route modul Guru sesuai prioritas MVP |
| `src/app/dashboard/wali-kelas` | Route kosong | Direktori ada tetapi tidak ada `page.tsx` | Role Wali Kelas belum punya dashboard | Implementasi dashboard Wali Kelas atau redirect 403/coming soon terkontrol |
| `src/app/dashboard/orang-tua` | Route kosong | Direktori ada tetapi tidak ada `page.tsx` | Role Orang Tua belum punya dashboard | Implementasi dashboard Orang Tua atau redirect 403/coming soon terkontrol |
| `src/app/dashboard/siswa` | Route belum ada | Tidak terlihat dalam listing dashboard | Role Siswa belum punya dashboard | Tambahkan route dashboard siswa sesuai PRD |
| `src/app/api/v1/dashboard/*` | Route belum ada | Tidak ada route handler dashboard API | Dashboard tidak punya sumber data server | Tambahkan endpoint dashboard dengan RBAC dan query DB |
| `src/components/auth-guard.tsx:6-42` | Komponen tidak terpakai | Tidak ditemukan pemakaian `AuthGuard` di app | Proteksi client-side tidak aktif | Hapus bila tidak dipakai atau pasang konsisten setelah middleware aman |
| `src/app/login/page.tsx:154` | Informasi credential | Menampilkan password default di UI | Berisiko bila terbawa ke non-dev | Tampilkan hanya di development atau hapus sebelum production |

## 11. Daftar Temuan

| ID | Severity | Lokasi | Temuan | Bukti | Rekomendasi |
| --- | --- | --- | --- | --- | --- |
| AUTH-001 | Critical | `src/middleware.ts:37-44`, `76-92` | Middleware tidak memverifikasi signature JWT sebelum mempercayai role | Payload dibaca dengan base64 decode dan role dipakai untuk authorize | Verifikasi JWT di middleware dengan secret yang benar atau pindahkan proteksi ke server/route handler yang memverifikasi token |
| AUTH-002 | Critical | `src/app/api/v1/auth/me/route.ts:10`, `17`, `36`; `src/lib/errors/http-error.ts:16-33` | Route handler mengembalikan `HttpError`, bukan `Response` | `npm run build` gagal dengan `Type 'HttpError' is not assignable to type 'void | Response'` | Jadikan helper error menghasilkan `NextResponse.json` atau tangkap `HttpError` dan ubah ke response di route |
| AUTH-003 | High | `src/app/api/v1/auth/refresh/route.ts:21-27` | Refresh membuat access token dengan identitas dan role kosong | Payload baru berisi `username: ""`, `email: ""`, `role: ""`, `fullName: ""` | Setelah verifikasi refresh token, ambil user dari DB, cek `isActive`, lalu isi payload lengkap |
| AUTH-004 | High | `src/middleware.ts:4-12`; `docs/ROUTES.md:21-23` | `/api/v1/auth/logout`, `/refresh`, dan `/me` dimasukkan public path meski dokumentasi menyebut authenticated | Public path melewati middleware auth | Selaraskan definisi publik/protected; biarkan endpoint auth memvalidasi token sendiri hanya bila memang desainnya eksplisit |
| AUTH-005 | Medium | `src/app/api/v1/auth/login/route.ts:8-10`, `52-54`; `docs/AUTH_RBAC.md:9` | Login belum mendukung email | Query hanya `where: { username }` | Gunakan lookup `OR` username/email dan validasi input yang jelas |
| AUTH-006 | Medium | `src/app/api/v1/auth/login/route.ts:100`; `src/app/api/v1/auth/refresh/route.ts:38-40` | Access token dikirim di body selain cookie httpOnly | Response login/refresh mengandung token | Jika memakai cookie httpOnly, pertimbangkan tidak mengirim access token ke body response |
| AUTH-007 | Medium | `src/lib/auth/jwt.ts:18-27` | Env expiry disiapkan tetapi tidak dipakai | `ACCESS_EXPIRY` dan `REFRESH_EXPIRY` tidak digunakan; signing hard-coded `15m`/`7d` | Pakai konstanta env expiry atau hapus agar tidak misleading |
| AUTH-008 | Medium | `src/app/api/v1/auth/logout/route.ts:12-25` | Logout hanya menghapus cookie, tidak menginvalidasi token server-side | Tidak ada session/refresh token store | Tambahkan token/session store bila butuh revoke logout lintas perangkat |
| AUTH-009 | Medium | `src/app/api/v1/auth/login/route.ts:64-68`; `src/middleware.ts:76-92`; `src/app/api/v1/auth/me/route.ts:13-33` | User nonaktif hanya dicek saat login | Middleware dan `/me` tidak lookup user terbaru | Untuk request sensitif, verifikasi status user di DB atau pakai versi token/session |
| RBAC-001 | High | `prisma/schema.prisma:11-16`; `src/middleware.ts:29-34`; `src/lib/auth/constants.ts:11-16` | RBAC implementasi hanya Admin/Guru | Tiga role lain ada di schema tetapi tidak diproteksi/diimplementasikan | Tambah route dan rule role untuk Wali Kelas, Siswa, Orang Tua |
| RBAC-002 | Medium | `src/app/login/page.tsx:35-36`; `src/middleware.ts:90-92` | Slug role dari `toLowerCase()` menghasilkan `wali_kelas` dan `orang_tua` | Direktori yang tersedia memakai `wali-kelas` dan `orang-tua` | Buat mapper role ke route eksplisit |
| DASH-001 | Medium | `src/app/dashboard/admin/page.tsx:6-11` | Dashboard Admin sepenuhnya statis | Tidak ada query DB/fetch/API | Implementasi endpoint/service agregasi dashboard |
| DASH-002 | Medium | `src/app/dashboard/guru/page.tsx:6-11` | Dashboard Guru sepenuhnya statis | Tidak ada jadwal, aktivitas, atau data guru login | Buat data dashboard berbasis teaching assignment dan meeting |
| NAV-001 | Medium | `src/components/dashboard/dashboard-layout.tsx:28-31`, `35-37` | Menu utama banyak memakai `#` | Tautan tidak mengarah ke route modul | Tambah route modul atau disabled state yang jelas |
| NAV-002 | Minor | `src/components/dashboard/dashboard-layout.tsx:51-109` | Layout belum mobile-ready | Sidebar fixed dan tanpa drawer/collapse | Tambah responsive sidebar/drawer dan topbar |
| NAV-003 | Minor | `src/components/dashboard/dashboard-layout.tsx:68-83` | Active menu tidak berbasis current pathname | Style hanya membedakan href `#` | Gunakan `usePathname()` dan state active yang benar |
| NAV-004 | Minor | `src/components/dashboard/dashboard-layout.tsx:68-71` | React key duplikat berpotensi muncul | Beberapa item memakai `href: "#"` dan key memakai href | Gunakan key unik seperti role+label |
| SEC-001 | Medium | `prisma/seed.ts:144-200`; `README.md:21-25`; `src/app/login/page.tsx:154` | Kredensial demo hard-coded dan ditampilkan | Password default `password123` muncul di seed, README, dan UI | Pastikan hanya development; hilangkan dari UI production |
| SEC-002 | Medium | `src/app/api/v1/auth/login/route.ts:57-76`; `docs/SECURITY.md:35-36` | Tidak ada rate limiting atau audit log login gagal | Login gagal hanya return 401 | Tambah rate limiting dan audit log sebelum production |
| TECH-001 | High | `node_modules\.prisma\client\query_engine-windows.dll.node` | `npx prisma generate` gagal EPERM | Output: operation not permitted saat rename query engine | Tutup proses yang mengunci Prisma engine lalu jalankan generate ulang |
| TECH-002 | High | `package.json:9` | `npm run lint` tidak bisa berjalan non-interaktif | Output meminta konfigurasi ESLint | Tambah konfigurasi ESLint secara eksplisit di task perbaikan terpisah |
| TECH-003 | Critical | `.next/types/app/api/v1/auth/me/route.ts:59:7`; `src/app/api/v1/auth/me/route.ts:10` | `npm run build` gagal type check | Return type route mencakup `HttpError` | Perbaiki helper/route error response |

## 12. Rekomendasi Tahap Berikutnya

### Harus diperbaiki sebelum melanjutkan

- Verifikasi signature JWT di middleware atau pindahkan proteksi route ke server path yang memverifikasi token secara kriptografis.
- Perbaiki helper error agar semua route handler mengembalikan `Response`/`NextResponse`; ini memblokir build.
- Perbaiki refresh token agar mengambil user aktif dari database dan menerbitkan access token dengan role lengkap.
- Jalankan ulang `npx prisma generate` setelah memastikan file query engine tidak dikunci proses lain.
- Tambahkan konfigurasi ESLint agar `npm run lint` berjalan non-interaktif.

### Dapat diperbaiki bersamaan dengan Data Master

- Implementasi endpoint/API dashboard Admin dan Guru dengan RBAC handler-level.
- Hubungkan card dashboard ke database.
- Buat route modul Data Guru, Data Siswa, Rombel, Pengaturan, Agenda Mengajar, Absensi, dan Penilaian.
- Tambahkan mapper role ke route dashboard eksplisit.
- Implementasi dashboard Wali Kelas, Siswa, dan Orang Tua atau tampilkan halaman terkontrol sampai modulnya siap.

### Dapat ditunda

- Token/session store untuk logout lintas perangkat.
- Rate limiting, lockout login gagal, dan audit log detail.
- Drawer mobile, collapse sidebar, breadcrumb, dan topbar lengkap.
- Menghapus informasi password default dari UI setelah masuk mode production.
