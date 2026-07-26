# Changelog

## Log Perubahan SAGU

Dokumen ini mencatat setiap perubahan signifikan pada proyek SAGU berdasarkan versi dan tanggal.

## 2026-07-26 - Absensi Operasional MVP

### Added

- Data Master minimum untuk Absensi Operasional MVP: Mata Pelajaran, Guru, Siswa, Kelas, Rombel, dan Penugasan Mengajar.
- Import siswa berbasis CSV dengan template, preview validasi, deteksi duplikasi, dan commit data valid.
- Alur Guru: daftar penugasan, tambah pertemuan, absensi cepat per pertemuan, simpan/edit absensi, dan cetak absensi per pertemuan.
- Alur Admin: rekap absensi dengan filter periode/rombel/mapel/tanggal, cetak rekap, dan cetak detail per pertemuan.
- Screenshot verifikasi visual modul Absensi MVP di `docs/screenshots/attendance-mvp/`.

### Changed

- Absensi menggunakan relasi `meeting_id` dan unique `student_id + meeting_id` agar pencatatan aman untuk banyak pertemuan pada tanggal yang sama.
- Dashboard Admin dan Guru memakai ringkasan database dasar serta navigasi ke modul operasional absensi.

### Validation

- `npx.cmd prisma validate` PASS.
- `npx.cmd prisma generate` PASS.
- `npx.cmd tsc --noEmit` PASS.
- `npm.cmd run lint` PASS.
- `npm.cmd run build` PASS.

## Format Entri

Setiap entri mencakup:

- **Versi**: Nomor versi semantik (misalnya v1.0.0).
- **Tanggal**: Tanggal perubahan.
- **Kategori**: Added, Changed, Deprecated, Removed, Fixed, Security.
- **Deskripsi**: Penjelasan singkat perubahan.

## Versi 0.1.0 - Perencanaan MVP

### Tanggal: 2026-07-24

### Added

- Struktur dokumentasi proyek lengkap.
- AGENTS.md untuk panduan kerja agen.
- README.md untuk deskripsi proyek.
- MEMORY.md untuk catatan keputusan proyek.
- PROJECT_RULES.md untuk aturan proyek.
- TODO.md untuk daftar pekerjaan bertahap.
- ROADMAP.md untuk arah pengembangan.
- MILESTONES.md untuk target rilis.
- docs/PRD.md untuk kebutuhan produk.
- docs/DESIGN_SYSTEM.md untuk pedoman desain.
- docs/TASKS.md untuk daftar tugas terperinci.
- docs/DATABASE_SCHEMA.md untuk struktur database.
- docs/ROUTES.md untuk daftar route.
- docs/AUTH_RBAC.md untuk autentikasi dan otorisasi.
- docs/API_SPEC.md untuk spesifikasi API.
- docs/TEST_PLAN.md untuk rencana pengujian.
- docs/DEPLOYMENT.md untuk panduan deployment.
- docs/CHANGELOG.md untuk log perubahan (file ini).
- docs/ARCHITECTURE.md untuk dokumen arsitektur.
- docs/USER_FLOW.md untuk alur pengguna.
- docs/MODULES.md untuk deskripsi modul.
- docs/UI_COMPONENTS.md untuk referensi komponen UI.
- docs/SECURITY.md untuk panduan keamanan.

### Decisions

- Nama aplikasi: SAGU (Sistem Administrasi Guru).
- MVP fokus pada administrasi sekolah.
- Fitur AI Generator tidak termasuk pada fase MVP.
- Dukungan 5 role: Admin, Guru, Wali Kelas, Siswa, Orang Tua.
- Dokumentasi menggunakan Bahasa Indonesia.
