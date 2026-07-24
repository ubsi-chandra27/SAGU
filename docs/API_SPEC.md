# API Specification

## Spesifikasi API SAGU

Dokumen ini mendefinisikan kontrak API untuk SAGU menggunakan format RESTful. Seluruh API menggunakan prefiks `/api/v1`.

## Format Request

### Content-Type

- `Content-Type: application/json` untuk semua body request.
- `Accept: application/json` pada header request.

### Authentication

Setiap request API harus menyertakan header authorization:

```
Authorization: Bearer <access_token>
```

## Format Response Standar

### Sukses

```json
{
  "success": true,
  "message": "Deskripsi keberhasilan",
  "data": { }
}
```

### Gagal

```json
{
  "success": false,
  "message": "Deskripsi kesalahan",
  "error": {
    "code": "ERROR_CODE",
    "details": [ ]
  }
}
```

### Paginasi

Response daftar data menyertakan metadata paginasi:

```json
{
  "success": true,
  "message": "Data ditemukan",
  "data": [ ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total": 100
  }
}
```

## Kode Status HTTP yang Digunakan

| Kode | Penggunaan |
|---|---|
| 200 OK | Request berhasil |
| 201 Created | Resource berhasil dibuat |
| 400 Bad Request | Input tidak valid |
| 401 Unauthorized | Token tidak valid atau tidak ada |
| 403 Forbidden | Role tidak memiliki akses |
| 404 Not Found | Resource tidak ditemukan |
| 422 Unprocessable Entity | Validasi gagal |
| 429 Too Many Requests | Rate limit |
| 500 Internal Server Error | Kesalahan server |

## Endpoint Utama

### Autentikasi

| Endpoint | Method | Deskripsi | Body |
|---|---|---|---|
| `/api/v1/auth/login` | POST | Login | `{ "username": "...", "password": "..." }` |
| `/api/v1/auth/logout` | POST | Logout | — |
| `/api/v1/auth/refresh` | POST | Refresh token | `{ "refresh_token": "..." }` |
| `/api/v1/auth/me` | GET | Info pengguna saat ini | — |
| `/api/v1/auth/forgot-password` | POST | Minta reset password | `{ "email": "..." }` |
| `/api/v1/auth/reset-password` | POST | Reset password | `{ "token": "...", "password": "..." }` |

### Dashboard

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/dashboard/admin` | GET | Admin | Ringkasan dashboard admin |
| `/api/v1/dashboard/guru` | GET | Guru | Ringkasan dashboard guru |
| `/api/v1/dashboard/wali-kelas` | GET | Wali Kelas | Ringkasan dashboard wali kelas |
| `/api/v1/dashboard/siswa` | GET | Siswa | Ringkasan dashboard siswa |
| `/api/v1/dashboard/orang-tua` | GET | Orang Tua | Ringkasan dashboard orang tua |

### Data Guru

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/data/guru` | GET | Admin, Guru | Daftar guru |
| `/api/v1/data/guru/:id` | GET | Admin, Guru | Detail guru |
| `/api/v1/data/guru` | POST | Admin | Buat guru |
| `/api/v1/data/guru/:id` | PUT | Admin | Perbarui guru |
| `/api/v1/data/guru/:id` | DELETE | Admin | Hapus lunak guru |
| `/api/v1/data/guru/export` | GET | Admin | Ekspor data guru |

### Data Siswa

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/data/siswa` | GET | Semua role (terbatas) | Daftar siswa |
| `/api/v1/data/siswa/:id` | GET | Semua role (terbatas) | Detail siswa |
| `/api/v1/data/siswa` | POST | Admin | Buat siswa |
| `/api/v1/data/siswa/:id` | PUT | Admin | Perbarui siswa |
| `/api/v1/data/siswa/:id` | DELETE | Admin | Hapus lunak siswa |
| `/api/v1/data/siswa/export` | GET | Admin | Ekspor data siswa |

### Rombel

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/rombel` | GET | Semua role (terbatas) | Daftar rombel |
| `/api/v1/rombel/:id` | GET | Admin, Guru, Wali Kelas | Detail rombel |
| `/api/v1/rombel` | POST | Admin | Buat rombel |
| `/api/v1/rombel/:id` | PUT | Admin | Perbarui rombel |
| `/api/v1/rombel/:id` | DELETE | Admin | Hapus lunak rombel |
| `/api/v1/rombel/:id/wali-kelas` | PUT | Admin | Tugaskan wali kelas |

