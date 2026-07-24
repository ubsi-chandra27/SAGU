# Security Guidelines

## Panduan Keamanan SAGU

Dokumen ini mendefinisikan panduan dan standar keamanan yang harus diterapkan dalam pengembangan dan operasional SAGU, khususnya terkait data siswa, data pribadi, dan otorisasi akses.

## Prinsip Keamanan Utama

### 1. Privacy by Design

- Data siswa dan orang tua dianggap data pribadi yang sensitif.
- Setiap fitur yang mengakses data pribadi harus mengevaluasi kebutuhan akses.
- Data siswa tidak boleh diekspos ke role yang tidak berkepentingan.
- Minimalisasi data: hanya kumpulkan data yang diperlukan untuk fungsi yang jelas.

### 2. Defense in Depth

- Keamanan diterapkan pada beberapa lapisan: jaringan, aplikasi, database, dan operasional.
- Setiap lapisan memiliki kontrol keamanan sendiri.
- Kegagalan satu lapisan tidak boleh mengompromikan lapisan lain secara langsung.

### 3. Least Privilege

- Setiap pengguna hanya memiliki akses minimum yang dibutuhkan untuk menjalankan tugasnya.
- Role tidak memiliki akses default yang lebih luas dari yang diperlukan.
- Permission diperiksa pada setiap ases operasi data.

## Autentikasi

### Persyaratan

- Semua pengguna harus melakukan autentikasi untuk mengakses aplikasi.
- Password harus di-hash menggunakan algoritma yang aman (bcrypt atau Argon2).
- Password tidak boleh disimpan dalam bentuk plaintext atau terenkripsi reversible.
- Akses login gagal harus dicatat dan dibatasi (rate limiting).
- Akun yang gagal login berulang kali harus di-lock sementara.

### Persyaratan Password

- Panjang minimum: 8 karakter.
- Harus mengandung campuran huruf besar, huruf kecil, angka, dan karakter khusus.
- Tidak boleh berupa password umum (common password list check).
- Tidak boleh mengandung username atau bagian dari nama lengkap pengguna.
- User harus diwajibkan untuk mengganti password jika dicurigai terkompromi.

### Manajemen Sesi

- Access token memiliki masa berlaku terbatas (contoh: 15 menit).
- Refresh token digunakan untuk memperpanjang sesi tanpa meminta kredensial ulang.
- Refresh token harus di-rotate setiap kali digunakan (membuat token lama tidak valid).
- Pengguna harus dapat logout dari semua perangkat.
- Token yang dikompromikan harus bisa di-invalidasi oleh Admin.

## Otorisasi

### RBAC Ketat

- Setiap route API diperiksa role-nya oleh middleware.
- Permission di-cache untuk menghindari pemeriksaan database berulang.
- Role baru hanya boleh dibuat oleh Admin.
- Setiap perubahan role dan permission harus diaudit.

### Akses Data Terbatas

- Guru hanya boleh mengakses data siswa, absensi, dan nilai untuk kelas dan mata pelajaran yang ditugaskan.
- Wali Kelas hanya boleh mengakses data rombel yang ditugaskan.
- Siswa hanya boleh mengakses data diri sendiri.
- Orang Tua hanya boleh mengakses data anak yang terhubung ke akunnya.
- Akses data lintas rombel, kelas, atau siswa yang bukan tanggung jawab pengguna harus ditolak.

### Penanganan Akses Tidak Sah

- Akses tidak sah harus menghasilkan HTTP 403 Forbidden.
- Tidak boleh ada informasi yang mengungkapkan bahwa resource ada tetapi tidak dapat diakses (info disclosure).
- Setiap upaya akses tidak sah harus dicatat di audit log.

## Perlindungan Data

### Data at Rest

- Hanya field password yang terenkripsi (hashed).
- Field sensitif lainnya (jika ada) harus dienkripsi pada level database.
- Backup database harus dienkripsi dan disimpan secara aman.

### Data in Transit

- Seluruh komunikasi antara client dan server harus menggunakan HTTPS (TLS 1.2 atau lebih tinggi).
- Cookie session harus memiliki flag `Secure`, `HttpOnly`, dan `SameSite`.
- API response tidak boleh mengandung data sensitif yang tidak perlu.

### Data in Use

- Tidak ada data sensitif yang dicetak dalam log server.
- Pesan error tidak boleh mengungkapkan informasi teknis internal.
- Query parameter yang berisi data sensitif harus dihindari; gunakan path parameter atau body request.

## Validasi Input

### Aturan Umum

