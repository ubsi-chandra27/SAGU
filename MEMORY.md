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

## Status Terkini - 2026-07-26 (Absensi Operasional MVP)

- Modul Absensi Operasional MVP sudah selesai pada kode lokal: Data Master Mata Pelajaran, Data Guru, Data Siswa, Kelas, Rombel, Penugasan Mengajar, Pertemuan Guru, Absensi Cepat per pertemuan, Rekap Absensi Admin, dan halaman cetak.
- Route UI Admin yang tersedia: `/dashboard/admin/data-master/mata-pelajaran`, `/dashboard/admin/data-master/guru`, `/dashboard/admin/data-master/siswa`, `/dashboard/admin/data-master/kelas`, `/dashboard/admin/data-master/rombel`, `/dashboard/admin/data-master/penugasan-mengajar`, `/dashboard/admin/rekap-absensi`, `/dashboard/admin/rekap-absensi/cetak`, dan `/dashboard/admin/rekap-absensi/pertemuan/[meetingId]/cetak`.
- Route UI Guru yang tersedia: `/dashboard/guru/pertemuan`, `/dashboard/guru/pertemuan/[meetingId]/absensi`, dan `/dashboard/guru/pertemuan/[meetingId]/absensi/cetak`.
- Route API Admin yang tersedia untuk sprint ini: `/api/v1/admin/master/subjects`, `/teachers`, `/classes`, `/rombels`, `/students`, `/students/template`, `/students/import-preview`, `/students/import-commit`, `/teaching-assignments`, `/api/v1/admin/attendance/recap`, dan `/api/v1/admin/attendance/meetings/[id]`.
- Route API Guru yang tersedia: `/api/v1/guru/assignments`, `/api/v1/guru/meetings`, `/api/v1/guru/meetings/[id]`, dan `/api/v1/guru/meetings/[id]/attendance`.
- Absensi sekarang dikunci per siswa dan per pertemuan melalui `Attendance.meetingId` dengan unique `studentId + meetingId`; migration `20260726103000_attendance_per_meeting` sudah diterapkan di database lokal.
- Aturan operasional: Guru hanya dapat membuat pertemuan dan mengisi absensi untuk penugasan miliknya; Admin dapat mengelola data master dan membaca rekap; pengguna tanpa login diarahkan ke `/login`; role yang salah ditolak atau diarahkan oleh middleware/API handler.
- Quality gate sprint Absensi Operasional MVP: `prisma validate`, `prisma generate`, `tsc --noEmit`, `npm run lint`, dan `npm run build` PASS pada 2026-07-26.
- Data uji runtime sprint sudah di-soft-delete/dinonaktifkan setelah verifikasi. Periode aktif tetap harus dikonfirmasi dengan periode sekolah sebenarnya sebelum dipakai operasional nyata.
- Tahap berikutnya: Jurnal Mengajar operasional dan penajaman laporan absensi lintas role sesuai kebutuhan sekolah.

## Status Terkini - 2026-07-26 (Koreksi Dashboard Admin)

- Nama resmi produk tetap `SAGU - Sistem Administrasi Guru`; variasi nama nonresmi dari instruksi audit tidak dipakai sebagai nama produk.
- Dashboard Admin dikoreksi agar fokus pada scope terverifikasi: periode aktif, ringkasan data master berbasis database, kesiapan data, dan tindakan ke route yang benar-benar tersedia.
- Card `Aktivitas Terbaru` dan `Pengumuman` tidak ditampilkan pada Dashboard Admin karena belum menjadi requirement MVP yang disetujui.
- Breadcrumb Dashboard Admin root ditampilkan sebagai `Dashboard`; halaman Tahun Ajaran dan Semester memakai pola `Dashboard > Data Master > Tahun Ajaran & Semester`.
- Modul Tahun Ajaran dan Semester tetap terverifikasi melalui UI, API, RBAC, database, aktivasi periode, soft delete, topbar periode aktif, dan screenshot halaman aktual.
- Klaim implementasi UI berikutnya harus disertai screenshot halaman runtime aktual pada viewport yang relevan.
- Commit verifikasi Dashboard Admin: `16381a398ae40c77e7c8f0d0e1dee325a0f9e76d` (`fix: align dashboard with verified SAGU scope`).
- Status push GitHub penutupan: push berhasil setelah timeout eksekusi diperpanjang; `origin/main` sudah memuat commit penutupan Dashboard Admin.
- Keputusan verifikasi: HTTP 200 pada route bukan bukti modul lengkap. Modul dinyatakan lengkap hanya jika CRUD, database, API, RBAC, dan pengujiannya terbukti.
- Prioritas berikutnya tetap Absensi Operasional MVP dan audit Data Master minimum untuk absensi; Jurnal Mengajar belum menjadi prioritas berikutnya.
