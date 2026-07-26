# Routes

## Daftar Route SAGU

Dokumen ini mendefinisikan route API dan route frontend untuk aplikasi SAGU. Semua route API menggunakan prefiks `/api/v1`. Route dilindungi oleh middleware autentikasi dan otorisasi RBAC.

## Konvensi Penamaan

- Route menggunakan Bahasa Inggris dengan kebiasaan kecil kata (lowercase).
- Kata pemisah antar segmen menggunakan tanda hubung (`-`).
- Route RESTful mengikuti pola CRUD standar.
- Route dilindungi oleh middleware autentikasi kecuali route publik (login, register).

## Route UI Aktual

Route berikut sudah tersedia pada implementasi saat ini.

| Route | Deskripsi | Akses |
|---|---|---|
| `/login` | Halaman login dengan branding sekolah | Publik |
| `/dashboard/admin` | Dashboard Admin operasional: periode aktif, ringkasan data master, kesiapan data, dan akses cepat ke route nyata | Admin |
| `/dashboard/guru` | Dashboard Guru | Guru |
| `/dashboard/admin/pengaturan/branding-login` | Pengaturan branding halaman login | Admin |
| `/dashboard/admin/data-master/tahun-ajaran` | Manajemen Tahun Ajaran dan Semester | Admin |
| `/dashboard/admin/data-master/mata-pelajaran` | Manajemen Mata Pelajaran | Admin |
| `/dashboard/admin/data-master/guru` | Manajemen Data Guru | Admin |
| `/dashboard/admin/data-master/siswa` | Manajemen Data Siswa dan import CSV | Admin |
| `/dashboard/admin/data-master/kelas` | Manajemen Kelas | Admin |
| `/dashboard/admin/data-master/rombel` | Manajemen Rombel | Admin |
| `/dashboard/admin/data-master/penugasan-mengajar` | Manajemen Penugasan Mengajar | Admin |
| `/dashboard/admin/rekap-absensi` | Rekap Absensi Admin | Admin |
| `/dashboard/admin/rekap-absensi/cetak` | Cetak rekap absensi periode/filter | Admin |
| `/dashboard/admin/rekap-absensi/pertemuan/[meetingId]/cetak` | Cetak absensi per pertemuan | Admin |
| `/dashboard/guru/pertemuan` | Daftar dan tambah pertemuan Guru | Guru |
| `/dashboard/guru/pertemuan/[meetingId]/absensi` | Absensi cepat per pertemuan | Guru pemilik penugasan |
| `/dashboard/guru/pertemuan/[meetingId]/absensi/cetak` | Cetak absensi per pertemuan | Guru pemilik penugasan |

## Route API Aktual

Route berikut sudah tersedia di kode saat ini dan dipakai oleh modul Data Master serta Absensi Operasional MVP.

### Data Master Admin Aktual

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET, POST | `/api/v1/admin/master/subjects` | Daftar dan tambah mata pelajaran | Admin |
| GET, PUT, DELETE | `/api/v1/admin/master/subjects/[id]` | Detail, ubah, dan arsip mata pelajaran | Admin |
| GET, POST | `/api/v1/admin/master/teachers` | Daftar dan tambah guru beserta akun GURU | Admin |
| GET, PUT, DELETE | `/api/v1/admin/master/teachers/[id]` | Detail, ubah, dan arsip guru | Admin |
| GET, POST | `/api/v1/admin/master/classes` | Daftar dan tambah kelas | Admin |
| GET, PUT, DELETE | `/api/v1/admin/master/classes/[id]` | Detail, ubah, dan arsip kelas | Admin |
| GET, POST | `/api/v1/admin/master/rombels` | Daftar dan tambah rombel | Admin |
| GET, PUT, DELETE | `/api/v1/admin/master/rombels/[id]` | Detail, ubah, dan arsip rombel | Admin |
| GET, POST | `/api/v1/admin/master/students` | Daftar dan tambah siswa manual | Admin |
| GET, PUT, DELETE | `/api/v1/admin/master/students/[id]` | Detail, ubah, dan arsip siswa | Admin |
| GET | `/api/v1/admin/master/students/template` | Unduh template import siswa CSV | Admin |
| POST | `/api/v1/admin/master/students/import-preview` | Validasi preview import siswa CSV | Admin |
| POST | `/api/v1/admin/master/students/import-commit` | Simpan baris import siswa valid | Admin |
| GET, POST | `/api/v1/admin/master/teaching-assignments` | Daftar dan tambah penugasan mengajar | Admin |
| GET, PUT, DELETE | `/api/v1/admin/master/teaching-assignments/[id]` | Detail, ubah, dan arsip penugasan mengajar | Admin |

