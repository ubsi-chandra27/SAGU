# Modules Documentation

## Daftar Modul SAGU

Dokumen ini menjelaskan setiap modul dalam aplikasi SAGU, termasuk tujuan bisnis, fitur utama, dan role yang memiliki akses.

## Modul 1: Dashboard

### Tujuan Bisnis

Menyediakan ringkasan visual bagi setiap role pengguna untuk memahami status terkini operasional sekolah, termasuk statistik dan grafik ringkas.

### Fitur Utama

- Ringkasan statistik (jumlah guru, siswa, rombel, absensi hari ini).
- Navigasi cepat ke modul utama.
- Notifikasi dan pesan sistem.
- Widget informasi berdasarkan role (guru melihat tugas mengajar, wali kelas melihat rekap siswa).
- Grafik ringkasan berdasarkan role (admin: global, guru: kelasnya, wali kelas: rombelnya).

### Struktur Data Terkait

- `users`, `teachers`, `students`, `rombels`, `attendances`, `grades_dashboard` (read-only akses terbatas).

### Route Terkait

| Route | Akses |
|---|---|
| `GET /api/v1/dashboard/admin` | Admin |
| `GET /api/v1/dashboard/guru` | Guru |
| `GET /api/v1/dashboard/wali-kelas` | Wali Kelas |
| `GET /api/v1/dashboard/siswa` | Siswa |
| `GET /api/v1/dashboard/orang-tua` | Orang Tua |
| `GET /api/v1/statistik` | Admin |
| `GET /api/v1/statistik/guru` | Guru |
| `GET /api/v1/statistik/rombel/:id` | Wali Kelas |

### User Flow

Referensi: `docs/USER_FLOW.md` — Alur kerja setiap role dimulai dari login dan navigasi ke dashboard masing-masing.

### Role Akses

- Admin
- Guru
- Wali Kelas
- Siswa
- Orang Tua

### Kriteria Selesai

- Setiap role memiliki dashboard yang menampilkan data relevan.
- Widget statistik dapat diakses tanpa navigasi berlapis.
- Ringkasan statistik akurat dan real-time.
- Grafik menampilkan data sesuai konteks role.

---

## Modul 2: Data Guru

### Tujuan Bisnis

Mengelola data guru sekolah secara lengkap, termasuk informasi pribadi, penugasan mengajar, dan profil.

### Fitur Utama

- CRUD data guru (nama, NIP, email, telepon, alamat).
- Upload foto profil guru.
- Daftar mata pelajaran yang diampu (melalui teaching_assignments).
- Riwayat penugasan mengajar (guru → rombel → mata pelajaran → periode).
- Pencarian dan filter data guru.
- Ekspor data guru.

### Struktur Data Terkait

- `users`, `profiles`, `teachers`, `teaching_assignments`, `subjects`, `rombels`, `formative_assessments`, `summative_assessments`, `grades_dashboard`.

### Route Terkait

| Route | Akses |
|---|---|
| `GET /api/v1/data/guru` | Admin, Guru |
| `GET /api/v1/data/guru/:id` | Admin, Guru |
| `POST /api/v1/data/guru` | Admin |
| `PUT /api/v1/data/guru/:id` | Admin |
| `DELETE /api/v1/data/guru/:id` | Admin |
| `GET /api/v1/data/guru/export` | Admin |
| `GET /api/v1/penugasan/mengajar` | Admin, Guru |
| `POST /api/v1/penugasan/mengajar` | Admin |
| `PUT /api/v1/penugasan/mengajar/:id` | Admin |
| `DELETE /api/v1/penugasan/mengajar/:id` | Admin |

### User Flow

Referensi: `docs/USER_FLOW.md` — Admin mengelola data guru dari menu Data Guru; Guru melihat dan memperbarui profil sendiri.

### Role Akses

| Aksi | Admin | Guru |
|---|---|---|
| Lihat daftar | Ya | Ya |
| Lihat detail | Ya | Ya (data sendiri) |
| Buat | Ya | Tidak |
| Perbarui | Ya | Tidak (data sendiri) |
| Hapus | Ya | Tidak |

### Kriteria Selesai

- Data guru dapat dikelola lengkap oleh Admin.
- Guru dapat melihat dan memperbarui data pribadinya.
- Pencarian dan filter berfungsi untuk dataset besar.

---

## Modul 3: Data Siswa

### Tujuan Bisnis

Mengelola data siswa sekolah, termasuk informasi pribadi, rombel aktif, dan data orang tua.

