# SAGU - Sistem Administrasi Guru

SAGU adalah aplikasi web SaaS untuk membantu administrasi guru dan sekolah. Proyek ini dirancang untuk mengelola data guru, siswa, rombel, absensi, leger penilaian, agenda mengajar, laporan, dan pengaturan sekolah.

## Status

Fase saat ini: Tahap 3 - Implementasi Auth Foundation.

Fondasi autentikasi dan otorisasi sudah diimplementasikan: JWT + RBAC, halaman login, API auth, middleware proteksi route, dan dashboard placeholder untuk Admin dan Guru.

## Menjalankan Aplikasi

1. Salin `.env.example` menjadi `.env` dan isi `DATABASE_URL`.
2. Jalankan `npm install`.
3. Jalankan `npx prisma migrate dev` untuk migrasi database.
4. Jalankan `npx prisma db seed` untuk data awal (default password: `password123`).
5. Jalankan `npm run dev` untuk development server.
6. Buka `http://localhost:3000/login`.

Akun seed:
- Admin: `admin` / `password123`
- Guru: `guru_informatika` / `password123`
- Wali Kelas: `wali_kelas_x1` / `password123`
- Siswa: `siswa_01` / `password123`
- Orang Tua: `ortu_siswa_01` / `password123`

## Tujuan MVP

- Menyediakan dashboard sesuai role pengguna.
- Mengelola data master guru, siswa, kelas, rombel, tahun ajaran, dan mata pelajaran.
- Mencatat absensi siswa.
- Mengelola nilai dan leger penilaian.
- Mengelola agenda mengajar guru.
- Menyediakan laporan administrasi sekolah.
- Menyediakan pengaturan dasar sekolah, akun, role, dan hak akses.

## Role Pengguna

- Admin
- Guru
- Wali Kelas
- Siswa
- Orang Tua

## Modul Utama

1. Dashboard Admin
2. Dashboard Guru
3. Dashboard Wali Kelas
4. Dashboard Siswa
5. Data Guru
6. Data Siswa
7. Rombel
8. Absensi
9. Leger Penilaian
10. Agenda Mengajar
11. Laporan
12. Pengaturan

## Struktur Dokumentasi

- `AGENTS.md`: panduan kerja agen dan kontributor.
- `MEMORY.md`: catatan keputusan dan konteks proyek.
- `PROJECT_RULES.md`: aturan proyek.
- `TODO.md`: daftar pekerjaan bertahap.
- `ROADMAP.md`: arah pengembangan produk.
- `MILESTONES.md`: target rilis bertahap.
- `kilo.json`: konfigurasi proyek.
- `docs/PRD.md`: spesifikasi kebutuhan produk.
- `docs/DESIGN_REFERENCE.md`: pedoman desain visual dan UX.
- `docs/TASKS.md`: daftar tugas terperinci per fase.
- `docs/DATABASE_SCHEMA.md`: struktur database dan ERD konseptual.
- `docs/ROUTES.md`: daftar route API dan frontend.
- `docs/AUTH_RBAC.md`: spesifikasi autentikasi dan otorisasi RBAC.
- `docs/API_SPEC.md`: kontrak spesifikasi API RESTful.
- `docs/TEST_PLAN.md`: rencana pengujian terperinci.
- `docs/DEPLOYMENT.md`: panduan deployment produksi.
- `docs/CHANGELOG.md`: log perubahan proyek.
- `docs/ARCHITECTURE.md`: arsitektur aplikasi dan desain modular.
- `docs/USER_FLOW.md`: alur kerja setiap role pengguna.
- `docs/MODULES.md`: deskripsi setiap modul MVP.
- `docs/UI_COMPONENTS.md`: referensi komponen antarmuka pengguna.
- `docs/SECURITY.md`: panduan keamanan dan perlindungan data.

## Prinsip Produk

SAGU dibuat untuk lingkungan sekolah, sehingga prioritasnya adalah:

- Mudah dipakai oleh operator dan guru.
- Data siswa aman dan tertata.
- Alur kerja administrasi tidak berbelit.
- Laporan bisa digunakan untuk kebutuhan sekolah nyata.
- Fitur MVP stabil sebelum fitur lanjutan ditambahkan.

## Referensi Utama

- Produk: `docs/PRD.md`
- Modul: `docs/MODULES.md`
- Database: `docs/DATABASE_SCHEMA.md`
- Route: `docs/ROUTES.md`
- API: `docs/API_SPEC.md`
- RBAC: `docs/AUTH_RBAC.md`
- Pengujian: `docs/TEST_PLAN.md`

