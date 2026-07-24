# ROADMAP.md

Roadmap pengembangan SAGU.

## Prinsip Roadmap

Roadmap disusun agar SAGU dapat digunakan sekolah secara bertahap. Setiap fase harus menghasilkan nilai operasional yang jelas, bukan hanya fitur teknis.

## Fase 0 - Perencanaan MVP

Target:

- Dokumentasi proyek lengkap.
- Scope MVP jelas.
- Role dan permission awal jelas.
- Model data konseptual tersedia.
- Roadmap dan milestone tersedia.

Output:

- Dokumen PRD.
- Dokumen arsitektur.
- Dokumen database.
- Dokumen route dan API.
- Dokumen test plan.

## Fase 1 - Fondasi Aplikasi

Target:

- Autentikasi.
- RBAC.
- Struktur dashboard.
- Pengaturan sekolah.
- Data tahun ajaran dan semester.

Prioritas:

- Login aman.
- Manajemen pengguna.
- Proteksi route per role.
- Audit dasar.

## Fase 2 - Data Master Akademik

Target:

- Data guru.
- Data siswa.
- Data kelas.
- Data rombel.
- Data mata pelajaran.
- Penugasan guru mengajar.
- Penugasan wali kelas.

Prioritas:

- CRUD data master.
- Validasi relasi akademik.
- Import data sederhana jika dibutuhkan.

## Fase 3 - Operasional Harian

Target:

- Absensi siswa.
- Agenda mengajar.
- Catatan kelas.
- Monitoring wali kelas.

Prioritas:

- Guru dapat mencatat absensi per pertemuan.
- Guru dapat mengisi agenda mengajar.
- Wali kelas dapat melihat rekap kelas.

## Fase 4 - Penilaian dan Leger

Target:

- Input nilai.
- Komponen penilaian.
- Rekap nilai per siswa.
- Leger per rombel.

Prioritas:

- Struktur nilai fleksibel.
- Rekap nilai akurat.
- Hak akses nilai aman.

## Fase 5 - Laporan dan Ekspor

Target:

- Laporan absensi.
- Laporan leger.
- Laporan data guru.
- Laporan data siswa.
- Ekspor PDF atau spreadsheet.

Prioritas:

- Format laporan rapi.
- Filter tahun ajaran, semester, kelas, rombel.
- Data dapat diaudit.

## Fase 6 - Stabilitas SaaS

Target:

- Backup dan restore.
- Observability.
- Optimasi performa.
- Hardening keamanan.
- Panduan deployment produksi.

## Fase Lanjutan

Fitur yang dapat dipertimbangkan setelah MVP stabil:

- Notifikasi orang tua.
- Portal orang tua lebih lengkap.
- Integrasi presensi perangkat.
- Integrasi Dapodik jika dibutuhkan.
- AI Generator setelah administrasi inti matang dan disetujui.

