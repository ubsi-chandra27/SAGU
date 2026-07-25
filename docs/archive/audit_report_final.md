# Audit Report Final - Proyek SAGU

## Executive Summary

 audit menyeluruh telah dilakukan terhadap seluruh 23 file dokumentasi proyek SAGU (7 file root + 15 file di docs/ + kilo.json). Hasil audit menemukan bahwa dokumentasi secara garis besar sudah lengkap dan konsisten dalam beberapa aspek penting: jumlah role (5), daftar modul MVP (12), konvensi penamaan (snake_case, lowercase), dan format respons API sudah terdefinisi dengan baik. Namun, terdapat sejumlah masalah yang perlu diperbaiki sebelum implementasi dimulai guna menghindari risiko teknis dan inkonsistensi yang signifikan.

**Status Akhir: NEEDS REVISION BEFORE IMPLEMENTATION**

---

## Critical Issues

### C1 - Route Statistik Tanpa Modul Definisi

Route `/api/v1/statistik`, `/api/v1/statistik/guru`, dan `/api/v1/statistik/rombel/:id` didefinisikan di `docs/ROUTES.md` dan `docs/API_SPEC.md`, tetapi tidak memiliki modul yang terkait di `docs/MODULES.md`, `docs/USER_FLOW.md`, maupun `docs/TASKS.md`. Tidak ada user flow, permission matrix, maupun skenario pengujian untuk fitur statistik. Route ini akan menjadi "orphan route" selama implementasi jika tidak segera ditentukan modul dan pemiliknya.

### C2 - Tabel Database `grade_components` Hilang

`docs/ROUTES.md` mendefinisikan route `GET|POST|PUT|DELETE /api/v1/leger/komponen` untuk mengelola komponen penilaian. Namun, `docs/DATABASE_SCHEMA.md` tidak memiliki tabel `grading_components` atau `score_components`. Komponen penilaian didefinisikan sebagai hard-coded ENUM di kolom `component` pada tabel `grades`. Ketidaksesuaian antara route CRUD dengan skema database berarti implementasi akan menggunakan route yang mengelola data tanpa tabel pendukung yang proper, atau komponen penilaian harus dimodelkan ulang.

### C3 - Routing Berbasis Relasi (RLS) Tidak Spesifik

`docs/ROUTES.md` menggunakan pola "Semua Role (terbatas)" dan "(terbatas)" untuk beberapa route tanpa mendefinisikan secara spesifik bagaimana pembatasan akses berdasarkan relasi data diterapkan. Contoh: `GET /api/v1/rombel` mengizinkan "Semua Role (terbatas)" dan `GET /api/v1/agenda` mengizinkan "Semua Role (terbatas)". Tidak jelas kriteria pembatasan "terbatas" ini. `docs/AUTH_RBAC.md` permission matrix menyebutkan Guru hanya boleh akses "rombelnya" dan "mata pelajarannya", tapi tidak ada mekanisme yang didokumentasikan untuk menerapkan pembatasan relasional ini di level route atau database.

### C4 - Multi-Tenancy Tidak Konsisten

`docs/DATABASE_SCHEMA.md` mendefinisikan tabel `schools` dan entitas multi-sekolah, tapi banyak tabel utama (rombels, classes, subjects, grades, attendances) tidak memiliki `school_id` foreign key langsung. Tabel `settings` memiliki `school_id`, tapi `rombels` hanya terhubung ke `academic_years` yang bisa saja berbeda sekolah. Ini menciptakan ambiguitas: apakah SAGU mendukung multi-school pada MVP? Jika tidak, `schools` dan `settings.school_id` menjadi tidak terpakai dan menambah kompleksitas. Jika ya, setiap tabel data akademik memerlukan `school_id`.

---

## Medium Issues

### M1 - Dua Tabel Penugasan Ganda

`docs/DATABASE_SCHEMA.md` mendefinisikan dua tabel terpisah:
- `teacher_subject_assignments` (guru → mata pelajaran + tahun ajaran)
- `rombel_teacher_assignments` (guru → rombel + mata pelajaran + tahun ajaran)