### Absensi Operasional Aktual

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/guru/assignments` | Daftar penugasan milik guru login | Guru |
| GET, POST | `/api/v1/guru/meetings` | Daftar dan tambah pertemuan guru | Guru |
| GET | `/api/v1/guru/meetings/[id]` | Detail pertemuan milik guru | Guru pemilik |
| GET, PUT | `/api/v1/guru/meetings/[id]/attendance` | Ambil dan simpan absensi cepat per pertemuan | Guru pemilik |
| GET | `/api/v1/admin/attendance/recap` | Rekap absensi dengan filter periode, rombel, mapel, tanggal | Admin |
| GET | `/api/v1/admin/attendance/meetings/[id]` | Detail/cetak absensi satu pertemuan | Admin |

## Route Publik

### Autentikasi

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Masuk dengan username dan password | Publik |
| POST | `/api/v1/auth/logout` | Keluar dari sesi | Autentikasi |
| POST | `/api/v1/auth/refresh` | Refresh token sesi | Autentikasi |
| GET | `/api/v1/auth/me` | Dapatkan informasi pengguna saat ini | Autentikasi |
| POST | `/api/v1/auth/forgot-password` | Minta reset password | Publik |
| POST | `/api/v1/auth/reset-password` | Reset password dengan token | Publik |

## Route Dashboard

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/dashboard/admin` | Ringkasan dashboard admin | Admin |
| GET | `/api/v1/dashboard/guru` | Ringkasan dashboard guru | Guru |
| GET | `/api/v1/dashboard/wali-kelas` | Ringkasan dashboard wali kelas | Wali Kelas |
| GET | `/api/v1/dashboard/siswa` | Ringkasan dashboard siswa | Siswa |
| GET | `/api/v1/dashboard/orang-tua` | Ringkasan dashboard orang tua | Orang Tua |

## Route Data Master

### Guru

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/data/guru` | Daftar guru | Admin, Guru |
| GET | `/api/v1/data/guru/:id` | Detail guru | Admin, Guru |
| POST | `/api/v1/data/guru` | Buat guru baru | Admin |
| PUT | `/api/v1/data/guru/:id` | Perbarui guru | Admin |
| DELETE | `/api/v1/data/guru/:id` | Hapus lunak guru | Admin |
| GET | `/api/v1/data/guru/export` | Ekspor data guru | Admin |

### Siswa

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/data/siswa` | Daftar siswa | Admin, Guru, Wali Kelas, Siswa |
| GET | `/api/v1/data/siswa/:id` | Detail siswa | Admin, Guru, Wali Kelas, Siswa |
| POST | `/api/v1/data/siswa` | Buat siswa baru | Admin |
| PUT | `/api/v1/data/siswa/:id` | Perbarui siswa | Admin |
| DELETE | `/api/v1/data/siswa/:id` | Hapus lunak siswa | Admin |
| GET | `/api/v1/data/siswa/export` | Ekspor data siswa | Admin |

