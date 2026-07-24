# Database Foundation Report — SAGU

## Ringkasan Eksekutif

Tahap Database Foundation untuk proyek SAGU telah selesai dilaksanakan dengan membangun fondasi database PostgreSQL menggunakan Prisma ORM. Fokus tahap ini adalah **hanya database** — tanpa halaman UI, dashboard, CRUD, API, atau fitur AI.

Semua dokumen referensi telah dibaca dan disinkronkan:
- AGENTS.md, README.md, MEMORY.md, PROJECT_RULES.md, ROADMAP.md, MILESTONES.md, TODO.md
- docs/PRD.md, docs/DATABASE_SCHEMA.md, docs/AUTH_RBAC.md, docs/ROUTES.md, docs/MODULES.md, docs/ACADEMIC_STRUCTURE.md, docs/BUSINESS_RULES.md, docs/WORKFLOWS.md, docs/ARCHITECTURE.md

---

## 1. Tabel yang Dibuat

Total **24 model Prisma** yang memetakan ke 24 tabel database:

### Entitas Master & Konfigurasi
| No | Tabel | Deskripsi |
|---|---|---|
| 1 | `schools` | Data master sekolah (single-school MVP) |
| 2 | `settings` | Konfigurasi key-value per sekolah (1:1 dengan schools) |

### Autentikasi & Identitas
| No | Tabel | Deskripsi |
|---|---|---|
| 3 | `users` | Akun pengguna dengan role RBAC (5 role) |
| 4 | `profiles` | Data profil tambahan (nama, gender, DOB, dll) |

### Periode Akademik
| No | Tabel | Deskripsi |
|---|---|---|
| 5 | `academic_years` | Tahun ajaran (misal: 2025/2026) |
| 6 | `semesters` | Semester dalam tahun ajaran (Ganjil/Genap) |

### Struktur Organisasi Kelas
| No | Tabel | Deskripsi |
|---|---|---|
| 7 | `classes` | Data master kelas (misal: X-IPA-1) |
| 8 | `rombels` | Rombongan belajar (instance kelas per periode) |
| 9 | `subjects` | Data master mata pelajaran |

### Personil
| No | Tabel | Deskripsi |
|---|---|---|
| 10 | `teachers` | Data guru (1:1 dengan users) |
| 11 | `students` | Data siswa (1:1 dengan users) |
| 12 | `parents` | Relasi orang tua ke siswa (1:N) |

### Inti Akademik & Penilaian
| No | Tabel | Deskripsi |
|---|---|---|
| 13 | `teaching_assignments` | Penugasan mengajar (guru + rombel + mapel + periode) |
| 14 | `learning_objectives_cp` | CP (Capaian Pembelajaran) per mata pelajaran per jenjang |
| 15 | `curriculum_modules` | LM (Lingkup Materi) per penugasan |
| 16 | `learning_objectives` | TP (Tujuan Pembelajaran) per LM |
| 17 | `meetings` | Pertemuan mengajar aktual |
| 18 | `grading_components` | Konfigurasi komponen penilaian (bobot, kategori) |
| 19 | `attendances` | Catatan kehadiran siswa |
| 20 | `lesson_plans` | Agenda mengajar terencana |
| 21 | `formative_assessments` | Penilaian formatif per TP per siswa |
| 22 | `summative_assessments` | Penilaian sumatif per LM per komponen per siswa |
| 23 | `grades_dashboard` | Nilai akhir final per siswa per semester |
| 24 | `raports` | Dokumen rapor akhir per semester |
| 25 | `audit_logs` | Log audit append-only |

**Total: 25 tabel** (24 model + 1 enum Role yang digunakan di users)

---

## 2. Relasi Antar Tabel

### Hubungan Utama (Core Academic Flow)
```
School (1) ──┬── Setting (1:1)
             ├── AcademicYear (1:N)
             │       └── Semester (1:N)
             │               └── Class (1:N)
             │                       └── Rombel (N:1)
             │                               ├── Student (N:1)
             │                               ├── TeachingAssignment (N:1)
             │                               ├── Attendance (N:1)
             │                               └── Rapor (N:1)
             │
             ├── Subject (1:N)
             │       ├── LearningObjectiveCP (1:N)
             │       └── TeachingAssignment (N:1)
             │
             ├── Teacher (1:N)
             │       └── TeachingAssignment (N:1)
             │
             └── User (1:1 per role)
                     ├── Profile (1:1)
                     ├── Teacher (1:1)
                     ├── Student (1:1)
                     ├── Parent (N:1 ke Student)
                     └── Rombel (via homeroom_teacher_id)
```