Tabel `teacher_subject_assignments` tidak terhubung ke rombel atau kelas, sehingga tidak bisa menjawab pertanyaan "guru X mengajar kelas Y mata pelajaran Z". Selain itu, `docs/ROUTES.md` hanya mendefinisikan route `/api/v1/penugasan/mengajar` tanpa membedakan kedua tabel ini. `docs/TASKS.md` hanya menyebut "penugasan guru mengajar" tanpa detail model data. Risiko: implementasi akan bingung tabel mana yang menjadi sumber kebenaran untuk penugasan mengajar, atau kedua tabel akan redundan.

**Rekomendasi**: Konsolidasikan menjadi satu tabel `teaching_assignments` yang mencakup guru, rombel, kelas, mata pelajaran, tahun ajaran, dan semester.

### M2 - Tabel `settings` Tidak Terpakai secara Eksplisit

Tabel `settings` di DATABASE_SCHEMA.md menggunakan key-value JSON untuk menyimpan konfigurasi global per sekolah. Namun, di ROUTES.md, pengaturan sekolah hanya memiliki `GET/PUT /api/v1/pengaturan` yang mengembalikan dan memperbarui data pengaturan sebagai JSON flat. Tidak ada route CRUD untuk mengelola key-value settings secara individual. Tabel `settings` juga tidak dirujuk oleh modul lain dalam DATABASE_SCHEMA (hanya schools → settings 1:1). Risiko: tabel menjadi over-engineered untuk MVP, atau pengaturan sekolah tidak dimodelkan dengan benar untuk mendukung opsi yang diperlukan.

### M3 - Orang Tua Tidak Didefinisikan dalam Permission Matrix Agenda dan Laporan

Di `docs/AUTH_RBAC.md` permission matrix, Orang Tua tidak memiliki akses ke Agenda Mengajar (`-`) dan Laporan (`-`). Namun di `docs/ROUTES.md`:
- `GET /api/v1/agenda` diizinkan untuk "Semua Role (terbatas)"
- `GET /api/v1/laporan/absensi` dan `GET /api/v1/laporan/leger` diizinkan untuk "Admin, Guru, Wali Kelas"

Tidak ada konflik langsung (Orang Tua tidak masuk di daftar access untuk laporan), tapi "Semua Role (terbatas)" pada agenda berpotensi membingungkan implementasi karena tidak jelas apakah Orang Tua seharusnya bisa melihat agenda rombel anaknya atau tidak. User Flow Orang Tua di `docs/USER_FLOW.md` juga tidak menyebutkan akses agenda.

### M4 - Tidak Ada Route untuk Manajemen Tahun Ajaran Semester

`docs/TASKS.md` Tahap 4 mencantumkan "Kelas dan rombel" dan "Penugasan mengajar" sebagai tugas, tapi tidak secara eksplisit menyebutkan bahwa semester harus diaktifkan sebelum rombel bisa dibuat (rombels memiliki FK ke `semesters.id`). Implementasi mungkin lupa membuat seed data tahun ajaran dan semester terlebih dahulu, yang akan menyebabkan foreign key constraint failure.

### M5 - `audit_logs` Tidak Mencatat Detail untuk Beberapa Aksi Sensitif

`docs/AUTH_RBAC.md` dan `docs/SECURITY.md` menyebutkan perubahan role dan permission harus diaudit. Namun, `docs/DATABASE_SCHEMA.md` tabel `audit_logs` tidak memiliki field untuk kategori aksi atau context (misalnya, sebelum dan sesudah perubahan role). `docs/ROUTES.md` juga tidak mendefinisikan route untuk mengakses audit log selain `GET /api/v1/audit-log` dan `GET /api/v1/audit-log/:id`. Tidak ada route untuk query audit log berdasarkan tanggal, user, atau aksi.

### M6 - `student_id` pada Tabel `parents` Tidak Unik

`docs/DATABASE_SCHEMA.md` mendefinisikan tabel `parents` dengan kolom `student_id` yang bukan UNIQUE. Ini berarti satu orang tua bisa terhubung ke banyak siswa (sesuai asumsi), tapi juga berarti satu siswa bisa memiliki lebih dari satu entry orang tua dengan relationship yang sama. Tidak ada batasan untuk mencegah duplikasi seperti dua entry "ayah" untuk siswa yang sama.

