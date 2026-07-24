# Authentication and Authorization (Auth & RBAC)

Sistem Autentikasi dan Otorisasi SAGU menggunakan pendekatan RBAC (Role-Based Access Control) dengan lima role pengguna: Admin, Guru, Wali Kelas, Siswa, dan Orang Tua.

## Arsitektur Autentikasi

### Metode Autentikasi

SAGU menggunakan autentikasi berbasis sesi (session-based auth) dengan token JWT (JSON Web Token) untuk komunikasi API. Untuk MVP, autentikasi menggunakan username/email dan password.

### Alur Login

1. Pengguna memasukkan username dan password pada halaman login.
2. Server memverifikasi kredensial terhadap tabel `users`.
3. Server memverifikasi bahwa akun aktif (`is_active = true`).
4. Server meng-hash password dan membandingkan dengan `password_hash` yang tersimpan.
5. Jika valid, server menghasilkan JWT access token dan refresh token.
6. Access token dikirim ke client dan disimpan dalam secure cookie atau local storage (sesuai keputusan teknis).
7. Client menggunakan access token pada setiap request API.

### Alur Logout

1. Pengguna mengklik tombol logout.
2. Client menghapus token akses dari penyimpanan lokal.
3. Server meng-invalidasi refresh token (jika sesi disimpan di server).
4. Pengguna diarahkan ke halaman login.

### Refres Token

1. Ketika access token kedaluwarsa, client mengirim request refresh menggunakan refresh token.
2. Server memverifikasi refresh token masih valid.
3. Server menghasilkan access token baru dan refresh token baru.
4. Client memperbarui token yang disimpan.

## Model Role dan Permission

### Role

| Role | Deskripsi |
|---|---|
| admin | Mengelola seluruh data master, pengguna, konfigurasi, dan laporan global. |
| guru | Mengelola agenda mengajar, absensi kelas yang diajar, dan penilaian mata pelajaran yang ditugaskan. |
| wali_kelas | Memantau siswa dalam rombel, rekap absensi, leger, dan laporan kelas. |
| siswa | Melihat data pribadi, jadwal, absensi, dan nilai sendiri. |
| orang_tua | Melihat ringkasan kehadiran, nilai, dan informasi anak yang terhubung. |

### Permission Matrix

| Modul | admin | guru | wali_kelas | siswa | orang_tua |
|---|---|---|---|---|---|
| Dashboard | R | R | R | R | R |
| Data Guru | CRUD | R (data sendiri) | - | - | - |
| Data Siswa | CRUD | R (siswa di kelasnya) | R (siswa di rombelnya) | R (data sendiri) | R (anaknya) |
| Rombel | CRUD | R (rombelnya) | R (rombelnya) | R (rombelnya) | - |
| Absensi | R | CRUD (kelasnya) | R (rombelnya) | R (data sendiri) | R (anaknya) |
| Leger | R | CRUD (mapelnya) | R (rombelnya) | R (data sendiri) | R (anaknya) |
| Agenda Mengajar | R | CRUD (mengajarnya) | R (rombelnya) | R (rombelnya) | - |
| Laporan | CR | R (terbatas) | R (kelasnya) | R (data sendiri) | R (anaknya) |
| Pengaturan | CR | - | - | - | - |
| Statistik | R | R (gurunya) | R (rombelnya) | - | - |

Keterangan:

- **R** = Read (Baca)
- **CRUD** = Create, Read, Update, Delete (Baca, Buat, Ubah, Hapus)
- **-** = Tidak memiliki akses
- **(data sendiri)** = hanya data pengguna yang bersangkutan
- **(kelasnya)** = hanya kelas dan rombel yang ditugaskan ke guru tersebut
- **(rombelnya)** = hanya rombel yang ditugaskan ke pengguna
- **(mapelnya)** = hanya mata pelajaran yang ditugaskan kepada guru tersebut

## Middleware dan Proteksi Route

### Middleware Autentikasi