### Hubungan Akademik (Teaching Assignment sebagai Pusat)
```
TeachingAssignment (pusat hubungan)
    ├── Teacher (N:1)
    ├── Rombel (N:1)
    ├── Class (N:1)
    ├── Subject (N:1)
    ├── AcademicYear (N:1)
    ├── Semester (N:1)
    ├── CurriculumModule (LM) (1:N)
    │       └── LearningObjective (TP) (1:N)
    │               └── FormativeAssessment (1:N)
    ├── Meeting (1:N)
    │       └── FormativeAssessment (1:N)
    ├── GradingComponent (N:1)
    │       └── SummativeAssessment (N:1)
    ├── SummativeAssessment (1:N)
    └── GradeDashboard (1:N)
            └── Raport (N:1)
```

### Jenis Relasi yang Digunakan
| Tipe Relasi | Contoh | Keterangan |
|---|---|---|
| 1:1 | User ↔ Profile, User ↔ Teacher, User ↔ Student | Satu pengguna memiliki tepat satu record peran |
| 1:N | AcademicYear → Semesters, Rombel → Students | Satu induk memiliki banyak anak |
| N:1 | Attendance → Student, SummativeAssessment → GradingComponent | Balikan dari 1:N |
| M:N (via join) | Teacher ↔ Rombel ↔ Subject | Semua relasi many-to-many dipecah melalui `teaching_assignments` |

**Catatan Penting**: Tidak ada relasi M:N langsung. Semua hubungan kompleks dipecah melalui tabel perantara (terutama `teaching_assignments`).

---

## 3. Enum yang Digunakan

| Enum | Nilai | Digunakan Pada |
|---|---|---|
| `Role` | ADMIN, GURU, WALI_KELAS, SISWA, ORANG_TUA | `users.role` |
| `Gender` | LAKI_LAKI, PEREMPUAN | `profiles.gender` |
| `AttendanceStatus` | HADIR, IZIN, SAKIT, ALPHA, TERLAMBAT | `attendances.status` |
| `AssessmentCategory` | FORMATIF, SUMATIF | `grading_components.assessment_category` |
| `AssessmentTypeDetail` | HARIAN, TUGAS_HARIAN, KUIS_SINGKAT, REFLEKSI, DISKUSI, TENGAH_SEMESTER, AKHIR_SEMESTER, UTS, UAS, PROYEK, PORTOFOLIO | `grading_components.assessment_type_detail`, `formative_assessments.assessment_type` |
| `GradeLetter` | A, B, C, D, E | `grades_dashboard.letter_grade`, `raports.letter_grade` |
| `Predicate` | SANGAT_BAIK, BAIK, CUKUP, KURANG, TIDAK_MEMENUHI | `grades_dashboard.predicate`, `raports.predicate` |

**Total: 7 enum** untuk konsistensi data terbatas.

---

## 4. Struktur RBAC Database

### Role di Database
Tabel `users` memiliki kolom `role` bertipe enum `Role` dengan 5 nilai:
- `ADMIN` — akses penuh
- `GURU` — mengajar, input nilai, absensi
- `WALI_KELAS` — monitoring rombel
- `SISWA` — melihat data sendiri
- `ORANG_TUA` — melihat data anak

### Relasi RBAC
- `users.role` menentukan akses tingkat tinggi
- `teachers.user_id → users.id` — guru terhubung ke akun
- `students.user_id → users.id` — siswa terhubung ke akun
- `parents.user_id + parent_id → users.id + students.id` — orang tua terhubung ke siswa
- `rombels.homeroom_teacher_id → users.id` — wali kelas (dapat jadi GURU atau WALI_KELAS)
- `attendances.recorded_by → users.id` — pencatat absensi
- `summative_assessments.published_by → users.id` — penerbit nilai
- `formative_assessments.recorded_by → users.id` — pencatat nilai formatif