### Absensi

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/absensi` | GET | Guru, Wali Kelas, Siswa, Orang Tua (terbatas) | Daftar absensi |
| `/api/v1/absensi` | POST | Guru | Catat absensi |
| `/api/v1/absensi/:id` | PUT | Guru | Perbarui absensi |
| `/api/v1/absensi/:id` | DELETE | Guru | Hapus absensi |
| `/api/v1/absensi/rekap` | GET | Guru, Wali Kelas, Admin | Rekap absensi |

### Agenda Mengajar

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/agenda` | GET | Semua role (terbatas) | Daftar agenda |
| `/api/v1/agenda` | POST | Guru | Buat agenda |
| `/api/v1/agenda/:id` | PUT | Guru | Perbarui agenda |
| `/api/v1/agenda/:id` | DELETE | Guru | Hapus agenda |

### Komponen Penilaian

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/leger/komponen` | GET | Admin, Guru | Daftar komponen penilaian |
| `/api/v1/leger/komponen` | POST | Admin | Buat komponen penilaian |
| `/api/v1/leger/komponen/:id` | PUT | Admin | Perbarui komponen penilaian |
| `/api/v1/leger/komponen/:id` | DELETE | Admin | Hapus komponen penilaian |

### Leger Penilaian

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/leger` | GET | Semua role (terbatas) | Daftar nilai |
| `/api/v1/leger/:id` | GET | Semua role (terbatas) | Detail nilai |
| `/api/v1/leger` | POST | Guru | Input nilai |
| `/api/v1/leger/:id` | PUT | Guru | Perbarui nilai |
| `/api/v1/leger/:id` | DELETE | Guru | Hapus nilai |
| `/api/v1/leger/rekap` | GET | Guru, Wali Kelas, Admin | Rekap nilai per rombel |

### Laporan

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/laporan/guru` | GET | Admin | Laporan data guru |
| `/api/v1/laporan/siswa` | GET | Admin | Laporan data siswa |
| `/api/v1/laporan/absensi` | GET | Admin, Guru, Wali Kelas | Laporan absensi |
| `/api/v1/laporan/leger` | GET | Admin, Guru, Wali Kelas | Laporan leger |
| `/api/v1/laporan/export` | GET | Admin, Guru, Wali Kelas | Ekspor laporan |

### Pengaturan

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/v1/pengaturan` | GET | Semua role (terbatas) | Dapatkan pengaturan |
| `/api/v1/pengaturan` | PUT | Admin | Perbarui pengaturan |
| `/api/v1/pengguna` | GET | Admin | Daftar pengguna |
| `/api/v1/pengguna` | POST | Admin | Buat pengguna |
| `/api/v1/pengguna/:id` | PUT | Admin | Perbarui pengguna |
| `/api/v1/pengguna/:id` | DELETE | Admin | Nonaktifkan pengguna |
| `/api/v1/role` | GET | Admin | Daftar role |
| `/api/v1/role` | POST | Admin | Buat role |
| `/api/v1/role/:id` | PUT | Admin | Perbarui role |
| `/api/v1/role/:id` | DELETE | Admin | Hapus role |
| `/api/v1/profil` | GET | Autentikasi | Profil pengguna |
| `/api/v1/profil` | PUT | Autentikasi | Perbarui profil |
| `/api/v1/profil/password` | PUT | Autentikasi | Ubah password |

## Contoh Request dan Response

### Login Sukses

Request:

```json
POST /api/v1/auth/login
{
  "username": "admin@sagudevelopment.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Berhasil masuk",
  "data": {
    "user": {
      "id": "uuid-here",
      "username": "admin@sagudevelopment.com",
      "email": "admin@sagudevelopment.com",
      "role": "admin",
      "full_name": "Administrator"
    },
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci..."
  }
}
```

### Validasi Gagal

Response:

```json
{
  "success": false,
  "message": "Validasi gagal",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "username", "message": "Username wajib diisi" }
    ]
  }
}
```

## Catatan Penting

- Semua endpoint yang tidak tercantum dalam spesifikasi ini tidak tersedia pada fase MVP.
- Versioning API menggunakan path: `/api/v1/`.
- Rate limit menerapkan maksimal 100 request per menit per pengguna.
- Semua tanggal menggunakan format ISO 8601 (`YYYY-MM-DD`).
- Semua waktu menggunakan zona waktu WIB (UTC+7).