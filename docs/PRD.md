# Product Requirements Document (PRD)

## Ringkasan Produk

SAGU (Sistem Administrasi Guru) adalah aplikasi web SaaS yang dirancang untuk membantu sekolah mengelola administrasi guru, siswa, dan operasional akademik harian. Aplikasi ini menyediakan dashboard berbasis peran, modul data master, pencatatan absensi, penilaian, agenda mengajar, serta laporan administrasi sekolah.

## Visi

Menjadi sistem administrasi sekolah yang mudah dipakai, aman, dan andal untuk mengelola data akademik dan operasional sekolah sehari-hari.

## Misi

- Menyediakan satu platform terpusat untuk administrasi sekolah.
- Memastikan setiap role pengguna memiliki akses sesuai kebutuhan operasionalnya.
- Menjaga keamanan dan kerahasiaan data siswa dan guru.
- Menghasilkan laporan yang akurat dan dapat ditelusuri.

## Lingkup MVP

### Modul Inti

1. **Dashboard Admin** — Ringkasan data sekolah, statistik pengguna, dan navigasi administratif.
2. **Dashboard Guru** — Papan tugas mengajar, absensi kelas, dan penilaian.
3. **Dashboard Wali Kelas** — Pemantauan siswa, rekap absensi, dan leger kelas.
4. **Dashboard Siswa** — Informasi pribadi, jadwal, absensi, dan nilai.
5. **Data Guru** — CRUD data guru, profil, dan penugasan mengajar.
6. **Data Siswa** — CRUD data siswa, profil, dan informasi orang tua.
7. **Rombel** — Pengelolaan kelas, rombel, dan penugasan wali kelas.
8. **Absensi** — Pencatatan kehadiran siswa per pertemuan atau hari.
9. **Leger Penilaian** — Input, rekap, dan kelola nilai siswa per mata pelajaran.
10. **Agenda Mengajar** — Penjadwalan dan pencatatan kegiatan mengajar guru.
11. **Laporan** — Generate laporan data guru, siswa, absensi, dan leger.
12. **Pengaturan** — Konfigurasi sekolah, tahun ajaran, semester, role, dan hak akses.

### Fitur yang Tidak Termasuk pada Fase MVP

- AI Generator
- Pembayaran sekolah
- LMS lengkap (kompetensi belajar daring)
- Ujian online kompleks
- Integrasi eksternal real-time (misalnya Dapodik, eksternalservice lainnya)

## User Persona

### Admin

- Mengelola seluruh data master, pengguna, konfigurasi, dan laporan global.
- Memiliki akses penuh ke seluruh modul kecuali data pribadi pengguna lain yang bukan bagian dari administrasi.

### Guru

- Mengelola agenda mengajar untuk mata pelajaran dan rombel yang ditugaskan.
- Mencatat absensi siswa pada kelas yang diajar.
- Menginput nilai pada mata pelajaran yang ditugaskan.
- Melihat data pribadi dan jadwal mengajarnya sendiri.

### Wali Kelas

- Memantau siswa dalam rombel yang ditugaskan.
- Melihat rekap absensi dan leger penilaian kelasnya.
- Menghasilkan laporan kelas untuk keperluan rapor dan pembinaan.

### Siswa

- Melihat data pribadi, jadwal, absensi, dan nilai.
- Mengakses informasi pengumuman terbatas dari sekolah.

### Orang Tua

- Melihat ringkasan kehadiran anaknya.
- Melihat nilai anaknya yang sudah dipublikasikan.
- Mengakses informasi terbatas yang terkait dengan anaknya saja.

## User Story Utama

### Admin

1. Sebagai Admin, saya ingin mengelola data guru agar informasi guru selalu mutakhir.
2. Sebagai Admin, saya ingin mengelola data siswa agar data akademik lengkap.
3. Sebagai Admin, saya ingin mengelola rombel dan penugasan wali kelas agar struktur kelas jelas.
4. Sebagai Admin, saya ingin mengelola tahun ajaran dan semester agar penjadwalan akurat.
5. Sebagai Admin, saya ingin menghasilkan laporan global agar dapat memantau kinerja sekolah.
6. Sebagai Admin, saya ingin mengelola pengguna dan hak akses agar keamanan data terjaga.

### Guru

