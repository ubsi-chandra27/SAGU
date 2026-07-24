# Architecture

## Arsitektur Aplikasi SAGU

Dokumen ini menjelaskan arsitektur keseluruhan aplikasi SAGU, mencakup struktur modular, alur data, dan pertimbangan teknis.

## Gambaran Umum

SAGU adalah aplikasi web SaaS berbasis multi-tenant (satu instansi per sekolah). Arsitektur mengikuti pola modular dengan pemisahan yang jelas antara lapisan autentikasi, otorisasi, bisnis, dan data.

## Pola Arsitektur

### Arsitektur Berlapis (Layered Architecture)

SAGU menggunakan arsitektur berlapis untuk memisahkan tanggung jawab:

1. **Presentation Layer** — Antarmuka pengguna (frontend dashboard).
2. **Application Layer** — Logika bisnis, validasi, dan orkestrasi use case.
3. **Domain Layer** — Model entitas dan aturan domain inti.
4. **Data Access Layer** — Interaksi dengan database (repository pattern).
5. **Infrastructure Layer** — Layanan pendukung seperti email, storage, caching.

### Modul-MODUL

SAGU dibagi menjadi modul-modul independen yang memiliki tanggung jawab jelas:

| Modul | Tanggung Jawab |
|---|---|
| Auth | Login, logout, registrasi, refresh token, reset password |
| User Management | Pengelolaan akun pengguna dan profile |
| RBAC | Role, permission, dan proteksi route |
| School Settings | Pengaturan sekolah dan institusi |
| Academic Year | Pengelolaan tahun ajaran dan semester |
| Classes & Rombels | Pengelolaan kelas dan rombel |
| Subjects | Pengelolaan mata pelajaran |
| Teacher Management | Data guru dan penugasan mengajar |
| Student Management | Data siswa dan relasi orang tua |
| Attendance | Pencatatan kehadiran siswa |
| Lesson Plans | Agenda mengajar guru |
| Assessment & Grading | Penilaian siswa dan leger |
| Reports | Generate dan ekspor laporan |
| Audit | Pencatatan aktivitas sistem |
| Settings | Konfigurasi aplikasi global |

## Alur Data

### Alur Request-Response

1. Client mengirim HTTP request ke web server.
2. Web server (reverse proxy) meneruskan request ke application server.
3. Middleware autentikasi memverifikasi token.
4. Middleware otorisasi memverifikasi akses berdasarkan role.
5. Request diteruskan ke controller.
6. Controller memvalidasi input.
7. Controller memanggil service layer untuk logika bisnis.
8. Service berkomunikasi dengan repository (data access).
9. Repository berinteraksi dengan database.
10. Response dikembalikan melalui alur yang sama.

### Alur Otentikasi

1. User mengirim kredensial login.
2. Auth service memverifikasi kredensial.
3. JWT access token dan refresh token diterbitkan.
4. Client menyimpan token secara aman.
5. Setiap request API menyertakan access token.
6. Auth middleware memvalidasi token pada setiap request.
7. Jika token expired, client menggunakan refresh token.

## Struktur Direktori Backend (Konseptual)

```
src/
├── config/
│   ├── auth.php
│   ├── database.php
│   └── app.php
├── controllers/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Teacher/
│   ├── Student/
│   ├── Rombel/
│   ├── Attendance/
│   ├── Grade/
│   ├── LessonPlan/
│   ├── Report/
│   ├── Setting/
│   └── User/
├── middleware/
│   ├── Authenticate.php
│   ├── Authorize.php
│   └── Audit.php
├── models/
│   ├── User.php
│   ├── Teacher.php
│   ├── Student.php
│   ├── Rombel.php
│   ├── Subject.php
│   ├── Attendance.php
│   ├── Grade.php
│   └── LessonPlan.php
├── repositories/
│   ├── UserRepository.php
│   ├── TeacherRepository.php
│   └── (setiap entitas)
├── services/
│   ├── AuthService.php
│   ├── TeacherService.php
│   ├── AttendanceService.php
│   └── (setiap use case)
├── routes/
│   ├── api.php
│   └── web.php
├── utils/
│   ├── helpers.php
│   ├── validators.php
│   └── response.php
└── exceptions/
    ├── ApiException.php
    └── ValidationException.php
```

## Pertimbangan Keamanan

- Semua komunikasi menggunakan HTTPS.
- Password di-hash sebelum disimpan.
- SQL injection dicegah menggunakan query builder atau ORM.
- XSS dicegah melalui output encoding.
- CSRF protection diaktifkan.
- Rate limiting pada endpoint login dan publik.
- Input validation di sisi client dan server.
- Audit log untuk aktivitas sensitif.

## Skalabilitas

- Arsitektur modular memungkinkan penambahan modul baru tanpa merusak modul existing.
- Database dirancang dengan index yang tepat untuk performa query.
- Caching dapat ditambahkan untuk data yang sering diakses (misalnya dropdown).
- Statelessness JWT memungkinkan horizontal scaling application server.

## Ketergantungan Eksternal

Pada fase MVP, SAGU tidak memiliki ketergantungan eksternal selain:

- Server email (opsional, untuk fitur forgot password).
- Storage lokal untuk upload file (logo, foto profil).

Ketergantungan eksternal di masa depan (fase lanjutan) dapat mencakup:

- Notifikasi push (email/SMS).
- Integrasi Dapodik.
- Layanan email transactional.