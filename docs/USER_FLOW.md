# User Flow

## Alur Kerja Pengguna SAGU

Dokumen ini menggambarkan alur kerja utama setiap role pengguna dalam aplikasi SAGU, dari login hingga menyelesaikan tugas utamanya.

## Alur Kerja Admin

### Login dan Navigasi Awal

1. Admin membuka halaman login.
2. Admin memasukkan username dan password.
3. Sistem memverifikasi kredensial.
4. Admin diarahkan ke Dashboard Admin.
5. Sidebar menampilkan semua menu yang dapat diakses oleh Admin.

### Mengelola Data Guru

1. Admin membuka menu Data Guru dari sidebar.
2. Admin melihat daftar guru dengan tabel berpaginasi.
3. Admin mengklik tombol Tambah Guru.
4. Admin mengisi formulir data guru (nama, NIP, email, dll.).
5. Admin menyimpan data.
6. Sistem memvalidasi input dan menampilkan pesan sukses atau error.
7. Admin dapat mengedit atau menghapus (soft delete) guru dari daftar.

### Mengelola Data Siswa

1. Admin membuka menu Data Siswa.
2. Admin melihat daftar siswa.
3. Admin menambah, memperbarui, atau menghapus siswa.
4. Admin menghubungkan siswa dengan rombel yang tepat.
5. Admin menghubungkan siswa dengan akun orang tua (jika ada).

### Mengelola Rombel

1. Admin membuka menu Rombel.
2. Admin membuat kelas dan rombel baru.
3. Admin menugaskan wali kelas ke rombel.
4. Admin menugaskan siswa ke rombel.
5. Admin memverifikasi struktur rombel benar.

### Mengelola Pengaturan

1. Admin membuka menu Pengaturan.
2. Admin memperbarui profil sekolah.
3. Admin membuat tahun ajaran dan semester.
4. Admin mengelola role dan permission pengguna.
5. Admin melihat daftar pengguna dan mengelola akun.

### Menghasilkan Laporan

1. Admin membuka menu Laporan.
2. Admin memilih jenis laporan (data guru, siswa, absensi, leger).
3. Admin mengatur filter (tahun ajaran, semester, kelas, rombel).
4. Admin menghasilkan laporan.
5. Admin mengekspor laporan ke PDF atau spreadsheet.

## Alur Kerja Guru

### Login dan Navigasi Awal

1. Guru membuka halaman login.
2. Guru memasukkan kredensial.
3. Guru diarahkan ke Dashboard Guru.
4. Sidebar menampilkan menu relevan: agenda mengajar, absensi, leger, profil.

### Mencatat Absensi

1. Guru membuka menu Absensi.
2. Guru memilih rombel dan tanggal.
3. Guru melihat daftar siswa di rombel tersebut.
4. Guru mencentang status kehadiran setiap siswa (hadir, izin, sakit, alpa, terlambat).
5. Guru menambahkan catatan khusus jika diperlukan.
6. Guru menyimpan absensi.
7. Sistem menyimpan data absensi dengan timestamp pencatatan.

### Mengisi Agenda Mengajar

1. Guru membuka menu Agenda Mengajar.
2. Guru mengklik Tambah Agenda.
3. Guru memilih mata pelajaran, rombel, kelas, dan tanggal.
4. Guru mengisi topik dan deskripsi pembelajaran.
5. Guru menentukan waktu mulai dan selesai.
6. Guru menyimpan agenda.
7. Agenda muncul di daftar agenda mengajar guru.

### Menginput Nilai

1. Guru membuka menu Leger.
2. Guru memilih mata pelajaran dan rombel.
3. Guru menggunakan tombol Upload Nilai (massal) atau input per siswa.
4. Guru mengisi nilai untuk setiap komponen penilaian (harian, tengah semester, akhir semester).
5. Guru menyimpan nilai.
6. Sistem menghitung nilai akhir berdasarkan bobot komponen.
7. Guru dapat mengedit atau menghapus nilai yang salah.

### Melihat Profil

