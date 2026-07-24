# Database Decisions — SAGU

## Keputusan Database untuk Implementasi Fase DATABASE FOUNDATION

Dokumen ini mendokumentasikan seluruh keputusan teknis database yang diambil pada fase Database Foundation SAGU. Setiap keputusan dirujuk dari dokumen domain akademik dan penilaian yang telah disepakati.

---

## 1. Keputusan Database Engine

### Keputusan: PostgreSQL

| Aspek | Keputusan | Alasan |
|---|---|---|
| Engine | PostgreSQL | Relasional, mature, mendukung UUID native, JSON field, dan indeks komposit |
| UUID | `uuid()` native PostgreSQL | Mengambil alih dari auto-increment integer untuk distributed-safe dan security (tidak bisa diprediksi) |
| Timestamp | `timestamp with time zone` (timestamptz) | Semua `DateTime` field di Prisma memetakan ke `timestamptz` — menyimpan timezone secara akurat |
| Karakter Encoding | UTF-8 | Mendukung Bahasa Indonesia dengan karakter khusus |
| Soft Delete | `deleted_at TIMESTAMP` nullable | Mengikuti konvensi dari DATABASE_SCHEMA.md dan PROJECT_RULES.md |
| Prisma Client | `prisma-client-js` | ORM yang konsisten dengan ekosistem Node.js/TypeScript |
| Prisma Preview Features | `views` diaktifkan | Untuk memungkinkan query view pada `grades_dashboard` di masa depan |

### Keputusan: Tidak Menggunakan SQLite

SQLite dipilih bukan sebagai engine utama karena:
- SQLite tidak mendukung native UUID
- SQLite kurang ideal untuk concurrent write access yang dibutuhkan aplikasi multi-user sekolah
- SQLite tidak mendukung skala untuk deployment produksi jaringan sekolah
- PostgreSQL memberikan ekosistem yang lebih sesuai untuk SaaS

SQLite dapat digunakan sebagai alternatif untuk development/testing lokal dengan mengubah koneksi di `DATABASE_URL`.

---

## 2. Keputusan Primary Key

### Keputusan: UUID untuk Semua Tabel

Setiap tabel menggunakan `id String @id @default(uuid()) @db.Uuid` sebagai primary key. Alasan:

| Alasan | Detail |
|---|---|
| Keamanan | UUID tidak bisa diprediksi (tidak sequential), mencegah enumeration attack |
| Distributed System | UUID cocok jika sistem berkembang ke multi-node atau multi-school |
| Import/Export | UUID tidak bertabrakan saat menggabungkan data dari sekolah berbeda |
| Konsistensi | Semua FK juga menggunakan `@db.Uuid` untuk konsistensi |
| Dokumentasi | Seluruh dokumen SAGU merujuk UUID sebagai tipe PK default |

---

## 3. Keputusan Konvensi Penamaan

### Keputusan: snake_case untuk Nama Tabel dan Kolom di Database

Prisma schema menggunakan PascalCase untuk nama model dan camelCase untuk field. Tetapi di database, semua nama tabel dan kolom menggunakan snake_case via `@@map` dan `@map`.

| Konvensi | Contoh |
|---|---|
| Model Prisma (PascalCase) | `LearningObjective` |
| Tabel DB (snake_case) | `learning_objectives` |
| Field Prisma (camelCase) | `learningObjectiveId` |
| Kolom DB (snake_case) | `learning_objective_id` |
| Method Prisma | `findMany()`, `findUnique()`, `create()`, `update()`, `delete()` |

---

## 4. Keputusan Enum

### Keputusan: Enum untuk Bidang Terbatas dengan Himpunan Tetap