### Fitur Utama

- CRUD data siswa (nama, NIS, NISN, tempat tanggal lahir, alamat).
- Upload foto profil siswa.
- Pencarian dan filter data siswa.
- Ekspor data siswa.
- Relasi siswa dengan rombel aktif.
- Relasi siswa dengan akun orang tua.

### Struktur Data Terkait

- `users`, `profiles`, `students`, `rombels`, `parents`, `teaching_assignments`.

### Route Terkait

| Route | Akses |
|---|---|
| `GET /api/v1/data/siswa` | Admin, Guru (kelasnya), Wali Kelas (rombelnya) |
| `GET /api/v1/data/siswa/:id` | Admin, Guru, Wali Kelas, Siswa (data sendiri) |
| `POST /api/v1/data/siswa` | Admin |
| `PUT /api/v1/data/siswa/:id` | Admin |
| `DELETE /api/v1/data/siswa/:id` | Admin |
| `GET /api/v1/data/siswa/export` | Admin |
| `GET /api/v1/orang-tua/anak` | Orang Tua |
| `GET /api/v1/orang-tua/anak/:id/absensi` | Orang Tua |
| `GET /api/v1/orang-tua/anak/:id/nilai` | Orang Tua |
| `GET /api/v1/siswa/profil` | Siswa |
| `GET /api/v1/siswa/jadwal` | Siswa |
| `GET /api/v1/siswa/absensi` | Siswa |
| `GET /api/v1/siswa/nilai` | Siswa |

### User Flow

Referensi: `docs/USER_FLOW.md` — Admin mengelola data siswa; Siswa melihat data diri sendiri; Orang Tua melihat data anaknya melalui menu Anak.

### Role Akses

| Aksi | Admin | Guru | Wali Kelas | Siswa | Orang Tua |
|---|---|---|---|---|---|
| Lihat daftar | Ya | Ya (kelasnya) | Ya (rombelnya) | Tidak | Tidak |
| Lihat detail | Ya | Ya | Ya | Ya (data sendiri) | Ya (anaknya) |
| Buat | Ya | Tidak | Tidak | Tidak | Tidak |
| Perbarui | Ya | Tidak | Tidak | Tidak | Tidak |
| Hapus | Ya | Tidak | Tidak | Tidak | Tidak |

### Kriteria Selesai

- Data siswa dapat dikelola lengkap oleh Admin.
- Siswa dan orang tua hanya dapat mengakses data diri/anak.
- Relasi rombel dan orang tua terpelihara dengan benar.

---

## Modul 4: Rombel

### Tujuan Bisnis

Mengelola struktur kelas dan rombel sekolah, termasuk penugasan wali kelas dan penempatan siswa.

### Fitur Utama

- CRUD kelas (X, XI, XII, dan lainnya).
- CRUD rombel per tahun ajaran dan semester.
- Penugasan wali kelas ke rombel (menggunakan teaching_assignments).
- Penempatan siswa ke rombel.
- Daftar siswa per rombel.
- Filter berdasarkan tahun ajaran, semester, kelas.

### Struktur Data Terkait

- `classes`, `rombels`, `academic_years`, `semesters`, `teaching_assignments`, `students`.

### Route Terkait

| Route | Akses |
|---|---|
| `GET /api/v1/rombel` | Admin, Guru, Wali Kelas (terbatas pada relasi) |
| `GET /api/v1/rombel/:id` | Admin, Guru (rombelnya), Wali Kelas |
| `POST /api/v1/rombel` | Admin |
| `PUT /api/v1/rombel/:id` | Admin |
| `DELETE /api/v1/rombel/:id` | Admin |
| `PUT /api/v1/rombel/:id/wali-kelas` | Admin |

### User Flow

Referensi: `docs/USER_FLOW.md` — Admin membuat dan mengelola rombel; Wali Kelas melihat rombel yang ditugaskan.

### Role Akses

| Aksi | Admin | Guru | Wali Kelas |
|---|---|---|---|
| Lihat daftar | Ya | Ya (rombel mengajar) | Ya (rombelnya) |
| Buat | Ya | Tidak | Tidak |
| Perbarui | Ya | Tidak | Ya (rombelnya) |
| Hapus | Ya | Tidak | Tidak |
| Tugaskan wali kelas | Ya | Tidak | Tidak |
| Lihat daftar siswa | Ya | Ya (kelasnya) | Ya (rombelnya) |