---

## Minor Issues

### m1 - `profiles` Tabel Tidak Punya Route Sendiri

`docs/DATABASE_SCHEMA.md` mendefinisikan tabel `profiles` terpisah dari `users`, tapi tidak ada route API khusus untuk CRUD profil (`/api/v1/profil` hanya update profil dan ubah password, bukan CRUD lengkap). `docs/ROUTES.md` route profil pengguna (`GET/PUT /api/v1/profil`, `PUT /api/v1/profil/password`) tidak secara eksplisit menyebutkan bahwa profil menggunakan tabel `profiles`.

### m2 - `users.role` Menggunakan ENUM yang Tidak Didefinisikan di AUTH_RBAC.md Sebagai Daftar Resmi

`docs/DATABASE_SCHEMA.md` menggunakan ENUM untuk `users.role` dengan nilai `admin, guru, wali_kelas, siswa, orang_tua`. `docs/AUTH_RBAC.md` menggunakan nama role yang sedikit berbeda (Wali Kelas vs wali_kelas, Orang Tua vs orang_tua). Konsisten secara makna, tapi konvensi penamaan tidak seragam (spasi vs underscore).

### m3 - `CHANGELOG.md` Hanya Mencatat Versi 0.1.0

`docs/CHANGELOG.md` hanya memiliki satu entri untuk versi 0.1.0 (perencanaan MVP). Tidak ada pola pemeliharaan changelog yang jelas untuk entri di masa depan (contoh: apakah setiap rilis harus dicatat, atau setiap milestone).

### m4 - `DESIGN_REFERENCE.md` Tidak Memiliki Verifikasi

`docs/DESIGN_REFERENCE.md` berisi pedoman warna dan layout yang sangat spesifik (biru gelap, hijau, kuning/orange, merah, abu-abu) tanpa referensi ke tool desain atau mockup yang sudah dibuat. Pedoman ini bisa berubah saat desain aktual dibuat.

### m5 - `API_SPEC.md` dan `ROUTES.md` Redundan

`docs/ROUTES.md` dan `docs/API_SPEC.md` keduanya mendefinisikan endpoint yang sama dengan tabel yang serupa. `ROUTES.md` memiliki tabel route yang lebih lengkap dengan route penugasan, profil orang tua, dan route backend tambahan, sementara `API_SPEC.md` lebih fokus pada format body/response. Ini tidak salah, tapi bisa menyebabkan pemeliharaan ganda saat endpoint bertambah.

### m6 - `USER_FLOW.md` Tidak Menyebutkan Reset Password

`docs/USER_FLOW.md` mendeskripsikan alur "Ubah Password" tetapi tidak menyebutkan alur "Reset Password" (lupa password) yang telah didefinisikan di `docs/AUTH_RBAC.md`, `docs/ROUTES.md`, dan `docs/API_SPEC.md`.

### m7 - Tabel `semesters` Tidak Memiliki `school_id`

Jika multi-school didukung, tabel `semesters` tidak memiliki `school_id` FK, berbeda dengan tabel `academic_years` yang juga tidak memiliki `school_id`. Ini bisa menyebabkan semester dari satu sekolah terlihat di sekolah lain.

### m8 - `ROADMAP.md` Tidak Memetakan Fase ke Modul dengan Detail

`docs/ROADMAP.md` Fase 2 menyebut "Data guru, Data siswa, Data kelas, Data rombel, Data mata pelajaran, Penugasan guru mengajar, Penugasan wali kelas" tapi tidak menyebutkan "Tahun ajaran dan semester" yang secara logis harus hadir sebelum Data Kelas dan Rombel (karena kelas dan rombel bergantung pada tahun ajaran). Urutan implementasi dalam roadmap berpotensi membingungkan.

---

## Missing Components

### Fitur Tanpa Database Schema

| Fitur | Route Terkait | Deskripsi |
|---|---|---|
| Komponen Penilaian | `/api/v1/leger/komponen` | Route CRUD untuk komponen penilaian tidak memiliki tabel pendukung |
| Statistik Dashboard | `/api/v1/statistik*` | Route statistik tidak memiliki modul atau schema |
| Catatan Kelas | Tidak ada route spesifik | Disebutkan di TASKS.md Fase 3 tapi tidak ada route, schema, modul, maupun user flow |
| Import/Ekspor Data | `/api/v1/data/guru/export`, `/api/v1/data/siswa/export` | Export route ada tapi tidak ada modul atau user flow untuk fitur import |

