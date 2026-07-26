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
| Absensi Operasional MVP | SELESAI | Alur minimum Data Master -> Penugasan Mengajar -> Pertemuan -> Absensi Cepat -> Rekap/Cetak tersedia. |

## Modul Belum Dikerjakan

| Modul | Status | Catatan |
|---|---|---|
| Mata Pelajaran | SELESAI | UI/API CRUD minimum tersedia untuk ADMIN. |
| Data Guru | SELESAI | UI/API CRUD minimum tersedia untuk ADMIN, termasuk pembuatan akun GURU. |
| Data Siswa | SELESAI | UI/API CRUD minimum tersedia untuk ADMIN, termasuk template CSV, preview import, dan commit import. |
| Kelas | SELESAI | UI/API CRUD minimum tersedia untuk ADMIN. |
| Rombel | SELESAI | UI/API CRUD minimum tersedia untuk ADMIN. |
| Penugasan Mengajar | SELESAI | UI/API CRUD minimum tersedia untuk ADMIN dan menjadi dasar scope Guru. |
| Pertemuan | SELESAI | Guru dapat membuat dan melihat pertemuan untuk penugasan miliknya. |
| Absensi | SELESAI | Guru dapat mencatat, mengedit, dan mencetak absensi per pertemuan; Admin dapat melihat rekap. |
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

- Jurnal Mengajar operasional setelah pertemuan.
- Penajaman laporan absensi lintas role setelah kebutuhan sekolah dikonfirmasi.