- Semua input dari pengguna harus divalidasi di sisi server.
- Validasi di sisi client bersifat tambahan, bukan pengganti validasi server.
- Tipe data, panjang, dan format setiap field harus divalidasi.
- Input yang mengandung karakter berbahaya (SQL, XSS) harus di-sanitasi atau ditolak.

### Validasi Spesifik

- NIS, NISN: hanya boleh berisi angka dengan panjang yang sesuai standar.
- Email: harus mengikuti format email yang valid.
- NIP: sesuai format pegawai.
- Tanggal: harus tanggal yang valid dan masuk akal (tidak di masa depan untuk tanggal lahir).
- Nilai: harus dalam rentang skor yang valid (0 hingga max_score).
- Upload file: tipe file, ukuran, dan nama file harus divalidasi.

## SQL Injection Prevention

- Gunakan query builder atau ORM untuk semua interaksi database.
- Parameterized query wajib digunakan; tidak boleh ada string interpolation pada query SQL.
- Hak akses database user aplikasi harus terbatas (hanya hak yang diperlukan untuk operasi CRUD).

## XSS Prevention

- Output dari pengguna harus di-escape sebelum ditampilkan di HTML.
- Content Security Policy (CSP) header harus dikonfigurasi.
- Cookie sensitif harus memiliki flag `HttpOnly`.
- Input yang kemungkinan mengandung HTML harus d-sanitasi.

## CSRF Prevention

- Token CSRF wajib digunakan untuk setiap request yang mengubah state (POST, PUT, DELETE).
- Cookie SameSite diatur ke `Strict` atau `Lax`.
- Origin dan Referer header diverifikasi pada request yang mengubah state.

## Audit Log

### Aksi yang Wajib Dicatat

- Login berhasil dan gagal.
- Logout.
- Perubahan data master (guru, siswa, kelas, rombel, mata pelajaran, tahun ajaran, semester).
- Perubahan nilai siswa.
- Perubahan absensi.
- Perubahan pengaturan sekolah.
- Aksi manajemen pengguna (buat, ubah, nonaktifkan).
- Perubahan role dan permission.
- Upaya akses tidak sah (403).

### Data yang Dicatat

- User ID yang melakukan aksi.
- Timestamp aksi.
- Jenis aksi (create, update, delete, login, dll.).
- Nama tabel dan ID record yang terpengaruh.
- Nilai lama dan baru (untuk update dan delete).
- Alamat IP pengguna.
- User agent browser.

### Retensi Log

- Log audit harus disimpan minimal 1 tahun.
- Log audit tidak boleh dapat diubah atau dihapus oleh pengguna biasa.
- Log audit harus dapat dicari berdasarkan tanggal, pengguna, dan aksi.

## Keamanan File Upload

- Tipe file yang diizinkan harus dibatasi (contoh: hanya gambar untuk foto profil).
- Ukuran file maksimum harus dibatasi.
- File yang diunggah tidak boleh dieksekusi sebagai skrip di server.
- File upload harus disimpan di luar web root atau dengan konfigurasi yang mencegah eksekusi langsung.
- Nama file yang diunggah harus di-rename untuk menghindari path traversal dan overwriting.

## Perlindungan Brute Force

- Rate limiting pada endpoint login dan registrasi.
- Akun di-lock sementara setelah beberapa percobaan login gagal.
- CAPTCHA pada percobaan login yang berulang.
- Notifikasi ke Admin jika ada upaya brute force terdeteksi.

## Kerentanan Umum yang Harus Dihindari

| Kerentanan | Pencegahan |
|---|---|
| SQL Injection | Parameterized query, ORM |
| XSS | Output encoding, CSP header, sanitize input |
| CSRF | CSRF token, SameSite cookie |
| Path Traversal | Sanitasi path, batasi direktori upload |
| IDOR | Verifikasi pemilik resource pada setiap akses |
| Information Disclosure | Pesan error generik, bukan detail teknis |
| Insecure Direct Object Reference | Verifikasi relasi pengguna dan resource |
| Security Misconfiguration | Hardening server, nonaktifkan debug di produksi |
| Broken Authentication | Hash password, rate limiting, session management |
| Sensitive Data Exposure | HTTPS, encrypt storage, minimalize data exposure |

## Prosedur Respons Insiden

1. Identifikasi insiden keamanan (log anomaly, laporan pengguna, dll.).
2. Isolasi dampak (nonaktifkan akun, fitur, atau sistem yang terkompromi).
3. Assess kerusakan (data apa yang terpengaruh).
4. Notify stakeholder dan pengguna yang terdampak jika diperlukan.
5. Perbaiki kerentanan (perbaiki kode, patch, update konfigurasi).
6. Update audit log dengan insiden dan tindakan yang diambil.
7. Lakukan post-incident review untuk mencegah kejadian serupa.