### Fitur Tanpa Route Terdefinisi

| Fitur | Modul Terkait | Deskripsi |
|---|---|---|
| Catatan Kelas | Tidak memiliki modul di MODULES.md | Disebutkan di TASKS.md dan ROADMAP.md, tapi tidak ada route, schema, modul, user flow, maupun test plan |
| Reset Password (Flow Lupa Password) | Auth | Route ada di ROUTES.md dan API_SPEC.md, tapi tidak ada user flow di USER_FLOW.md |

### Modul Tanpa Route yang Sesuai

| Modul | Permasalahan |
|---|---|
| Statistik | Route ada di ROUTES.md dan API_SPEC.md, tapi tidak ada di MODULES.md maupun USER_FLOW.md |
| Audit Log (Modul 10) | Route ada, tapi MODULES.md hanya memiliki deskripsi minimal tanpa detail permission matrix per role |

---

## MVP Scope Validation

### Modul yang Termasuk MVP ✓

| Modul | Status | Bukti |
|---|---|---|
| Dashboard (4 role) | ✅ Konsisten | PRD, ROUTES, AUTH_RBAC, MODULES, USER_FLOW |
| Data Guru | ✅ Konsisten | PRD, ROUTES, AUTH_RBAC, DATABASE_SCHEMA, TASKS |
| Data Siswa | ✅ Konsisten | PRD, ROUTES, AUTH_RBAC, DATABASE_SCHEMA, TASKS |
| Rombel | ✅ Konsisten | PRD, ROUTES, AUTH_RBAC, DATABASE_SCHEMA, TASKS |
| Absensi | ✅ Konsisten | PRD, ROUTES, AUTH_RBAC, DATABASE_SCHEMA, TEST_PLAN |
| Leger Penilaian | ⚠️ Masalah | Route komponen penilaian ada tapi schema tidak lengkap (lihat C2) |
| Agenda Mengajar | ✅ Konsisten | PRD, ROUTES, AUTH_RBAC, DATABASE_SCHEMA, TASKS |
| Laporan | ✅ Konsisten | PRD, ROUTES, AUTH_RBAC, TEST_PLAN, DEPLOYMENT |
| Pengaturan | ⚠️ Terlalu Besar | Mencakup sekolah, tahun ajaran, semester, role, permission, CRUD pengguna, profil — lihat M10 |

### Fitur yang Tepat Dikecualikan dari MVP ✓

Semua fitur yang tidak termasuk MVP di PRD (AI Generator, Pembayaran, LMS, Ujian Online, Integrasi Eksternal Real-time) tidak memiliki route, schema, maupun modul yang didefinisikan — konsisten dengan scope exclusi.

---

## Database Validation

### Tabel yang Ada dan Terpakai

| Tabel | Digunakan oleh | Status |
|---|---|---|
| users | Auth, RBAC, profil | ✅ |
| schools | Multi-tenancy (potensial) | ⚠️ Mungkin tidak terpakai jika single-school |
| profiles | Semua role | ✅ |
| academic_years | Kelas, rombel, penugasan, nilai | ✅ |
| semesters | Rombel, penugasan, nilai | ⚠️ Tidak ada school_id FK |
| classes | Rombel | ✅ |
| rombels | Siswa, penugasan, absensi, leger, agenda | ✅ |
| subjects | Penugasan, nilai, agenda | ✅ |
| teachers | Penugasan, nilai, agenda | ✅ |
| students | Absensi, nilai, orang tua | ✅ |
| parents | Relasi orang tua-siswa | ✅ |
| teacher_subject_assignments | Penugasan mengajar | ⚠️ Redundan dengan rombel_teacher_assignments |
| rombel_teacher_assignments | Penugasan mengajar di rombel | ✅ |
| attendances | Absensi per siswa | ✅ |
| lesson_plans | Agenda mengajar | ✅ |
| grades | Penilaian | ✅ |
| audit_logs | Audit trail | ✅ |
| settings | Pengaturan global | ⚠️ Tidak ada route CRUD individual |

