# TASKS.md

Daftar tugas terperinci untuk implementasi SAGU berdasarkan roadmap fase saat ini.

## Fase 0 - Perencanaan

### Tugas Dokumentasi

- [ ] Finalisasi PRD dan dapatkan persetujuan pemangku kepentingan.
- [ ] Finalisasi dokumentasi arsitektur.
- [ ] Finalisasi skema database.
- [ ] Finalisasi spesifikasi API.
- [ ] Finalisasi spesifikasi RBAC.
- [ ] Finalisasi plan pengujian.
- [ ] Finalisasi rencana deployment.

### Tugas Validasi

- [ ] Review PRD dengan perwakilan sekolah.
- [ ] Validasi istilah akademik lokal.
- [ ] Konfirmasi format NIS, NISN, NIP, kode kelas.
- [ ] Konfirmasi struktur tahun ajaran dan semester.
- [ ] Konfirmasi format laporan yang dibutuhkan sekolah.

## Fase 1 - Fondasi Aplikasi

### Autentikasi dan Otorisasi

- [ ] Implementasi sistem login/logout.
- [ ] Implementasi hashing password.
- [ ] Implementasi session management.
- [ ] Implementasi middleware proteksi route.
- [ ] Implementasi RBAC dengan 5 role: Admin, Guru, Wali Kelas, Siswa, Orang Tua.
- [ ] Implementasi audit log dasar.

### Layout Dashboard

- [ ] Implementasi layout dasar berbasis role.
- [ ] Implementasi sidebar navigasi.
- [ ] Implementasi header profil.
- [ ] Implementasi dashboard Admin.
- [ ] Implementasi dashboard Guru.
- [ ] Implementasi dashboard Wali Kelas.
- [ ] Implementasi dashboard Siswa.
- [ ] Implementasi dashboard Orang Tua.

### Pengaturan Dasar

- [ ] Implementasi CRUD tahun ajaran.
- [ ] Implementasi CRUD semester.
- [ ] Implementasi CRUD pengaturan sekolah.
- [ ] Implementasi CRUD role dan permission.

## Fase 2 - Data Master Akademik

### Data Guru

- [ ] Implementasi CRUD data guru.
- [ ] Implementasi upload foto profil guru.
- [ ] Implementasi penugasan mata pelajaran ke guru.

### Data Siswa

- [ ] Implementasi CRUD data siswa.
- [ ] Implementasi upload foto profil siswa.
- [ ] Implementasi relasi siswa dengan rombel.
- [ ] Implementasi relasi siswa dengan orang tua.

### Rombel

- [ ] Implementasi CRUD kelas.
- [ ] Implementasi CRUD rombel.
- [ ] Implementasi penugasan wali kelas.
- [ ] Implementasi penugasan siswa ke rombel.

### Mata Pelajaran

- [ ] Implementasi CRUD mata pelajaran.
- [ ] Implementasi penugasan guru ke mata pelajaran.

## Fase 3 - Operasional Harian

### Absensi

- [ ] Implementasi pencatatan absensi per pertemuan.
- [ ] Implementasi rekap absensi harian per kelas.
- [ ] Implementasi rekap absensi per siswa.
- [ ] Implementasi tampilan absensi untuk siswa.
- [ ] Implementasikan tampilan absensi untuk orang tua.

### Agenda Mengajar

- [ ] Implementasi CRUD agenda mengajar.
- [ ] Implementasi tampilan agenda per guru.
- [ ] Implementasi tampilan agenda per rombel.

### Catatan Kelas

- [ ] Implementasi fitur catatan kelas oleh wali kelas.
- [ ] Implementasi tampilan catatan kelas untuk wali kelas.

## Fase 4 - Penilaian dan Leger

### Penilaian

- [ ] Implementasi CRUD nilai siswa.
- [ ] Implementasi komponen penilaian (harian, tengah semester, akhir semester).
- [ ] Implementasi perhitungan nilai akhir otomatis.
- [ ] Implementasi rekap nilai per rombel.

### Leger

- [ ] Implementasi tampilan leger per siswa.
- [ ] Implementasi tampilan leger per rombel.
- [ ] Implementasi pencetakan leger.

## Fase 5 - Laporan

- [ ] Implementasi laporan data guru.
- [ ] Implementasi laporan data siswa.
- [ ] Implementasi laporan absensi.
- [ ] Implementasi laporan leger.
- [ ] Implementasi ekspor laporan (PDF dan/atau spreadsheet).

## Fase 6 - Stabilitas dan Produksi

- [ ] Implementasi backup dan restore database.
- [ ] Implementasi logging dan monitoring.
- [ ] Performa dan optimasi.
- [ ] Hardening keamanan.
- [ ] Dokumentasi deployment.
- [ ] Uji beta internal.

## Fase Lanjutan

- [ ] Notifikasi orang tua.
- [ ] Portal orang tua lengkap.
- [ ] Integrasi presensi perangkat.
- [ ] Integrasi Dapodik.
- [ ] AI Generator (setelah MVP stabil dan disetujui).