### Orang Tua

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/data/orang-tua` | Daftar orang tua | Admin |
| GET | `/api/v1/data/orang-tua/:id` | Detail orang tua | Admin |
| POST | `/api/v1/data/orang-tua` | Buat akun orang tua | Admin |
| PUT | `/api/v1/data/orang-tua/:id` | Perbarui orang tua | Admin |
| DELETE | `/api/v1/data/orang-tua/:id` | Hapus lunak orang tua | Admin |

### Tahun Ajaran

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/tahun-ajaran` | Daftar tahun ajaran, mendukung `includeArchived=true` | Admin |
| GET | `/api/v1/tahun-ajaran/active` | Tahun ajaran dan semester aktif untuk topbar dashboard | Autentikasi |
| GET | `/api/v1/tahun-ajaran/:id` | Detail tahun ajaran | Admin |
| POST | `/api/v1/tahun-ajaran` | Buat tahun ajaran baru | Admin |
| PUT | `/api/v1/tahun-ajaran/:id` | Perbarui tahun ajaran | Admin |
| DELETE | `/api/v1/tahun-ajaran/:id` | Hapus lunak tahun ajaran | Admin |
| POST | `/api/v1/tahun-ajaran/:id/activate` | Aktifkan tahun ajaran dan nonaktifkan tahun ajaran lain | Admin |

### Semester

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/semester` | Daftar semester berdasarkan tahun ajaran, mendukung `academicYearId` dan `includeArchived=true` | Admin |
| GET | `/api/v1/semester/:id` | Detail semester | Admin |
| POST | `/api/v1/semester` | Buat semester baru | Admin |
| PUT | `/api/v1/semester/:id` | Perbarui semester | Admin |
| DELETE | `/api/v1/semester/:id` | Hapus lunak semester | Admin |
| POST | `/api/v1/semester/:id/activate` | Aktifkan semester dan tahun ajaran terkait | Admin |

### Kelas

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/kelas` | Daftar kelas | Admin, Guru, Wali Kelas |
| GET | `/api/v1/kelas/:id` | Detail kelas | Admin, Guru, Wali Kelas |
| POST | `/api/v1/kelas` | Buat kelas baru | Admin |
| PUT | `/api/v1/kelas/:id` | Perbarui kelas | Admin |
| DELETE | `/api/v1/kelas/:id` | Hapus lunak kelas | Admin |

### Rombel

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/rombel` | Daftar rombel (terbatas pada rombel yang ditugaskan) | Guru (rombel mengajarnya), Wali Kelas (rombelnya), Siswa (rombelnya) |
| GET | `/api/v1/rombel/:id` | Detail rombel | Admin, Guru (rombelnya), Wali Kelas (rombelnya) |
| POST | `/api/v1/rombel` | Buat rombel baru | Admin |
| PUT | `/api/v1/rombel/:id` | Perbarui rombel | Admin |
| DELETE | `/api/v1/rombel/:id` | Hapus lunak rombel | Admin |
| PUT | `/api/v1/rombel/:id/wali-kelas` | Tugaskan wali kelas | Admin |

### Mata Pelajaran

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/mata-pelajaran` | Daftar mata pelajaran | Semua Role |
| GET | `/api/v1/mata-pelajaran/:id` | Detail mata pelajaran | Semua Role |
| POST | `/api/v1/mata-pelajaran` | Buat mata pelajaran baru | Admin |
| PUT | `/api/v1/mata-pelajaran/:id` | Perbarui mata pelajaran | Admin |
| DELETE | `/api/v1/mata-pelajaran/:id` | Hapus lunak mata pelajaran | Admin |

## Route Penugasan