Setiap route API dilindungi oleh middleware `auth` yang memverifikasi keberadaan dan validitas JWT access token.

### Middleware Otorisasi

Middleware `authorize` memverifikasi bahwa pengguna memiliki role yang cukup untuk mengakses route yang diminta. Jika role tidak sesuai, server mengembalikan HTTP 403 Forbidden.

### Middleware Audit

Untuk aksi sensitif seperti perubahan nilai, perubahan data master, dan penghapusan, middleware audit mencatat aktivitas ke tabel `audit_logs`.

## Role-Based Route Protection

### Proteksi Di Sisi Server

- Setiap route API memiliki deklarasi role yang diizinkan.
- Middleware memeriksa role pengguna terhadap daftar role yang diizinkan.
- Jika pengguna tidak memiliki role yang diizinkan, response berisi HTTP 403 dengan pesan "Akses ditolak".
- Pembatasan akses berdasarkan relasi data (misalnya, guru hanya boleh mengakses siswa di kelas/rombel yang ditugaskan) diterapkan pada application layer (Row Level Security). Middleware memverifikasi role terlebih dahulu, kemudian service layer menyaring data berdasarkan relasi.

### Proteksi Di Sisi Klien (Frontend)

- Sidebar navigasi menyembunyikan menu yang tidak sesuai role.
- Tombol aksi yang tidak diizinkan untuk role tertentu disembunyikan.
- Halaman yang tidak diakses oleh role pengguna akan menampilkan halaman 403.

## Keamanan Password

- Password tidak disimpan dalam bentuk plaintext.
- Password di-hash menggunakan bcrypt atau algoritma hashing serupa.
- Panjang minimum password: 8 karakter.
- Password harus mengandung campuran huruf besar, huruf kecil, angka, dan karakter khusus.
- Server menolak password yang terlalu umum (common password check).

## Session Management

- Access token memiliki masa berlaku terbatas (contoh: 15 menit).
- Refresh token memiliki masa berlaku lebih panjang (contoh: 7 hari).
- Refresh token bersifat rotatable (setiap refresh menghasilkan token baru dan men-invalidasi token lama).
- Logout meng-invalidasi token di sisi server (jika diperlukan).

## Audit Log

### Data yang Dicatat

- ID pengguna yang melakukan aksi.
- Jenis aksi (create, update, delete, login, logout).
- Nama tabel dan ID record yang terpengaruh.
- Nilai sebelum dan sesudah perubahan (untuk update dan delete).
- Alamat IP pengguna.
- User agent browser.
- Timestamp aksi.

### Aksi yang Diaudit

- Perubahan data guru.
- Perubahan data siswa.
- Perubahan nilai siswa.
- Perubahan data master (tahun ajaran, semester, kelas, rombel, mata pelajaran).
- Perubahan hak akses role dan permission.
- Login gagal (berulang).
- Aksi penghapusan (soft delete).
- Aksi akses tidak sah (403).
- Perubahan penugasan mengajar (walikelas dan guru mengajar).

## Kriteria Kesalahan

Kode kesalahan yang digunakan pada response API:

| Kode HTTP | Makna | Contoh |
|---|---|---|
| 401 Unauthorized | Token tidak valid atau kedaluwarsa | Missing/invalid token |
| 403 Forbidden | Pengguna tidak memiliki izin | Role tidak sesuai |
| 404 Not Found | Resource tidak ditemukan | ID tidak ada |
| 422 Validation Error | Input tidak valid | Field wajib kosong |
| 429 Too Many Requests | Terlalu banyak percobaan | Rate limit exceeded |
| 500 Internal Server Error | Kesalahan server internal | Error tidak terduga |

## Spesifikasi Lebih Lanjut

- Implementasi detail akan mengikuti keputusan teknis pada tahap desain teknis.
- Strategi penyimpanan token (cookie vs local storage) akan dipilih berdasarkan pertimbangan keamanan.
- Mekanisme refresh token akan menggunakan secure httpOnly cookie jika stack teknologi memungkinkan.