### Kriteria Selesai

- Struktur kelas dan rombel dapat dibuat dan dikelola oleh Admin.
- Penugasan wali kelas berfungsi dengan benar.
- Siswa dapat ditempatkan dan dipindahkan antar rombel.

---

## Modul 5: Absensi

### Tujuan Bisnis

Mencatat kehadiran siswa setiap hari pertemuan atau per tanggal, memungkinkan guru dan wali kelas memantau kehadiran.

### Fitur Utama

- Catat absensi per tanggal untuk seluruh siswa dalam rombel.
- Status kehadiran: hadir, izin, sakit, alpa, terlambat.
- Catatan tambahan untuk alasan ketidakhadiran.
- Rekap absensi harian per kelas.
- Rekap absensi per siswa (historis).
- Filter berdasarkan tanggal, rombel, dan status.

### Struktur Data Terkait

- `attendances`, `students`, `rombels`, `teaching_assignments`.
- Akses dibatasi berdasarkan relasi: Guru hanya akses siswa di kelas/rombel yang ditugaskan.

### Route Terkait

| Route | Akses |
|---|---|
| `GET /api/v1/absensi` | Guru (kelasnya), Wali Kelas (rombelnya), Siswa (data sendiri), Orang Tua (anaknya) |
| `GET /api/v1/absensi/:id` | Guru, Wali Kelas, Siswa, Orang Tua (terbatas pada relasi) |
| `POST /api/v1/absensi` | Guru (kelasnya) |
| `PUT /api/v1/absensi/:id` | Guru (kelasnya) |
| `DELETE /api/v1/absensi/:id` | Guru (kelasnya) |
| `GET /api/v1/absensi/rekap` | Guru, Wali Kelas, Admin |

### User Flow

Referensi: `docs/USER_FLOW.md` — Guru mencatat absensi per pertemuan; Wali Kelas melihat rekap; Siswa dan Orang Tua melihat data diri/anak.

### Role Akses

| Aksi | Admin | Guru | Wali Kelas | Siswa | Orang Tua |
|---|---|---|---|---|---|
| Lihat daftar | Ya | Ya (kelasnya) | Ya (rombelnya) | Ya (data sendiri) | Ya (anaknya) |
| Buat (catat) | Tidak | Ya (kelasnya) | Tidak | Tidak | Tidak |
| Perbarui | Tidak | Ya (kelasnya) | Tidak | Tidak | Tidak |
| Hapus | Tidak | Ya (kelasnya) | Tidak | Tidak | Tidak |
| Rekap | Ya | Ya | Ya | Tidak | Tidak |

### Kriteria Selesai

- Guru dapat mencatat absensi dengan mudah untuk seluruh siswa.
- Rekap absensi akurat dan dapat difilter.
- Siswa dan orang tua hanya melihat data diri/anak.

---

## Modul 6: Leger Penilaian (Assessment & Grading)

### Tujuan Bisnis

Mengelola nilai siswa secara sistematis dengan komponen penilaian yang fleksibel, memungkinkan guru menginput dan wali kelas memantau nilai.

### Fitur Utama

- Komponen penilaian: harian, tengah semester, akhir semester, UTS, UAS.
- Input nilai per siswa per mata pelajaran.
- Perhitungan nilai akhir otomatis berdasarkan bobot komponen.
- Leger per siswa (detail lengkap nilai).
- Leger per rombel (rekap nilai seluruh siswa).
- Update dan hapus nilai.
- Filter berdasarkan mata pelajaran, rombel, semester, dan tahun ajaran.

### Role Akses

| Aksi | Admin | Guru | Wali Kelas | Siswa | Orang Tua |
|---|---|---|---|---|---|
| Lihat leger | Ya | Ya (mata pelajarannya) | Ya (rombelnya) | Ya (data sendiri) | Ya (anaknya) |
| Input nilai | Tidak | Ya (mata pelajarannya) | Tidak | Tidak | Tidak |
| Perbarui nilai | Tidak | Ya (mata pelajarannya) | Tidak | Tidak | Tidak |
| Hapus nilai | Tidak | Ya (mata pelajarannya) | Tidak | Tidak | Tidak |
| Rekap nilai | Ya | Ya | Ya | Tidak | Tidak |

### Kriteria Selesai

- Guru dapat menginput nilai dengan komponen yang fleksibel.
- Perhitungan nilai akhir akurat.
- Leger dapat diakses sesuai hak akses role.

---

## Modul 7: Agenda Mengajar