1. Sebagai Guru, saya ingin mencatat absensi siswa pada kelas saya agar data kehadiran akurat.
2. Sebagai Guru, saya ingin menginput nilai siswa pada mata pelajaran saya agar leger penilaian lengkap.
3. Sebagai Guru, saya ingin melihat agenda mengajar saya agar tetap terorganisir.
4. Sebagai Guru, saya ingin melihat data siswa di kelas saya agar dapat memberikan perhatian khusus.
5. Sebagai Guru, saya ingin mengelola profil saya agar informasi pribadi selalu diperbarui.

### Wali Kelas

1. Sebagai Wali Kelas, saya ingin melihat daftar siswa di rombel saya agar dapat memantau perkembangan mereka.
2. Sebagai Wali Kelas, saya ingin melihat rekap absensi rombel saya agar dapat melaporkan kehadiran orang tua.
3. Sebagai Wali Kelas, saya ingin melihat leger penilaian rombel saya agar dapat membantu guru dalam pemantauan nilai.
4. Sebagai Wali Kelas, saya ingin menghasilkan laporan kelas agar dapat dijadikan bahan rapor.

### Siswa

1. Sebagai Siswa, saya ingin melihat jadwal saya agar mengetahui kelas apa yang harus saya ikuti.
2. Sebagai Siswa, saya ingin melihat absensi saya agar mengetahui riwayat kehadiran saya.
3. Sebagai Siswa, saya ingin melihat nilai saya agar mengetahui perkembangan akademik saya.

### Orang Tua

1. Sebagai Orang Tua, saya ingin melihat ringkasan kehadiran anak saya agar dapat memantau disiplinnya.
2. Sebagai Orang Tua, saya ingin melihat nilai anak saya agar dapat mengetahui prestasinya.
3. Sebagai Orang Tua, saya ingin menerima notifikasi terkait anak saya (fase lanjutan).

## Kebutuhan Non-Fungsional

### Keamanan

- Autentikasi menggunakan username dan password.
- Otorisasi berbasis RBAC.
- Data siswa dan orang tua harus dilindungi dengan akses ketat.
- Audit log untuk aktivitas sensitif (perubahan nilai, perubahan data master).
- Password harus di-hash sebelum disimpan.

### Performa

- Waktu respon halaman dashboard kurang dari 2 detik.
- Operasi CRUD data master harus selesai dalam 1 detik.
- Laporan harus dapat dimuat dalam 5 detik untuk dataset standar sekolah.

### Skalabilitas

- Arsitektur modular untuk memudahkan penambahan modul baru.
- Database dirancang relasional dan dapat diskalakan.
- API dirancang RESTful untuk konsistensi dan kemudahan integrasi.

### Keterpakaiannya

- Antarmuka harus sederhana dan intuitif untuk pengguna non-teknis.
- Navigasi harus konsisten di seluruh dashboard role.
- Label dan pesan kesalahan harus menggunakan Bahasa Indonesia yang jelas.

### Keandalan

- Soft delete untuk data master agar riwayat akademik tidak hilang.
- Validasi input pada setiap modul.
- Backup database tersedia dan terdokumentasi.

## Batasan dan Asumsi

- Satu sekolah menggunakan satu instance SAGU (single-school untuk MVP).
- Satu sekolah dapat memiliki lebih dari satu tahun ajaran.
- Setiap siswa memiliki satu rombel aktif per tahun ajaran.
- Satu guru dapat mengajar banyak mata pelajaran dan rombel.
- Wali kelas adalah guru yang ditugaskan untuk satu rombel pada tahun ajaran tertentu.
- Orang tua terhubung ke satu atau lebih siswa melalui relasi akun.
- Format NIS, NISN, NIP, dan kode kelas akan distandarisasi pada tahap desain teknis.
- Multi-school akan dipertimbangkan di fase berikutnya setelah MVP stabil.

## Kriteria Keberhasilan MVP

1. Setiap role dapat login dan mengakses dashboard-nya masing-masing.
2. Data guru, siswa, rombel, dan mata pelajaran dapat dibuat, dibaca, diperbarui, dan dihapus secara lunak.
3. Absensi dapat dicatat oleh guru untuk kelas yang ditugaskan.
4. Nilai dapat diinput oleh guru untuk mata pelajaran yang ditugaskan.
5. Laporan dasar dapat dihasilkan dan diekspor.
6. Pengaturan sekolah dan tahun ajaran dapat dikelola oleh Admin.
7. Tidak ada akses data yang tidak sah antar role.