| Enum | Nilai | Menggantikan | Alasan |
|---|---|---|---|
| `Role` | ADMIN, GURU, WALI_KELAS, SISWA, ORANG_TUA | VARCHAR field di users.role | Konsistensi role 5 role SAGU; mencegah typo |
| `Gender` | LAKI_LAKI, PEREMPUAN | VARCHAR di profiles.gender | Standar gender SAGU sesuai budaya Indonesia |
| `AttendanceStatus` | HADIR, IZIN, SAKIT, ALPHA, TERLAMBAT | VARCHAR di attendances.status | 5 status sesuai BUSINESS_RULES.md dan BUSINESS_RULES.md absensi |
| `AssessmentCategory` | FORMATIF, SUMATIF | VARCHAR di grading_components.assessment_category | Pemisahan formatif/sumatif sesuai Kurikulum Merdeka |
| `AssessmentTypeDetail` | HARIAN, TUGAS_HARIAN, KUIS_SINGKAT, REFLEKSI, DISKUSI, TENGAH_SEMESTER, AKHIR_SEMESTER, UTS, UAS, PROYEK, PORTOFOLIO | VARCHAR di grading_components.assessment_type_detail dan formative_assessments.assessment_type | Granular jenis penilaian per Kurikulum Merdeka |
| `GradeLetter` | A, B, C, D, E | VARCHAR di grade_dashboard.letter_grade dan rapor.letter_grade | Konversi skala angka ke huruf Indonesia |
| `Predicate` | SANGAT_BAIK, BAIK, CUKUP, KURANG, TIDAK_MEMENUHI | VARCHAR di grade_dashboard.predicate dan rapor.predicate | Predikat sesuai dengan kurikulum Indonesia |

---

## 5. Keputusan Soft Delete

### Keputusan: Soft Delete untuk Semua Data Utama

Setiap model data utama memiliki field `deletedAt DateTime? @map("deleted_at")`. Implementasi:

| Tabel | Soft Delete | Catatan |
|---|---|---|
| users | ✅ | Nonaktifkan akun, jangan hapus pengguna |
| profiles | ✅ (tanpa deletedAt — profil statis) | Profil tidak dihapus secara lunak |
| academic_years | ✅ | Tahun ajaran yang sudah lewat di-soft delete |
| semesters | ✅ | Semester yang sudah selesai |
| classes | ✅ | Kelas dapat diarsipkan |
| rombels | ✅ | Rombel aktif dapat diarsipkan |
| subjects | ✅ | Mata pelajaran yang tidak lagi aktif |
| teachers | ✅ | Data guru lama diarsipkan |
| students | ✅ | Siswa alumni diarsipkan (data historis) |
| parents | ✅ | Relasi orang tua lama diarsipkan |
| teaching_assignments | ✅ | Penugasan lama diarsipkan |
| curriculum_modules | ✅ | LM lama diarsipkan |
| learning_objectives | ✅ | TP lama diarsipkan |
| meetings | ✅ | Pertemuan lama tetap terjaga |
| attendances | ✅ | Absensi historis terjaga |
| teaching_journals | ✅ | Jurnal mengajar lama diarsipkan |
| grading_components | ✅ | Konfigurasi lama diarsipkan |
| formative_assessments | ✅ | Nilai formatif historis terjaga |
| summative_assessments | ✅ | Nilai sumatif historis terjaga |
| grade_dashboard | ✅ | Nilai akhir historis terjaga |
| raports | ✅ | Rapor alumni terjaga |
| audit_logs | ❌ (append-only, tidak ada deletedAt) | Log audit tidak boleh dihapus |
| settings | ❌ (tanpa deleted_at) | Konfigurasi tidak dihapus lunak |
| schools | ❌ (tanpa deleted_at) | Sekolah master tidak dihapus |

---

## 6. Keputusan Struktur Penilaian (Menggantikan `grades` Lama)

### Keputusan: Hapus tabel `grades` lama, tambahkan `formative_assessments`, `summative_assessments`, dan `grades_dashboard`

Tabel `grades` lama pada DATABASE_SCHEMA.md memiliki FK ke `grading_components` saja dan tidak memisahkan formatif/sumatif. Model baru:

| Tabel Baru | Tujuan | Menggantikan/Menggantikan |
|---|---|---|
| `formative_assessments` | Penilaian formatif per TP per pertemuan per siswa | Baru — tidak menggantikan tabel lama |
| `summative_assessments` | Penilaian sumatif per komponen per LM per siswa | Menggantikan `grades` lama |
| `grades_dashboard` | Nilai akhir final per siswa per mata pelajaran (computed view) | Baru — computed dari agregasi summative |

