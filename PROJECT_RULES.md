# PROJECT_RULES.md

Aturan proyek SAGU.

## Batasan Fase Saat Ini

- Jangan membuat kode aplikasi.
- Jangan menginstall package.
- Jangan membuat halaman UI.
- Jangan membuat fitur AI Generator.
- Fokus pada dokumentasi, perencanaan, dan spesifikasi MVP.

## Bahasa

- Dokumentasi utama menggunakan Bahasa Indonesia.
- Istilah teknis boleh menggunakan Bahasa Inggris jika umum dipakai, misalnya API, RBAC, endpoint, deployment.
- Nama tabel dan field database menggunakan gaya `snake_case`.
- Nama route menggunakan Bahasa Inggris yang konsisten dan mudah dipakai developer.

## Produk

- Setiap modul harus memiliki tujuan bisnis yang jelas.
- Setiap fitur harus terkait dengan minimal satu role pengguna.
- Alur kerja harus sederhana untuk lingkungan sekolah.
- Hindari fitur tambahan yang belum diperlukan MVP.

## Data

- Data siswa, orang tua, nilai, dan absensi dianggap sensitif.
- Akses data harus dibatasi berdasarkan role dan relasi data.
- Perubahan data penting perlu audit log.
- Gunakan soft delete untuk data master agar riwayat akademik tidak rusak.

## Arsitektur

- Gunakan arsitektur modular.
- Pisahkan autentikasi, otorisasi, data master, akademik, laporan, dan pengaturan.
- Hindari coupling antar modul yang tidak perlu.
- Dokumentasikan kontrak API sebelum implementasi.

## Kualitas

- Setiap modul MVP harus memiliki skenario uji minimal.
- Validasi input wajib untuk data master, absensi, dan nilai.
- Kesalahan sistem harus menghasilkan pesan yang aman dan mudah dimengerti.
- Laporan harus dapat ditelusuri kembali ke data sumber.

## Perubahan Dokumentasi

- Tambahkan perubahan signifikan ke `docs/CHANGELOG.md`.
- Perbarui `TODO.md` dan `docs/TASKS.md` setelah status pekerjaan berubah.
- Perbarui `MEMORY.md` untuk keputusan produk atau teknis yang berdampak jangka panjang.

