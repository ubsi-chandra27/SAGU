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
| Verifikasi Dashboard Admin | SELESAI SECARA TEKNIS | Dashboard Admin memakai data database dasar, periode aktif, tindakan ke route nyata, breadcrumb tunggal, dan tanpa card di luar scope MVP. |
| Tahun Ajaran dan Semester | SELESAI SECARA TEKNIS | CRUD, aktivasi, validasi tanggal, soft delete, RBAC, UI/API, database, dan screenshot bukti halaman aktual sudah diverifikasi. |
| Koreksi breadcrumb | SELESAI SECARA TEKNIS | Dashboard root memakai breadcrumb tunggal; halaman periode memakai `Dashboard > Data Master > Tahun Ajaran & Semester`. |
| Pembersihan fitur Dashboard di luar scope | SELESAI SECARA TEKNIS | Card `Aktivitas Terbaru` dan `Pengumuman` tidak ditampilkan pada Dashboard Admin. |
| Sinkronisasi nama produk | SELESAI SECARA TEKNIS | Nama resmi tetap `SAGU - Sistem Administrasi Guru`; variasi nonresmi tidak ditemukan di repo aktif. |
| Screenshot bukti halaman aktual | SELESAI SECARA TEKNIS | Screenshot verifikasi tersedia di `docs/screenshots/verification/`. |
| Quality gate teknis | SELESAI SECARA TEKNIS | `tsc --noEmit`, lint, dan build PASS pada verifikasi Dashboard Admin. |
| Sinkronisasi commit lokal dengan GitHub | SEDANG DISELESAIKAN | Commit lokal verifikasi Dashboard Admin sudah dibuat, tetapi push sebelumnya timeout dan perlu retry aman. |

## Modul Belum Terverifikasi Sebagai Modul Lengkap

| Modul | Status | Catatan |
|---|---|---|
| Mata Pelajaran | BELUM TERVERIFIKASI SEBAGAI MODUL LENGKAP | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Data Guru | BELUM TERVERIFIKASI SEBAGAI MODUL LENGKAP | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Data Siswa | BELUM TERVERIFIKASI SEBAGAI MODUL LENGKAP | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, import bila relevan, dan pengujian modul lengkap. |
| Kelas | BELUM TERVERIFIKASI SEBAGAI MODUL LENGKAP | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Rombel | BELUM TERVERIFIKASI SEBAGAI MODUL LENGKAP | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Penugasan Mengajar | BELUM TERVERIFIKASI SEBAGAI MODUL LENGKAP | Route HTTP 200 belum cukup; perlu bukti CRUD, database, API, RBAC, dan pengujian modul lengkap. |
| Pertemuan | PRIORITAS BERIKUTNYA | Perlu diverifikasi sebagai bagian dari Absensi Operasional MVP. |
| Absensi | PRIORITAS BERIKUTNYA | Absensi Operasional MVP menjadi prioritas berikutnya. |
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
