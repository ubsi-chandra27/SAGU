# AGENTS.md

Panduan kerja untuk agen pengembang, reviewer, dan kontributor yang membantu proyek SAGU.

## Identitas Proyek

SAGU adalah Sistem Administrasi Guru untuk membantu sekolah mengelola data akademik dan administrasi harian. Fokus MVP adalah administrasi sekolah, bukan fitur AI Generator.

## Prinsip Kerja

- Gunakan Bahasa Indonesia untuk dokumentasi, komentar bisnis, dan istilah antarmuka.
- Jangan menambahkan fitur AI Generator pada fase MVP.
- Jangan membuat kode aplikasi sebelum spesifikasi MVP disepakati.
- Jangan menginstall package tanpa persetujuan eksplisit.
- Utamakan modul administrasi inti: data guru, data siswa, rombel, absensi, leger penilaian, agenda mengajar, laporan, dan pengaturan.
- Setiap perubahan harus menjaga struktur proyek tetap mudah dipahami oleh tim sekolah dan tim teknis.

## Peran Pengguna

- Admin: mengelola data master, pengguna, konfigurasi, dan laporan global.
- Guru: mengelola agenda mengajar, absensi kelas yang diajar, dan penilaian mata pelajaran.
- Wali Kelas: memantau siswa dalam rombel, rekap absensi, leger, dan laporan kelas.
- Siswa: melihat data pribadi, jadwal, absensi, nilai, dan pengumuman terbatas.
- Orang Tua: melihat ringkasan kehadiran, nilai, dan informasi anak.

## Aturan Kontribusi

- Baca `PROJECT_RULES.md` sebelum membuat perubahan.
- Baca `docs/PRD.md` untuk memahami ruang lingkup produk.
- Baca `docs/DATABASE_SCHEMA.md` sebelum mengubah struktur data.
- Baca `docs/AUTH_RBAC.md` sebelum mengubah otorisasi.
- Catat keputusan penting di `MEMORY.md`.
- Tambahkan pekerjaan baru ke `TODO.md` atau `docs/TASKS.md`.

## Definisi Selesai

Sebuah pekerjaan dianggap selesai jika:

- Tujuan bisnisnya jelas.
- Dampak role dan permission sudah dipertimbangkan.
- Dokumentasi terkait diperbarui.
- Risiko keamanan dan data pribadi siswa dipertimbangkan.
- Rencana pengujian minimal tersedia.