### Penugasan Mengajar

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/penugasan/mengajar` | Daftar penugasan mengajar | Admin, Guru |
| GET | `/api/v1/penugasan/mengajar/:id` | Detail penugasan | Admin, Guru |
| POST | `/api/v1/penugasan/mengajar` | Buat penugasan baru | Admin |
| PUT | `/api/v1/penugasan/mengajar/:id` | Perbarui penugasan | Admin |
| DELETE | `/api/v1/penugasan/mengajar/:id` | Hapus penugasan | Admin |

### Penugasan Wali Kelas

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/penugasan/wali-kelas` | Daftar penugasan wali kelas | Admin |
| POST | `/api/v1/penugasan/wali-kelas` | Buat penugasan wali kelas | Admin |
| DELETE | `/api/v1/penugasan/wali-kelas/:id` | Hapus penugwal wali kelas | Admin |

## Route Absensi

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/absensi` | Daftar absensi | Guru, Wali Kelas, Siswa, Orang Tua (terbatas) |
| GET | `/api/v1/absensi/:id` | Detail absensi | Guru, Wali Kelas, Siswa, Orang Tua (terbatas) |
| POST | `/api/v1/absensi` | Catat absensi | Guru |
| PUT | `/api/v1/absensi/:id` | Perbarui absensi | Guru |
| DELETE | `/api/v1/absensi/:id` | Hapus absensi | Guru |
| GET | `/api/v1/absensi/rekap` | Rekap absensi | Guru, Wali Kelas, Admin |

## Route Agenda Mengajar

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/agenda` | Daftar agenda mengajar | Guru, Wali Kelas, Siswa |
| GET | `/api/v1/agenda/:id` | Detail agenda | Guru (mengajarnya), Wali Kelas (rombelnya), Siswa (rombelnya) |
| POST | `/api/v1/agenda` | Buat agenda baru | Guru |
| PUT | `/api/v1/agenda/:id` | Perbarui agenda | Guru (miliknya) |
| DELETE | `/api/v1/agenda/:id` | Hapus agenda | Guru (miliknya) |

## Route Penilaian dan Leger

### Nilai

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/leger` | Daftar nilai / leger | Admin, Guru, Wali Kelas, Siswa, Orang Tua (terbatas) |
| GET | `/api/v1/leger/:id` | Detail nilai | Admin, Guru, Wali Kelas, Siswa, Orang Tua (terbatas) |
| POST | `/api/v1/leger` | Input nilai | Guru |
| PUT | `/api/v1/leger/:id` | Perbarui nilai | Guru |
| DELETE | `/api/v1/leger/:id` | Hapus nilai | Guru |
| GET | `/api/v1/leger/rekap` | Rekap nilai per rombel | Guru, Wali Kelas, Admin |

### Komponen Penilaian

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/leger/komponen` | Daftar komponen penilaian | Admin, Guru |
| POST | `/api/v1/leger/komponen` | Buat komponen penilaian | Admin |
| PUT | `/api/v1/leger/komponen/:id` | Perbarui komponen penilaian | Admin |
| DELETE | `/api/v1/leger/komponen/:id` | Hapus komponen penilaian | Admin |

## Route Laporan

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/laporan/guru` | Laporan data guru | Admin |
| GET | `/api/v1/laporan/siswa` | Laporan data siswa | Admin |
| GET | `/api/v1/laporan/absensi` | Laporan absensi | Admin, Guru, Wali Kelas |
| GET | `/api/v1/laporan/leger` | Laporan leger | Admin, Guru, Wali Kelas |
| GET | `/api/v1/laporan/export` | Ekspor laporan | Admin, Guru, Wali Kelas |

## Route Pengaturan

### Pengaturan Sekolah

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/pengaturan` | Dapatkan pengaturan sekolah | Semua Role |
| PUT | `/api/v1/pengaturan` | Perbarui pengaturan sekolah | Admin |

### Manajemen Pengguna

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/pengguna` | Daftar pengguna | Admin |
| GET | `/api/v1/pengguna/:id` | Detail pengguna | Admin |
| POST | `/api/v1/pengguna` | Buat pengguna baru | Admin |
| PUT | `/api/v1/pengguna/:id` | Perbarui pengguna | Admin |
| DELETE | `/api/v1/pengguna/:id` | Nonaktifkan pengguna | Admin |

### Manajemen Role

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/role` | Daftar role dan permission | Admin |
| POST | `/api/v1/role` | Buat role baru | Admin |
| PUT | `/api/v1/role/:id` | Perbarui role | Admin |
| DELETE | `/api/v1/role/:id` | Hapus role | Admin |