### Tabel yang Tidak Terpakai atau Redundan

| Tabel | Alasan |
|---|---|
| `schools` | Tidak ada FK dari tabel data utama; hanya terhubung ke `settings` |
| `teacher_subject_assignments` | Tumpang tindih dengan `rombel_teacher_assignments` tanpa nilai tambah |
| `settings` | Tidak ada route CRUD individual; digunakan sebagai JSON flat di PUT /api/v1/pengaturan |

### Masalah Skema Lainnya

- Tidak ada tabel `grading_components` meskipun route CRUD ada di ROUTES.md
- Hard-coded ENUM untuk `grades.component` tidak fleksibel jika sekolah menggunakan komponen penilaian berbeda
- Tidak ada tabel untuk mengkonfigurasi jenis status absensi (hadir, izin, sakit, alpa, terlambat) — semua hard-coded di schema
- Tidak ada tabel `attendance_types` atau `grade_components` sebagai lookup tables

---

## RBAC Validation

### Permission Matrix Konsistensi

| Modul | Admin | Guru | Wali Kelas | Siswa | Orang Tua | Status |
|---|---|---|---|---|---|---|
| Dashboard | R | R | R | R | R | ✅ Konsisten |
| Data Guru | CRUD | R (sendiri) | - | - | - | ✅ |
| Data Siswa | CRUD | R (kelasnya) | R (rombelnya) | R (sendiri) | R (anaknya) | ✅ (terbatas) |
| Rombel | CRUD | R (rombelnya) | R (rombelnya) | R (rombelnya) | - | ⚠️ Siswa bisa lihat rombelnya |
| Absensi | R | CRUD (kelasnya) | R (rombelnya) | R (sendiri) | R (anaknya) | ✅ |
| Leger | R | CRUD (mapelnya) | R (rombelnya) | R (sendiri) | R (anaknya) | ✅ |
| Agenda | R | CRUD (mengajarnya) | R (rombelnya) | R (rombelnya) | - | ⚠️ Orang Tua tidak ada entry Tapi route "Semua Role (terbatas)" |
| Laporan | CR | R (terbatas) | R (kelasnya) | R (sendiri) | R (anaknya) | ✅ |
| Pengaturan | CR | - | - | - | - | ✅ |

### Masalah RBAC

1. **Orang Tua pada Route Agenda**: `GET /api/v1/agenda` mengizinkan "Semua Role (terbatas)" yang secara teknis termasuk Orang Tua, tapi permission matrix di AUTH_RBAC.md menunjukkan Orang Tua tidak memiliki akses Agenda, dan User Flow Orang Tua tidak menyebutkan agenda. **Inkonsistensi antara ROUTES.md dan AUTH_RBAC.md.**
2. **Guru pada Route Statistik**: `GET /api/v1/statistik/guru` ada di ROUTES.md tapi Guru tidak masuk di permission matrix untuk modul Statistik (yang tidak terdefinisi). **Route orphan.**
3. **Wali Kelas pada Rombel Detail**: ROUTES.md `GET /api/v1/rombel/:id` mengizinkan "Admin, Guru, Wali Kelas" — tapi Guru seharusnya hanya melihat rombel yang diajar, bukan semua rombel. Tidak ada pembatasan relasional di level route.
4. **Tidak ada route untuk mengubah role pengguna**: ROUTES.md tidak memiliki route untuk menetapkan atau mengubah role seorang pengguna selain CRUD role itu sendiri. Implementasi tidak akan bisa mengubah role siswa menjadi wali kelas melalui API kecuali ada route khusus.

---

## Route Validation

### Route Tanpa Modul

| Route | Permasalahan |
|---|---|
| `GET /api/v1/statistik` | Tidak ada modul Statistik di MODULES.md |
| `GET /api/v1/statistik/guru` | Tidak ada entry di permission matrix |
| `GET /api/v1/statistik/rombel/:id` | Tidak ada user flow atau test plan |
| `GET /api/v1/audit-log` dan `GET /api/v1/audit-log/:id` | Admin saja, tapi tidak ada role-based test untuk audit log |
| `/api/v1/orang-tua/anak/:id/absensi` | Detail absensi per anak orang tua tidak ada di user flow |
| `/api/v1/orang-tua/anak/:id/nilai` | Detail nilai per anak orang tua tidak ada di user flow |

