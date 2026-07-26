# TASKS.md

Daftar status implementasi SAGU berdasarkan kondisi kode aktual.

## Status Progres Utama

| Modul | Status | Catatan |
|---|---|---|
| Login ADMIN dan GURU | SELESAI | Login berbasis username/password sudah tersedia untuk role ADMIN dan GURU. |
| Logout | SELESAI | Logout menghapus cookie sesi dari aplikasi. |
| Refresh token | SELESAI | Endpoint refresh token sudah tersedia dan memvalidasi user aktif. |
| Middleware dan RBAC | SELESAI | Route dashboard ADMIN/GURU diproteksi middleware dan role. |
| Branding Login | SELESAI | Branding halaman login dan pengaturan admin tersedia. |
| Dashboard Shell | SELESAI | Sidebar, topbar, breadcrumb, collapse sidebar, dan mobile drawer tersedia. |
| Verifikasi Dashboard Admin | SELESAI | Dashboard Admin memakai data PostgreSQL aktual, toast login satu kali, shell/sidebar modern, kesiapan operasional, empty state jujur, screenshot runtime, dan tanpa data dummy. |
| Penyempurnaan visual Shadcn Space | SELESAI | Pola visual Shadcn Space diadaptasi selektif tanpa menyalin template penuh atau menambah dependency. |
| Tahun Ajaran dan Semester | SELESAI | CRUD, aktivasi, validasi tanggal, soft delete, RBAC, UI/API, database, dan screenshot bukti halaman aktual sudah diverifikasi. |
| Koreksi breadcrumb | SELESAI | Dashboard root memakai breadcrumb tunggal; halaman periode memakai `Dashboard > Data Master > Tahun Ajaran & Semester`. |
| Pembersihan fitur Dashboard di luar scope | SELESAI | Card `Aktivitas Terbaru` dan `Pengumuman` tidak ditampilkan pada Dashboard Admin. |
| Sinkronisasi nama produk | SELESAI | Nama resmi tetap `SAGU - Sistem Administrasi Guru`; variasi nonresmi tidak ditemukan di repo aktif. |
| Screenshot bukti halaman aktual | SELESAI | Screenshot verifikasi tersedia di `docs/screenshots/verification/` dan `docs/screenshots/dashboard-shadcn-space/`. |
| Quality gate teknis | SELESAI | `tsc --noEmit`, lint, dan build PASS pada verifikasi Dashboard Admin. |
| Sinkronisasi commit lokal dengan GitHub | SELESAI | Commit verifikasi Dashboard Admin dan commit penutupan sudah berhasil dipush ke `origin/main`. |

## Modul Belum Terverifikasi Sebagai Modul Lengkap

| Modul | Status | Catatan |
|---|---|---|
| Mata Pelajaran | SEDANG DIKERJAKAN | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Data Guru | SEDANG DIKERJAKAN | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Data Siswa | SEDANG DIKERJAKAN | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, import bila relevan, dan pengujian modul lengkap. |
| Kelas | SEDANG DIKERJAKAN | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Rombel | SEDANG DIKERJAKAN | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Penugasan Mengajar | SEDANG DIKERJAKAN | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Pertemuan | SEDANG DIKERJAKAN | Perlu diverifikasi sebagai bagian dari Absensi Operasional MVP. |
| Absensi | SEDANG DIKERJAKAN | Absensi Operasional MVP menjadi prioritas berikutnya. |
| Jurnal Mengajar | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| CP | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Lingkup Materi | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Tujuan Pembelajaran | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Penilaian Formatif | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Penilaian Sumatif | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Leger | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Rapor | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Laporan lengkap | BELUM DIKERJAKAN | Belum ada UI/API operasional. |

## Prioritas Berikutnya

- Absensi Operasional MVP.
- Audit Data Master minimum untuk absensi.