Alasan:
1. Pemisahan formatif/sumatif sesuai Keputusan Kurikulum Merdeka.
2. `summative_assessments` menambahkan FK ke `curriculum_modules` (LM) yang tidak dimiliki `grades` lama.
3. `grades_dashboard` menyediakan nilai akhir yang dihitung otomatis.
4. Data formatif (umpan balik) tidak terkait langsung dengan perhitungan nilai akhir.

---

## 7. Keputusan Tabel `grades_dashboard` sebagai Model (Bukan View Database)

### Keputusan: Menyimpan `grades_dashboard` sebagai tabel normal

Meskipun dalam ACADEMIC_STRUCTURE.md `grades_dashboard` dijelaskan sebagai "computed view", dalam schema Prisma ini diimplementasikan sebagai tabel biasa (`@@map("grades_dashboard")`). Alasan:

| Alasan | Detail |
|---|---|
| Performa | Query agregasi per siswa per semester lebih cepat dari view yang join 5+ tabel |
| Konsistensi | Nilai akhir yang tersimpan tidak berubah walaupun data sumatif diubah (selama belum dipublikasi ulang) |
| Audit | Riwayat nilai akhir terjaga dengan timestamp createdAt/updatedAt |
| Publikasi | `is_published` lebih mudah dikelola saat `grades_dashboard` adalah tabel |
| Historis | Nilai akhir semester sebelumnya tetap tersimpan walaupun konfigurasi grading_components berubah |

Implementasi note: Pada application layer, `grades_dashboard` harus diperbarui setiap kali nilai sumatif diinput atau diubah (sebelum di-publish).

---

## 8. Keputusan Indeks

### Keputusan: Indeks Berdasarkan Pola Query yang Teridentifikasi

Indeks dibuat berdasarkan pola query dari dokumen WORKFLOWS.md, BUSINESS_RULES.md, ROUTES.md, dan MODULES.md:

**Tabel yang diindeks (dari dokumentasi):**

| Tabel | Indeks | Kueri yang Dioptimasi |
|---|---|---|
| users | `@@index([username])` + `@@index([email])` | Login (username/email lookup) |
| users | `@@index([role])` | RBAC authorization (filter user by role) |
| students | `@@index([rombelId])` | Cari siswa per rombel (dashboard wali kelas), leger |
| attendances | `@@index([attendanceDate, studentId])` | Rekap absensi harian per siswa |
| attendances | `@@index([rombelId])` | Daftar absensi per rombel (guru, wali kelas) |
| meetings | `@@index([teachingAssignmentId, meetingDate])` | Daftar pertemuan per penugasan per tanggal |
| formativeAssessments | `@@index([learningObjectiveId])` | Detail nilai siswa per TP |
| formativeAssessments | `@@index([meetingId])` | Nilai formatif per pertemuan |
| formativeAssessments | `@@index([studentId])` | Semua nilai formatif (untuk leger) |
| summativeAssessments | `@@index([curriculumModuleId])` | Nilai sumatif per LM |
| summativeAssessments | `@@index([studentId])` | Semua nilai sumatif (untuk leger) |
| summativeAssessments | `@@index([gradingComponentId])` | Nilai per komponen penilaian |
| summativeAssessments | `@@index([teachingAssignmentId])` | Semua nilai sumatif per penugasan |
| gradesDashboard | `@@index([teachingAssignmentId, studentId])` | Leger per siswa per penugasan |
| gradesDashboard | `@@index([studentId, semesterId])` | Leger per siswa per semester |
| raports | `@@index([studentId, semesterId])` | Rapor per siswa per semester |

**Semua indeks di atas sudah termasuk dalam prisma/schema.prisma.**

### Keputusan: Tidak Menggunakan `@@fulltext` atau Text Search Index