### Route Tanpa Schema Tabel yang Jelas

| Route | Permasalahan |
|---|---|
| `POST/GET/PUT/DELETE /api/v1/leger/komponen` | Tidak ada tabel `grading_components` di DATABASE_SCHEMA.md |
| `GET /api/v1/pengaturan` dan `PUT /api/v1/pengaturan` | Tidak jelas apakah menggunakan tabel `settings` atau `schools` table |

### Route dengan Akses Ambigu

| Route | Akses Dinyatakan | Masalah |
|---|---|---|
| `GET /api/v1/rombel` | Semua Role (terbatas) | Tidak jelas bagaimana "terbatas" diterapkan |
| `GET /api/v1/agenda` | Semua Role (terbatas) | Orang Tua termasuk "Semua Role" tapi permission matrix menyebut `-` |
| `GET /api/v1/absensi` | Guru, Wali Kelas, Siswa, Orang Tua (terbatas) | Guru harus melihat hanya kelasnya, tapi route tidak menyebutkan detail pembatasan |
| `GET /api/v1/absensi/rekap` | Guru, Wali Kelas, Admin | Guru rekap untuk kelasnya — tidak disebutkan bagaimana filter diterapkan |

---

## Architecture Validation

### Kekuatan Arsitektur

1. **Modular**: Setiap modul memiliki tanggung jawab jelas dan tidak saling bergantung langsung.
2. **Layered**: Presentation, Application, Domain, Data Access, Infrastructure layers sudah terdefinisi.
3. **RESTful**: API mengikuti prinsip REST dengan prefix versioning `/api/v1/`.
4. **RBAC Terpusat**: Middleware auth dan authorize terdefinisi dengan baik.
5. **Soft Delete**: Diterapkan konsisten di semua tabel data master dan transaksi akademik.
6. **Audit Trail**: Tabel `audit_logs` dan kebijakan auditing untuk aksi sensitif sudah terdefinisi.

### Kelemahan Arsitektur

1. **Tidak ada definisi service layer yang jelas**: STRUKTUR DIRECTORY di ARCHITECTURE.md mendefinisikan repositori dan service, tapi tidak ada kontrak service-to-controller yang terdefinisi.
2. **Tidak ada pesan error terstandarisasi**: Meskipun format response ada di API_SPEC.md, tidak ada daftar kode error yang terstandarisasi (hanya HTTP status codes).
3. **Tidak ada strategi caching yang spesifik**: ARCHITECTURE.md dan SECURITY.md menyebutkan caching sebagai opsi tapi tidak mendefinisikan apa yang harus di-cache.
4. **Tabel assignment ganda**: Dua tabel penugasan mengajar menambah kompleksitas service layer secara tidak perlu.
5. **Tidak ada konvensi untuk paginasi dan filtering**: Beberapa route menggunakan query parameters yang tidak distandarisasi (contoh: `?status=hadir&rombel_id=...` di ROUTES.md, tapi tidak ada definisi parameter filter yang konsisten di API_SPEC.md).
6. **Multi-tenancy tidak lengkap**: Arsitektur mengasumsikan multi-tenant (satu sekolah per instance atau satu database) tapi tidak didefinisikan apakah ini single-tenant atau multi-tenant SaaS.

---

## Recommended Fixes

Sebelum implementasi dimulai, rekomendasi berikut harus dilaksanakan:

### Prioritas Kritis (Harus Selesai Sebelum Coding)