1. Guru membuka menu Profil atau mengklik avatar di header.
2. Guru melihat data diri dan informasi akun.
3. Guru dapat memperbarui profil atau mengubah password.

## Alur Kerja Wali Kelas

### Login dan Navigasi Awal

1. Wali Kelas membuka halaman login.
2. Wali Kelas melihat Dashboard Wali Kelas.
3. Sidebar menampilkan menu rombel, absensi, leger, dan laporan.

### Memantau Siswa di Rombel

1. Wali Kelas membuka menu Rombel.
2. Wali Kelas memilih rombel yang ditugaskan.
3. Wali Kelas melihat daftar siswa dengan profil ringkas.
4. Wali Kelas dapat mengakses detail siswa.

### Rekap Absensi

1. Wali Kelas membuka menu Absensi.
2. Wali Kelas memilih rombel dan periode.
3. Wali Kelas melihat rekap kehadiran per siswa.
4. Wali Kelas dapat mencetak atau mengekspor rekap.

### Leger Penilaian

1. Wali Kelas membuka menu Leger.
2. Wali Kelas memilih rombel dan semester.
3. Wali Kelas melihat rekap nilai per siswa.
4. Wali Kelas memverifikasi kelengkapan nilai.
5. Wali Kelas dapat menghasilkan laporan nilai.

### Menghasilkan Laporan Kelas

1. Wali Kelas membuka menu Laporan.
2. Wali Kelas memilih jenis laporan kelas.
3. Wali Kelas mengatur filter (semester, komponen penilaian).
4. Wali Kelas menghasilkan dan mengekspor laporan.

## Alur Kerja Siswa

### Login dan Navigasi Awal

1. Siswa membuka halaman login.
2. Siswa melihat Dashboard Siswa.
3. Sidebar menampilkan menu Profil, Jadwal, Absensi, dan Nilai.

### Melihat Profil

1. Siswa membuka menu Profil.
2. Siswa melihat data pribadi, rombel, dan informasi sekolah.

### Melihat Jadwal

1. Siswa membuka menu Jadwal.
2. Siswa melihat agenda mengajar berdasarkan rombel, kelas, dan hari.
3. Siswa mengetahui mata pelajaran dan waktu mengajar.

### Melihat Absensi

1. Siswa membuka menu Absensi.
2. Siswa melihat riwayat kehadirannya.
3. Siswa dapat memfilter berdasarkan bulan atau semester.

### Melihat Nilai

1. Siswa membuka menu Nilai.
2. Siswa melihat nilai per mata pelajaran.
3. Siswa melihat detail komponen nilai (harian, tengah semester, akhir semester).

## Alur Kerja Orang Tua

### Login dan Navigasi Awal

1. Orang Tua membuka halaman login.
2. Orang Tua melihat Dashboard Orang Tua.
3. Sidebar menampilkan menu Anak, Absensi Anak, Nilai Anak.

### Melihat Profil Anak

1. Orang Tua membuka menu Anak.
2. Orang Tua memilih anak yang terhubung.
3. Orang Tua melihat data pribadi anak, rombel, dan wali kelas.

### Melihat Ringkasan Absensi Anak

1. Orang Tua membuka menu Absensi.
2. Orang Tua memilih anak.
3. Orang Tua melihat ringkasan kehadiran (jumlah hadir, izin, sakit, alpa).
4. Orang Tua dapat melihat detail per hari.

### Melihat Nilai Anak

1. Orang Tua membuka menu Nilai.
2. Orang Tua memilih anak.
3. Orang Tua melihat nilai per mata pelajaran per semester.
4. Orang Tua melihat rekap dan perkembangan nilai.

## Alur Umum: Ubah Password

1. Pengguna membuka menu Profil.
2. Pengguna mengklik Ubah Password.
3. Pengguna memasukkan password lama.
4. Pengguna memasukkan password baru dan konfirmasi.
5. Sistem memverifikasi password lama.
6. Sistem memverifikasi password baru memenuhi syarat.
7. Sistem memperbarui password hash di database.
8. Pengguna menerima pesan sukses dan diarahkan kembali.