### Indeks RBAC
- `users.role` — untuk filter query by role
- `users.username` — untuk login
- `users.email` — untuk login/identifikasi

---

## 5. Struktur Auth.js yang Disediakan

Berdasarkan `docs/AUTH_RBAC.md` dan schema database:

### Tabel Auth yang Sudah Siap
| Tabel | Fungsi Auth |
|---|---|
| `users` | Akun dengan `username`, `email`, `password_hash`, `is_active` |
| `profiles` | Data identitas tambahan |
| `audit_logs` | Pencatatan aksi (login, akses ditolak, perubahan data) |

### Kolom Kunci untuk Auth
- `users.password_hash` — bcrypt hash (tidak plaintext)
- `users.is_active` — untuk nonaktifkan akun
- `users.role` — untuk RBAC
- `audit_logs.user_id` — untuk tracking aktivitas
- `audit_logs.action` — untuk categorizing (login, logout, create, update, delete)

### Sesuai AUTH_RBAC.md
Schema database mendukung:
- Login via username/email
- Password hashing (bcrypt)
- JWT access token + refresh token
- Role-based authorization
- Audit logging untuk aksi sensitif
- Soft delete untuk data historis

---

## 6. Seed Data yang Dibuat

### Data Master
| Entitas | Jumlah | Detail |
|---|---|---|
| Sekolah | 1 | SMA Negeri 1 SAGU |
| Settings | 1 | Konfigurasi dasar sekolah |
| Academic Year | 1 | 2025/2026 (aktif) |
| Semester | 2 | Ganjil (aktif) + Genap |
| Class | 1 | X-IPA-1 (kapasitas 35) |

### Pengguna (RBAC)
| Role | Username | Email |
|---|---|---|
| ADMIN | `admin` | admin@sagu.sch.id |
| GURU | `guru_informatika` | guru@inf.sagu.sch.id |
| WALI_KELAS | `wali_kelas_x1` | walikelas@x1.sagu.sch.id |
| SISWA | `siswa_01` | siswa01@sagu.sch.id |
| ORANG_TUA | `ortu_siswa_01` | ortu@sagu.sch.id |

### Data Akademik
| Entitas | Jumlah | Detail |
|---|---|---|
| Subject | 1 | Informatika (INF) |
| CP (Capaian Pembelajaran) | 3 | CP-INF-01, CP-INF-02, CP-INF-03 |
| LM (Lingkup Materi) | 4 | Dasar Pemrograman, Struktur Kontrol, Fungsi dan Modul, Keamanan Digital |
| TP (Tujuan Pembelajaran) | 7+ | Per LM dengan variasi 2-3 TP |
| Grading Component | 3 | Harian (30%), UTS (25%), UAS (50%) |
| Teaching Assignment | 1 | Guru Informatika mengajar X-IPA-1 |

### Data Operasional
| Entitas | Jumlah | Detail |
|---|---|---|
| Meeting | 2 | Pertemuan 1 dan 2 untuk LM Dasar Pemrograman |
| Attendance | 2 | Hadir pada tanggal 15 Juli dan 17 Juli 2025 |
| Formative Assessment | 2 | Nilai formatif per TP (85 dan 90) |
| Summative Assessment | 3 | Nilai sumatif: Harian (82), UTS (78), UAS (80) |

### Data Relasi
| Entitas | Jumlah | Detail |
|---|---|---|
| Teacher | 1 | Budi Santoso, S.Kom |
| Student | 1 | Siswa dengan NIS 100001 |
| Parent | 1 | Hubungan "ayah" ke siswa |

---

## 7. Indeks yang Dibuat