Pencarian teks penuh (full-text search) tidak diterapkan pada fase MVP. Pencarian berbasis filter sederhana sudah cukup. Full-text search dapat ditambahkan pada fase berikutnya jika diperlukan.

---

## 9. Keputusan Tidak Menggunakan `school_id` FK pada Setiap Tabel

### Keputusan: Single-School MVP Tanpa `school_id` pada Setiap Tabel

Berdasarkan BATASAN dan ASLI dari DATABASE_SCHEMA.md dan PROJECT_RULES.md:

| Aspek | Keputusan | Alasan |
|---|---|---|
| school_id FK | Tidak ada pada tabel akademik utama | MVP single-school: satu sekolah = satu instance |
| `schools` table | Tetap ada (1 row konfigurasi) | Referensi institusi sekolah |
| `settings` table | 1:1 dengan schools | Konfigurasi per sekolah |
| Multi-school | Ditunda ke fase lanjutan | Dokumentasi menyebutkan `school_id` akan ditambahkan nanti |

Mengapa `school_id` tidak disimpan sebagai FK pada setiap tabel:
1. Semua data akademik secara implisit berkaitan dengan satu sekolah aktif.
2. Tidak perlu join ke `schools` untuk setiap query akademik.
3. Lebih sederhana untuk audit dan query.
4. Multi-school akan ditambahkan dengan menambahkan `school_id` ke setiap tabel data akademik pada fase berikutnya.

---

## 10. Keputusan Relasi Antar Tabel

### Keputusan: 1:N adalah Relasi Mayoritas, 1:1 Hanya untuk Profile/Auth

| Tipe Relasi | Contoh | Penjelasan |
|---|---|---|
| 1:N (satu-ke-banyak) | AcademicYear → Semesters, Rombel → Students, TeachingAssignment → CurriculumModules | Satu entitas induk memiliki banyak entitas anak |
| 1:1 (satu-ke-satu) | User → Profile, User → Teacher, User → Student | Setiap pengguna memiliki tepat satu record peran |
| N:1 (banyak-ke-satu) | Attendance → Student, Attendance → Rombel | Balikan dari 1:N |
| (Tidak ada) M:N langsung | Tidak ada relasi many-to-many tanpa join table | Semua relasi M:N dipecah melalui tabel join (teaching_assignments) |

**Tabel Join Implicit (TeachingAssignment):**
Tabel `teaching_assignments` berfungsi sebagai tabel join yang menghubungkan Guru, Rombel, Mata Pelajaran, Tahun Ajaran, dan Semester. Ini menghindari direct M:N relationship dan memungkinkan properti tambahan (periode akademik, status) ditambahkan.

---

## 11. Keputusan Tidak Membuat Relasi Langsung `homeroom_teacher_id → teachers.id`

### Keputusan: `homeroom_teacher_id` di Rombel Merujuk ke `users.id`, bukan `teachers.id`

Alasan:
1. Wali kelas harus dapat menjadi guru yang mengajar (role GURU) atau wali kelas yang ditugaskan (role WALI_KELAS).
2. `users.id` adalah key universal yang menghubungkan semua entitas pengguna.
3. `teachers.id` hanya menghubungkan ke entitas guru saja, membatasi siapa yang bisa menjadi wali kelas.
4. Aplikasi layer yang menyaring berdasarkan role yang valid untuk wali kelas.

Hubungan di database:
- `rombels.homeroom_teacher_id → users.id`
- `teachers.user_id → users.id`

Keduanya terhubung ke `users.id`, bukan satu sama lain secara langsung (kecuali via application-level join).

---

## 12. Keputusan Audit Log Tanpa `updatedAt`

### Keputusan: `audit_logs` Tidak Memiliki `updatedAt` dan `deletedAt`

Alasan:
1. Audit log adalah append-only — tidak pernah diperbarui atau dihapus.
2. `createdAt` adalah timestamp yang relevan.
3. Tidak ada kebutuhan soft delete pada audit log (PRD.md menyatakan log tidak bisa dihapus oleh pengguna biasa).
4. Tidak ada `updatedAt` karena record audit bersifat immutable setelah ditulis.