### Tujuan Bisnis

Menyediakan perencanaan dan pencatatan kegiatan mengajar guru, memungkinkan guru terorganisir dan wali kelas memantau proses belajar.

### Fitur Utama

- CRUD agenda mengajar (tanggal, topik, deskripsi, waktu).
- Tampilan agenda per guru (mengajar).
- Tampilan agenda per rombel (siswa).
- Kalender atau daftar agenda harian/mingguan.
- Filter berdasarkan mata pelajaran, rombel, dan tanggal.

### Role Akses

| Aksi | Admin | Guru | Wali Kelas | Siswa | Orang Tua |
|---|---|---|---|---|---|
| Lihat agenda | Ya | Ya (mengajarnya) | Ya (rombelnya) | Ya (rombelnya) | Tidak |
| Buat agenda | Tidak | Ya | Tidak | Tidak | Tidak |
| Perbarui agenda | Tidak | Ya (miliknya) | Tidak | Tidak | Tidak |
| Hapus agenda | Tidak | Ya (miliknya) | Tidak | Tidak | Tidak |

### Kriteria Selesai

- Guru dapat membuat dan mengelola agenda mengajar.
- Siswa dan wali kelas dapat melihat agenda rombel mereka.
- Admin dapat melihat semua agenda untuk monitoring.

---

## Modul 8: Laporan

### Tujuan Bisnis

Menghasilkan laporan administrasi sekolah yang akurat dan mudah dipahami untuk kebutuhan kepala sekolah dan administrasi.

### Fitur Utama

- Laporan data guru (daftar guru, ringkasan penugasan).
- Laporan data siswa (daftar siswa per kelas, rombel).
- Laporan absensi (rekap harian, per kelas, per siswa).
- Laporan leger (rekap nilai per rombel, per mata pelajaran).
- Filter berdasarkan tahun ajaran, semester, kelas, rombel.
- Ekspor ke PDF dan/atau spreadsheet (tergantung keputusan teknis).

### Role Akses

| Jenis Laporan | Admin | Guru | Wali Kelas |
|---|---|---|---|
| Data guru | Ya | Ya (terbatas) | Tidak |
| Data siswa | Ya | Ya (terbatas) | Ya (rombelnya) |
| Absensi | Ya | Ya (kelasnya) | Ya (rombelnya) |
| Leger | Ya | Ya (mata pelajarannya) | Ya (rombelnya) |
| Ekspor | Ya | Ya (terbatas) | Ya (terbatas) |

### Kriteria Selesai

- Laporan tersedia untuk setiap jenis data utama.
- Filter bekerja dengan benar.
- Ekspor menghasilkan file yang terbaca dan rapi.

---

## Modul 9: Pengaturan

### Tujuan Bisnis

Menyediakan konfigurasi dasar untuk sekolah, pengguna, role, dan sistem secara keseluruhan.

### Fitur Utama

- Pengaturan sekolah (nama, alamat, telepon, logo).
- Pengelolaan tahun ajaran (CRUD).
- Pengelolaan semester (CRUD).
- Pengelolaan pengguna (CRUD).
- Pengelolaan role dan permission.
- Profil pribadi pengguna (update profil, ubah password).

### Role Akses

| Fitur | Admin | Others |
|---|---|---|
| Pengaturan sekolah | CRUD | - |
| Tahun ajaran | CRUD | Baca |
| Semester | CRUD | Baca |
| Pengguna | CRUD | - |
| Role | CRUD | - |
| Profil sendiri | Baca/Ubah | Baca/Ubah |
| Ubah password | Ya | Ya |

### Kriteria Selesai

- Admin dapat mengkonfigurasi semua pengaturan sistem.
- Pengguna dapat mengelola profil dan password sendiri.
- Perubahan pengaturan terdokumentasi.

---

## Modul 10: Audit Log (Backend)

### Tujuan Bisnis

Mencatat semua aktivitas penting dalam sistem untuk jejak pelacakan dan keamanan.

### Fitur Utama

- Pencatatan aksi create, update, delete pada data master dan akademik.
- Pencatatan login dan logout.
- Detail perubahan nilai (lama dan baru).
- Pencatatan alamat IP dan user agent.
- Daftar log audit dengan filter dan pencarian.

### Role Akses

- Admin

### Kriteria Selesai

- Setiap aksi penting tercatat.
- Log dapat dicari dan difilter.
- Log tidak dapat dihapus oleh pengguna biasa.