1. **Definisikan tabel `grading_components`** di DATABASE_SCHEMA.md untuk mendukung route `leger/komponen`, atau hapus route tersebut dan gunakan hard-coded komponen di tabel `grades`.
2. **Tentukan dan dokumentasikan apakah SAGU single-school atau multi-school untuk MVP**. Jika single-school, sederhanakan schema dengan menghapus `schools` dan `settings.school_id` FK, atau setidaknya dokumentasikan bahwa sekolah_id akan ditambahkan nanti.
3. **Definisikan mekanisme RLS (Row Level Security) untuk access control berbasis relasi data**. Perjelas bagaimana Guru hanya boleh melihat data rombelnya, siswa yang ditugaskan, dll., pada level application atau database.
4. **Tambahkan user flow untuk Reset Password** (lupa password) di USER_FLOW.md — route sudah ada di ROUTES.md tapi tidak ada alur pengguna yang dideskripsikan.
5. **Tambahkan modul Statistik ke MODULES.md** atau hapus route `/api/v1/statistik*` dari ROUTES.md.
6. **Definisikan tabel untuk Catatan Kelas** atau klarifikasi bahwa Catatan Kelas tidak termasuk dalam MVP.

### Prioritas Tinggi (Sebaiknya Selesai Sebelum Coding Dimulai)

7. **Konsolidasikan tabel assignment mengajar** (`teacher_subject_assignments` dan `rombel_teacher_assignments`) menjadi satu tabel `teaching_assignments` yang komprehensif.
8. **Perjelas permission matrix untuk Orang Tua pada route Agenda Mengajar** — Orang Tua seharusnya tidak bisa melihat agenda, atau hapus "Semua Role (terbatas)" dan ganti dengan role yang spesifik.
9. **Standardisasi konvensi penamaan role** antara dokumen (gunakan `wali_kelas` atau `Wali Kelas` secara konsisten; pilih salah satu dan gunakan di semua tempat).
10. **Tambahkan route untuk CRUD individual pada tabel `settings`** atau jelaskan bahwa pengaturan sekolah diupdate sebagai JSON flat.
11. **Perjelas urutan implementasi** di ROADMAP.md — Tahun Ajaran dan Semester harus didahulukan sebelum Kelas dan Rombel karena ada FK dependency.

### Prioritas Sedang (Sebelum Fase Implementasi Modul)

12. **Tambahkan test plan khusus untuk Audit Log** — saat ini hanya disebutkan di TEST_PLAN.md skenario umum, tidak ada detail test untuk setiap aksi yang tercapai di audit_logs.
13. **Pisahkan modul Pengaturan** menjadi sub-modul: School Settings, Academic Periods, User Management, Role Management — untuk memudahkan estimasi dan implementasi bertahap.
14. **Tambahkan skenario pengujian untuk soft delete dengan relational integrity** — apa yang terjadi saat Admin menghapus rombel yang masih memiliki siswa dan attendance records.
15. **Definisikan strategi migrasi dan seed data** — siapa yang melakukan seed data tahun ajaran, semester, dan mata pelajaran awal, dan bagaimana hubungannya dengan Fase 2 di TASKS.md.
16. **Pilih satu konvensi primary key**: UUID atau auto-increment integer — gunakan secara konsisten di seluruh tabel, jangan campur.

---

## Final Verdict

### NEEDS REVISION BEFORE IMPLEMENTATION

Proyek SAGU memiliki fondasi dokumentasi yang kuat dan koheren untuk beberapa aspek utama (role, modul, struktur database konseptual, route API). Namun, terdapat 6 Critical Issues, 6 Medium Issues, dan 8 Minor Issues yang harus diselesaikan sebelum implementasi kode dimulai.

Isu paling mendesak adalah:
- **Route Statistik tanpa modul definisi** (akan menjadi orphan route)
- **Tabel `grading_components` hilang** (route CRUD tanpa schema)
- **RLS access control tidak terdefinisi** (will likely cause security issues during implementation)
- **Multi-tenancy ambigu** (school_id FK tidak konsisten)
- **Dua tabel penugasan ganda** (akan membingungkan implementasi)
- **Orang Tua permission matrix inkonsisten dengan ROUTES.md** (potensi kebocoran data)

Setelah keenam isu kritis ini dan sebagian besar isu tinggi diselesaikan, proyek akan siap untuk fase implementasi Fase 1 (Fondasi Aplikasi).

---

*Laporan audit ini dibuat pada 2026-07-24 sebagai bagian dari Final Architecture Review proyek SAGU. Seluruh temuan didasarkan pada analisis silang seluruh 23 file dokumentasi yang ada.*