### Indeks untuk Performa Query
| Tabel | Indeks | Kueri yang Dioptimasi |
|---|---|---|
| `users` | `username` | Login |
| `users` | `email` | Login/identifikasi |
| `users` | `role` | Filter RBAC |
| `students` | `rombel_id` | Cari siswa per rombel |
| `attendances` | `(attendance_date, student_id)` | Rekap absensi harian |
| `attendances` | `rombel_id` | Daftar absensi per rombel |
| `meetings` | `(teaching_assignment_id, meeting_date)` | Daftar pertemuan |
| `formative_assessments` | `learning_objective_id` | Nilai per TP |
| `formative_assessments` | `meeting_id` | Nilai per pertemuan |
| `formative_assessments` | `student_id` | Semua nilai formatif siswa |
| `summative_assessments` | `curriculum_module_id` | Nilai per LM |
| `summative_assessments` | `student_id` | Semua nilai sumatif siswa |
| `summative_assessments` | `grading_component_id` | Nilai per komponen |
| `summative_assessments` | `teaching_assignment_id` | Nilai per penugasan |
| `grades_dashboard` | `(teaching_assignment_id, student_id)` | Leger per siswa |
| `grades_dashboard` | `(student_id, semester_id)` | Leger per semester |
| `raports` | `(student_id, semester_id)` | Rapor per semester |
| `audit_logs` | `user_id` | Audit log pengguna |
| `audit_logs` | `created_at` | Monitor temporal |
| `audit_logs` | `action` | Cari aksi tertentu |
| `audit_logs` | `table_name` | Cari log per tabel |
| `teaching_assignments` | `(teacher_id, rombel_id)` | Cek penugasan guru |
| `teaching_assignments` | `(academic_year_id, semester_id)` | Penugasan per periode |
| `teaching_assignments` | `subject_id` | Cari penugasan per mapel |
| `rombels` | `(class_id, academic_year_id, semester_id, name)` | Unique constraint + pencarian |

### Unique Constraints (Partial)
| Tabel | Unique | Alasan |
|---|---|---|
| `users` | `username` | Login unique |
| `users` | `email` | Identifikasi unique |
| `profiles` | `user_id` | Satu profil per user |
| `students` | `nis`, `nisn` | Nomor induk unique |
| `teachers` | `user_id` | Satu teacher record per user |
| `rombels` | `(class_id, academic_year_id, semester_id, name)` | Nama rombel unique per periode |
| `teaching_assignments` | `(teacher_id, rombel_id, subject_id, academic_year_id, semester_id)` | Satu penugasan per kombinasi |
| `curriculum_modules` | `(teaching_assignment_id, number)` | Nomor LM unique per penugasan |
| `learning_objectives` | `(curriculum_module_id, tp_number)` | Nomor TP unique per LM |
| `meetings` | `(teaching_assignment_id, meeting_number)` | Nomor pertemuan unique per penugasan |
| `attendances` | `(student_id, attendance_date)` | Satu absensi per siswa per hari |
| `grading_components` | `(academic_year_id, semester_id, subject_id, name)` | Komponen unique per mapel per periode |
| `formative_assessments` | `(learning_objective_id, student_id, assessment_date)` | Satu nilai formatif per TP per siswa per hari |
| `summative_assessments` | `(curriculum_module_id, student_id, grading_component_id)` | Satu nilai sumatif per kombinasi |
| `grades_dashboard` | `(student_id, semester_id, academic_year_id)` | Satu nilai akhir per siswa per semester |
| `raports` | `(student_id, semester_id, academic_year_id)` | Satu rapor per siswa per semester |
| `learning_objectives_cp` | `(subject_id, grade_level, cp_code)` | CP unique per mapel per jenjang |
| `parents` | `(user_id, student_id)` | Relasi orang tua unique |
| `settings` | `(school_id, key)` | Setting unique per sekolah per kunci |

---

## 8. Soft Delete Strategy

### Tabel dengan Soft Delete
Hampir semua tabel memiliki `deleted_at` nullable:
- `users`, `academic_years`, `semesters`, `classes`, `rombels`, `subjects`
- `teachers`, `students`, `parents`, `teaching_assignments`
- `curriculum_modules`, `learning_objectives`, `meetings`
- `attendances`, `lesson_plans`, `grading_components`
- `formative_assessments`, `summative_assessments`
- `grades_dashboard`, `raports`

### Tabel tanpa Soft Delete
| Tabel | Alasan |
|---|---|
| `audit_logs` | Append-only, tidak boleh diubah/dihapus |
| `settings` | Konfigurasi statis |
| `schools` | Master data sekolah |
| `profiles` | Data profil statis (tanpa deleted_at) |

---

## 9. Keputusan Teknis Utama