### Profil Pengguna

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/profil` | Dapatkan profil pengguna saat ini | Autentikasi |
| PUT | `/api/v1/profil` | Perbarui profil pengguna | Autentikasi |
| PUT | `/api/v1/profil/password` | Ubah password | Autentikasi |

## Route Profil Orang Tua

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/orang-tua/anak` | Dapatkan daftar anak terhubung | Orang Tua |
| GET | `/api/v1/orang-tua/anak/:id/absensi` | Rekap absensi anak | Orang Tua |
| GET | `/api/v1/orang-tua/anak/:id/nilai` | Nilai anak | Orang Tua |

## Route Siswa

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/siswa/profil` | Profil siswa | Siswa |
| GET | `/api/v1/siswa/jadwal` | Jadwal mengajar siswa | Siswa |
| GET | `/api/v1/siswa/absensi` | Riwayat absensi siswa | Siswa |
| GET | `/api/v1/siswa/nilai` | Nilai siswa | Siswa |

## Route Statistik (Dashboard)

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/statistik` | Statistik global (ringkasan dashboard) | Admin |
| GET | `/api/v1/statistik/guru` | Statistik untuk guru yang bersangkutan | Guru |
| GET | `/api/v1/statistik/rombel/:id` | Statistik untuk rombel yang ditugaskan | Wali Kelas |

## Route Penugasan

### Penugasan Mengajar (teaching_assignments)

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/penugasan/mengajar` | Daftar penugasan mengajar | Admin, Guru |
| GET | `/api/v1/penugasan/mengajar/:id` | Detail penugasan | Admin, Guru (miliknya) |
| POST | `/api/v1/penugasan/mengajar` | Buat penugasan baru | Admin |
| PUT | `/api/v1/penugasan/mengajar/:id` | Perbarui penugasan | Admin |
| DELETE | `/api/v1/penugasan/mengajar/:id` | Hapus penugasan | Admin |

### Penugasan Wali Kelas

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/penugasan/wali-kelas` | Daftar penugasan wali kelas | Admin |
| POST | `/api/v1/penugasan/wali-kelas` | Buat penugasan wali kelas | Admin |
| DELETE | `/api/v1/penugasan/wali-kelas/:id` | Hapus penugwal wali kelas | Admin |

## Route Backend Tambahan

### Audit Log

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/audit-log` | Daftar log audit | Admin |
| GET | `/api/v1/audit-log/:id` | Detail log audit | Admin |

### Statistik

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| GET | `/api/v1/statistik` | Statistik global (ringkasan dashboard) | Admin |
| GET | `/api/v1/statistik/guru` | Statistik untuk guru yang bersangkutan | Guru |
| GET | `/api/v1/statistik/rombel/:id` | Statistik untuk rombel yang ditugaskan | Wali Kelas |

## Catatan Penting

- Semua route memerlukan header `Authorization: Bearer <token>`.
- Role dan permission diverifikasi oleh middleware `authorize`.
- Response API menggunakan format JSON standar dengan field `success`, `message`, `data`, dan `error`.
- Pagination menggunakan parameter query `page` dan `per_page`.
- Filtering menggunakan parameter query sesuai kebutuhan (contoh: `?status=hadir&rombel_id=...`).
- Ekspor laporan menggunakan format query `?format=pdf` atau `?format=xlsx`.
- Akses data berdasarkan relasi role (Row Level Security): Guru hanya boleh mengakses data kelas dan rombel yang ditugaskan. Wali Kelas hanya boleh mengakses data rombel yang ditugaskan. Implementasi pembatasan ini pada application layer.
