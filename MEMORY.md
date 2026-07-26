# MEMORY.md

Catatan memori proyek SAGU. Dokumen ini menyimpan keputusan penting agar konteks tidak hilang antar sesi kerja.

## Keputusan Awal

- Nama aplikasi: SAGU.
- Kepanjangan: Sistem Administrasi Guru.
- Target fase saat ini: MVP administrasi sekolah.
- Fitur AI Generator tidak dibuat pada fase MVP.
- Dokumentasi ditulis dalam Bahasa Indonesia.
- Aplikasi diarahkan sebagai SaaS profesional untuk sekolah.

## Scope MVP

MVP mencakup:

- Dashboard berbasis role.
- Data guru.
- Data siswa.
- Rombel.
- Absensi.
- Leger penilaian.
- Agenda mengajar.
- Laporan.
- Pengaturan.

MVP tidak mencakup:

- AI Generator.
- Pembayaran sekolah.
- LMS lengkap.
- Ujian online kompleks.
- Integrasi eksternal real-time.

## Role Final Fase MVP

- Admin
- Guru
- Wali Kelas
- Siswa
- Orang Tua

## Asumsi Produk

- Satu sekolah dapat memiliki banyak tahun ajaran.
- Satu siswa berada dalam satu rombel aktif pada satu tahun ajaran.
- Satu guru dapat mengajar banyak mata pelajaran dan rombel.
- Wali kelas adalah guru yang ditugaskan ke satu rombel pada tahun ajaran tertentu.
- Orang tua dapat melihat data anak yang terhubung ke akun mereka.

## Keputusan Teknis Awal

- Struktur database dirancang relasional.
- Sistem otorisasi menggunakan RBAC.
- API dirancang RESTful untuk MVP.
- Audit log disarankan untuk aktivitas sensitif.
- Soft delete disarankan untuk data utama.

## Status Dokumentasi

- Seluruh 14 file dokumentasi di `docs/` telah dibuat dan selesai.
- File root (AGENTS.md, README.md, dll.) telah diperbarui.
- File `kilo.json` dibuat untuk konfigurasi proyek.
- Direktori `.kilo/command/` dan `.kilo/agent/` dibuat.
- Audit report final (`audit_report_final.md`) telah dibuat.

## Status Terkini Lama

- Tahap 0 dokumentasi telah selesai.
- Tahap 3 implementasi fondasi telah dimulai.
- Auth Foundation sudah diimplementasikan: JWT + RBAC, API auth, middleware, login page, dashboard placeholder.
- `prisma/seed.ts` telah diperbaiki: password placeholder diganti bcrypt hash valid, rombelId kosong diperbaiki.
- Dokumentasi laporan/audit/review lama dipindah ke `docs/archive/`.
- `next.config.mjs` diperbaiki: CORS origin menggunakan `APP_URL` bukan wildcard `*`.
- Section UU PDP ditambahkan ke `docs/SECURITY.md`.
- Node.js v18.8.0 di environment tidak memenuhi requirement Next.js (minimal v18.17.0), sehingga `next build` belum dapat dijalankan. `tsc --noEmit` lolos.

## Status Terkini - 2026-07-26

- Fondasi aplikasi yang sudah selesai: login ADMIN dan GURU, logout, refresh token, middleware dan RBAC, branding login, dashboard shell, Data Master Tahun Ajaran, Data Master Semester, dan integrasi periode aktif pada topbar.
- Route UI Tahun Ajaran dan Semester tersedia di `/dashboard/admin/data-master/tahun-ajaran`.
- Route API Tahun Ajaran tersedia di `/api/v1/tahun-ajaran`, `/api/v1/tahun-ajaran/:id`, `/api/v1/tahun-ajaran/:id/activate`, dan `/api/v1/tahun-ajaran/active`.
- Route API Semester tersedia di `/api/v1/semester`, `/api/v1/semester/:id`, dan `/api/v1/semester/:id/activate`.
- Aktivasi periode menggunakan aturan satu tahun ajaran aktif dan satu semester aktif. Mengaktifkan semester juga memastikan tahun ajaran terkait menjadi periode aktif.
- Soft delete tersedia untuk Tahun Ajaran dan Semester melalui pengisian `deletedAt`; data arsip tidak tampil di daftar default.
- Quality gate terakhir untuk modul periode akademik: Prisma validate PASS, Prisma generate PASS, TypeScript PASS, lint PASS, dan build PASS.
- Tahap berikutnya adalah Absensi Operasional MVP.
- Periode aktif di database harus dikonfirmasi dengan periode sekolah sebenarnya sebelum dipakai untuk operasional nyata.
