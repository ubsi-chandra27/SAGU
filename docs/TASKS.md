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
| Tahun Ajaran | SELESAI | CRUD, aktivasi, validasi tanggal, dan soft delete tersedia untuk ADMIN. |
| Semester | SELESAI | CRUD, aktivasi, validasi tanggal, relasi tahun ajaran, dan soft delete tersedia untuk ADMIN. |
| Integrasi periode aktif pada topbar | SELESAI | Topbar dashboard membaca tahun ajaran dan semester aktif dari API. |
| Absensi Operasional MVP | SEDANG DIKERJAKAN | Prioritas berikutnya setelah Data Master Tahun Ajaran dan Semester. |

## Modul Belum Dikerjakan

| Modul | Status | Catatan |
|---|---|---|
| Mata Pelajaran | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Data Guru | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Data Siswa | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Kelas | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Rombel | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Penugasan Mengajar | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Pertemuan | BELUM DIKERJAKAN | Belum ada UI/API operasional. |
| Absensi | BELUM DIKERJAKAN | Belum ada pencatatan absensi operasional per pertemuan. |
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
- Data master pendukung absensi: Mata Pelajaran, Data Guru, Data Siswa, Kelas, Rombel, dan Penugasan Mengajar.