### PostgreSQL sebagai Engine
- Mendukung UUID native, JSONB, indeks komposit
- Cocok untuk multi-user concurrent access
- Production-ready untuk skala sekolah

### UUID sebagai Primary Key
- Keamanan: tidak bisa diprediksi
- Distributed-safe untuk multi-school di masa depan
- Konsisten dengan seluruh dokumen SAGU

### Konvensi snake_case di Database
- Prisma: PascalCase model, camelCase field
- Database: snake_case tabel dan kolom via `@@map` dan `@map`

### Single-School MVP
- Tidak ada `school_id` FK pada tabel akademik
- Satu sekolah = satu instance
- Multi-school akan ditambahkan di fase lanjutan

### `grades_dashboard` sebagai Tabel (Bukan View)
- Performa query agregasi lebih cepat
- Konsistensi nilai akhir
- Audit trail dengan timestamp
- Kontrol publikasi (`is_published`)

### `homeroom_teacher_id → users.id`
- Lebih fleksibel (bisa GURU atau WALI_KELAS)
- Tidak bergantung pada `teachers.id`

### JSON untuk Data Dinamis
- `raports.attendance_summary` — ringkasan kehadiran dinamis
- `audit_logs.old_values` dan `new_values` — diff data dinamis

---

## 10. File Output yang Dihasilkan

| File | Deskripsi |
|---|---|
| `prisma/schema.prisma` | Schema Prisma final dengan 25 model + 7 enum |
| `prisma/seed.ts` | Seed data awal (TypeScript) |
| `docs/ERD.md` | Entity Relationship Diagram |
| `docs/DATABASE_DECISIONS.md` | Dokumentasi seluruh keputusan database |
| `database_foundation_report.md` | Laporan ini |

---

## 11. Verifikasi

### Konsistensi Schema
- ✅ Semua model memiliki `created_at` dan `updated_at` (kecuali audit_logs yang hanya `created_at`)
- ✅ Semua soft delete menggunakan `deleted_at` nullable
- ✅ Semua FK menggunakan `@db.Uuid`
- ✅ Indeks dibuat berdasarkan pola query dari BUSINESS_RULES.md dan WORKFLOWS.md
- ✅ Unique constraints mencegah duplikasi data
- ✅ Enum digunakan untuk bidang terbatas

### Kesesuaian Dokumen
- ✅ Sesuai DATABASE_SCHEMA.md — struktur tabel sesuai spesifikasi
- ✅ Sesuai AUTH_RBAC.md — role 5 role, password_hash, audit_logs
- ✅ Sesuai ACADEMIC_STRUCTURE.md — CP → LM → TP → Meeting → Penilaian
- ✅ Sesuai BUSINESS_RULES.md — status absensi, komponen penilaian
- ✅ Sesuai PRD.md — single-school MVP, fitur inti
- ✅ Sesuai PROJECT_RULES.md — Bahasa Indonesia untuk dokumentasi

---

## 12. Catatan untuk Fase Berikutnya

### Auth Foundation
Database sudah siap untuk Auth Foundation:
- Tabel `users` dengan `password_hash` dan `role` sudah tersedia
- RBAC dengan 5 role sudah terdefinisi di enum
- `audit_logs` siap mencatat aktivitas auth
- Index pada `username`, `email`, `role` untuk performa query auth

### Yang Perlu Ditambahkan di Fase Berikutnya
1. **Auth.js / NextAuth.js** — implementasi session/JWT
2. **API Routes** — sesuai ROUTES.md
3. **Middleware** — proteksi route berdasarkan role
4. **Multi-School** — tambahkan `school_id` FK jika diperlukan
5. **Full-text Search** — jika diperlukan pencarian lanjutan

---

## Status

### SIAP MASUK AUTH FOUNDATION

Database foundation telah selesai dan **siap masuk ke tahap Auth Foundation**. Semua tabel, relasi, enum, seed data, dan struktur RBAC sudah siap mendukung implementasi autentikasi dan otorisasi sesuai AUTH_RBAC.md.

Tidak ada kebutuhan revisi database pada tahap ini. Schema telah diverifikasi konsisten dengan seluruh dokumen proyek dan siap digunakan untuk implementasi lapisan berikutnya.