---

## 13. Keputusan Kolom JSON untuk Data Serialisasi

### Keputusan: Gunakan `Json` Type Prisma untuk data yang tidak terstruktur

| Tabel | Field | Tipe Prisma | Tipe DB | Alasan |
|---|---|---|---|---|
| raports | attendanceSummary | `Json` | `jsonb` | Ringkasan kehadiran dalam format JSON dinamis |
| audit_logs | oldValues | `Json?` | `jsonb` | Nilai sebelum perubahan (dinamis per tabel) |
| audit_logs | newValues | `Json?` | `jsonb` | Nilai sesudah perubahan (dinamis per tabel) |
| settings | value | `String` (VARCHAR) | `VARCHAR(500)` | Konfigurasi sederhana, cukup string |

---

## 14. Keputusan untuk `seed.ts`

### Keputusan: Menggunakan TypeScript dengan Prisma Client API

Seed data ditulis dalam TypeScript menggunakan Prisma Client API (`@prisma/client`) untuk:
1. Konsistensi dengan stack teknologi yang diharapkan (Node.js + TypeScript).
2. Kemudahan maintainabilitas (satu bahasa untuk schema dan seed).
3. Kemampuan untuk dijalankan setelah `prisma generate` menghasilkan Prisma Client.
4. Seed data yang realistis: 1 sekolah, 5 pengguna (admin, guru, wali kelas, siswa, orang tua), 4 LM Informatika, 10+ TP, 3 grading components, 2 pertemuan, 2 absensi, 2 formatif, 3 sumatif.

---

## 15. Keputusan Tidak Memasukkan `school_id` pada Tabel Akademik Baru

Meskipun PRD.md menyebutkan single-school untuk MVP, dan ROADMAP.md menyebutkan multi-school di fase lanjutan, keputusan ini dibuat secara konsisten:

| Tabel | school_id? | Alasan |
|---|---|---|
| schools | — (ini adalah tabel schools) | Tabel induk |
| settings | — (1:1 dengan schools) | Satu settings per school |
| users, profiles, academic_years, semesters, classes, rombels, subjects, teachers, students, parents, teaching_assignments, teaching_journals, meetings, learning_objectives_cp, curriculum_modules, learning_objectives, attendances, grading_components, formative_assessments, summative_assessments, grades_dashboard, raports, audit_logs | ❌ Tidak | Single-school MVP; `school_id` akan ditambahkan di fase lanjutan |

---

## 16. Keputusan Urutan Model dalam Schema

### Keputusan: Model Ditempatkan Berdasarkan Dependensi dan Alur Bisnis

Urutan model dalam schema.prisma:
1. **Enum** (semua enum) — didefinisikan sebelum model yang merujuk
2. **School + Setting** — entitas root konfigurasi
3. **User + Profile** — otentikasi dan identitas
4. **AcademicYear + Semester** — waktu/periode
5. **Class + Rombel** — struktur organisasi kelas
6. **Subject** — data master mata pelajaran
7. **Teacher + Student + Parent** — entitas personel
8. **TeachingAssignment** — pusat hubungan akademik
9. **LearningObjectiveCP** — CP (Capaian Pembelajaran) nasional
10. **CurriculumModule** — LM (Lingkup Materi)
11. **LearningObjective** — TP (Tujuan Pembelajaran)
12. **Meeting** — Pertemuan mengajar aktual
13. **GradingComponent** — Konfigurasi komponen penilaian
14. **Attendance** — Catatan kehadiran
15. **TeachingJournal** — Jurnal mengajar terencana
16. **FormativeAssessment** — Penilaian formatif per TP
17. **SummativeAssessment** — Penilaian sumatif per LM
18. **GradeDashboard** — Nilai akhir final
19. **Raport** — Dokumen hasil akhir
20. **AuditLog** — Log audit terakhir (append-only)

Urutan ini memastikan tidak ada circular reference dan setiap model ditentukan sebelum model yang merujuknya (secara logis, meskipun Prisma schema tidak memerlukan urutan ketat).