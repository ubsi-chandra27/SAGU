# Deployment Guide

## Panduan Deployment SAGU

Dokumen ini memberikan panduan untuk mendeploy aplikasi SAGU ke lingkungan produksi. Panduan ini akan diperbarui begitu stack teknologi final ditentukan.

## Prasyarat Deployment

### Server Requirements

Minimum requirements untuk server produksi:

- **OS**: Linux (Ubuntu 20.04+ atau distro stabil lainnya) atau Windows Server.
- **Web Server**: Nginx atau Apache sebagai reverse proxy.
- **Runtime**: Sesuai dengan runtime stack backend yang dipilih (contoh: Node.js, PHP, Python, dll).
- **Database**: MySQL 8.0+, PostgreSQL 12+, atau database yang sesuai dengan keputusan teknis.
- **RAM**: Minimal 1 GB untuk penggunaan internal sekolah.
- **CPU**: Minimal 1 core vCPU.
- **Storage**: Minimal 10 GB ruang disk tersedia.

### Domain dan SSL

- Domain harus terdaftar dan mengarah ke server.
- SSL/TLS wajib untuk produksi (menggunakan Let's Encrypt atau sertifikat berbayar).
- HTTP akan di-redirect ke HTTPS.
- HSTS (HTTP Strict Transport Security) harus diaktifkan.

## Struktur Direktori Deployment

Struktur direktori yang diusulkan:

```
/sagu/
├── .env
├── .env.example
├── docker-compose.yml          (jika menggunakan container)
├── package.json                (atau berkas dependensi stack)
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── database/
│   ├── migrations/
│   └── seeds/
├── public/
│   ├── uploads/
│   └── assets/
├── storage/
│   ├── logs/
│   └── backups/
├── tests/
├── docs/
└── README.md
```

## Variabel Lingkungan

File `.env` wajib ada dan tidak boleh di-commit ke version control.

| Variabel | Keterangan | Contoh |
|---|---|---|
| `APP_ENV` | Lingkungan aplikasi | `production` |
| `APP_KEY` | Kunci enkripsi aplikasi | `base64:...` |
| `DB_HOST` | Host database | `localhost` |
| `DB_PORT` | Port database | `3306` |
| `DB_DATABASE` | Nama database | `sagu_production` |
| `DB_USERNAME` | Username database | `sagu_user` |
| `DB_PASSWORD` | Password database | `***` |
| `APP_URL` | URL aplikasi | `https://sagu.sekolah.example.com` |
| `JWT_SECRET` | Secret JWT | `***` |
| `JWT_EXPIRATION` | Kedaluwarsa access token | `900` (detik) |
| `JWT_REFRESH_EXPIRATION` | Kedaluwarsa refresh token | `604800` (7 hari) |
| `LOG_LEVEL` | Level log | `info` atau `debug` |
| `MAIL_MAILER` | Driver email | `smtp` |
| `MAIL_HOST` | Host SMTP | `smtp.mail.example.com` |
| `MAIL_PORT` | Port SMTP | `587` |
| `MAIL_FROM_ADDRESS` | Email pengirim | `noreply@sagu.example.com` |
| `BACKUP_PATH` | Jalur backup database | `/sagu/storage/backups/` |

## Langkah Deployment

### 1. Persiapan Server

1. Update dan upgrade server.
2. Install runtime dan dependensi yang diperlukan.
3. Install web server dan konfigurasi reverse proxy.
4. Install dan konfigurasi database.
5. Konfigurasi firewall dan keamanan dasar.

### 2. Konfigurasi Aplikasi

1. Clone repository ke server.
2. Salin `.env.example` ke `.env`.
3. Atur semua variabel lingkungan untuk produksi.
4. Generate application key dan JWT secret.
5. Set permissions direktori yang tepat (storage, logs, uploads).

### 3. Database Setup

1. Buat database produksi.
2. Buat user database dengan hak akses yang sesuai.
3. Jalankan migrasi database: `php artisan migrate` atau setara.
4. Jalankan seed data awal (opsional, jika diperlukan data contoh).
5. Verifikasi konfigurasi database berhasil terhubung.

### 4. Build dan Optimasi

1. Install dependensi produksi: `npm ci --production` atau setara.
2. Build frontend jika ada: `npm run build`.
3. Optimasi aset (minifikasi, asset compilation).
4. Verifikasi tidak ada file development yang tersisa.

### 5. Konfigurasi Web Server

1. Konfigurasi virtual host untuk domain.
2. Atur reverse proxy ke application server.
3. Konfigurasi SSL/TLS certificate.
4. Redirect HTTP ke HTTPS.
5. Konfigurasi rate limiting di web server.
6. Konfigurasi gzip/brotli compression.
7. Konfigurasi caching yang sesuai.

### 6. Keamanan Produksi

1. Nonaktifkan directory listing.
2. Sembunyikan header server (server tokens).
3. Aktifkan CSRF protection.
4. Konfigurasi CORS sesuai kebutuhan.
5. Setup fail2ban atau proteksi brute-force.
6. Pastikan file `.env` tidak dapat diakses dari web.
7. Pastikan file sensitif dan direktori dilindungi dari akses web.

### 7. Backup dan Monitoring

1. Konfigurasi backup database otomatis harian.
2. Konfigurasi rotasi log (logrotate).
3. Setup monitoring server (CPU, RAM, disk).
4. Setup alert jika aplikasi error atau down.
5. Uji prosedur restore backup.

### 8. Launch

1. Verifikasi semua langkah di atas selesai.
2. Jalankan aplikasi.
3. Uji semua endpoint utama.
4. Verifikasi login untuk semua role.
5. Verifikasi hak akses setiap role.
6. Verifikasi laporan dapat dihasilkan.
7. Sosialisasikan kepada pengguna (admin sekolah).
8. Dokumentasikan URL, kredensial awal, dan prosedur pemeliharaan.

## Rollback

1. Identifikasi versi terakhir yang stabil.
2. Revert ke versi sebelumnya menggunakan version control (git revert atau git checkout).
3. Jalankan migrasi rollback jika diperlukan.
4. Verifikasi aplikasi berjalan dengan benar.
5. Dokumentasikan insiden rollback.

## Catatan Penting

- Backup database harus dilakukan sebelum migrasi.
- File `.env` tidak boleh dicopy dari lingkungan pengembangan ke produksi tanpa review.
- Seluruh log aplikasi harus diarahahkan ke file log, bukan ke output konsol.
- Aplikasi harus berjalan dengan user non-root pada server.