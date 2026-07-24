# Database Revision Final Report — SAGU

## Ringkasan

Revisi database foundation SAGU telah dilaksanakan berdasarkan rekomendasi di `database_decision_review.md`. Dua perubahan utama dilakukan:

1. **Tabel `lesson_plans` diganti `teaching_journals`** untuk konsistensi dengan domain Kurikulum Merdeka dan BUSINESS_RULES.md.
2. **`grades_dashboard` tetap dipertahankan sebagai tabel fisik** dan didokumentasikan sebagai "Materialized Grade Record".

Tidak ada UI, Auth, atau API implementation yang dibuat pada tahap ini.

---

## 1. Dokumen yang Diubah

| No | Dokumen | Jenis Perubahan |
|---|---|---|
| 1 | `prisma/schema.prisma` | Replace model `LessonPlan` dengan `TeachingJournal` |
| 2 | `prisma/seed.ts` | Tidak diubah (tidak ada referensi `lesson_plans`) |
| 3 | `docs/DATABASE_SCHEMA.md` | Replace section `lesson_plans` dengan `teaching_journals`; update ERD dan indeks |
| 4 | `docs/ACADEMIC_STRUCTURE.md` | Update label `grades_dashboard` menjadi "Materialized Grade Record"; update referensi `lesson_plan_id` menjadi `teaching_journal_id` |
| 5 | `docs/BUSINESS_RULES.md` | Update referensi `lesson_plans` menjadi `teaching_journals` |
| 6 | `docs/WORKFLOWS.md` | Update referensi `lesson_plans` menjadi `teaching_journals` |
| 7 | `docs/MODULES.md` | Tidak diubah (menggunakan istilah "agenda mengajar" yang remain valid) |
| 8 | `docs/ROUTES.md` | Tidak diubah (endpoint `/api/v1/agenda` tetap valid) |
| 9 | `docs/ERD.md` | Replace `LESSON_PLAN` dengan `TEACHING_JOURNAL`; update relasi dan indeks |
| 10 | `docs/API_SPEC.md` | Tidak diubah (endpoint tetap `/api/v1/agenda`) |
| 11 | `docs/DATABASE_DECISIONS.md` | Update referensi `lesson_plans` menjadi `teaching_journals` |

---

## 2. Perubahan yang Dilakukan

### 2.1 Schema Prisma (`prisma/schema.prisma`)

**Model `LessonPlan` dihapus dan diganti `TeachingJournal`:**

| Aspek | Sebelum (`LessonPlan`) | Sesudah (`TeachingJournal`) |
|---|---|---|
| Nama tabel | `lesson_plans` | `teaching_journals` |
| FK utama | 6 FK redundan (`teacher_id`, `subject_id`, `rombel_id`, `class_id`, `academic_year_id`, `semester_id`) | 1 FK (`teaching_assignment_id`) |
| FK opsional | Tidak ada | `curriculum_module_id`, `learning_objective_id` |
| Field baru | Tidak ada | `metode_pembelajaran`, `media`, `refleksi_guru`, `tindak_lanjut`, `is_plan` |
| Relasi ke Meeting | `meetings.lessonPlanId -> lesson_plans.id` | `meetings.teachingJournalId -> teaching_journals.id` |

**Model `Meeting` diperbarui:**
- `lessonPlanId` diganti `teachingJournalId`
- `lessonPlan LessonPlan?` diganti `teachingJournal TeachingJournal?`

**Model lain yang direferensikan:**
- `User.lessonPlans LessonPlan[]` → `User.teachingJournals TeachingJournal[]`
- `Class.lessonPlans LessonPlan[]` → `Class.teachingJournals TeachingJournal[]`
- `Rombel.lessonPlans LessonPlan[]` → `Rombel.teachingJournals TeachingJournal[]`
- `Subject.lessonPlans LessonPlan[]` → `Subject.teachingJournals TeachingJournal[]`
- `TeachingAssignment.lessonPlans LessonPlan[]` → `TeachingAssignment.teachingJournals TeachingJournal[]`

### 2.2 Dokumentasi

**docs/DATABASE_SCHEMA.md:**
- Section `lesson_plans (Agenda Mengajar)` diganti `teaching_journals (Jurnal Mengajar)` dengan struktur field baru
- ERD diagram diperbarui: `LESSON_PLAN` → `TEACHING_JOURNAL`, relasi disederhanakan melalui `teaching_assignment_id`
- Indeks `lesson_plans.teacher_id + lesson_date` diganti `teaching_journals.teaching_assignment_id + meeting_date`

**docs/ACADEMIC_STRUCTURE.md:**
- Bagian 9: "Entitas Nilai Akhir (Computed View)" → "Entitas Nilai Akhir (Materialized Grade Record)"
- Field `lesson_plan_id` → `teaching_journal_id`
- Referensi `lesson_plans` → `teaching_journals` dalam diagram

**docs/BUSINESS_RULES.md:**
- "Mengelola rencana pembelajaran (`lesson_plans`)" → "Mengelola jurnal mengajar (`teaching_journals`)"
- "termasuk `lesson_plans`" → "melalui `teaching_journals`"

**docs/WORKFLOWS.md:**
- "agenda mengajar yang telah direncanakan (`lesson_plans`)" → "jurnal mengajar yang telah direncanakan (`teaching_journals`)"

**docs/ERD.md:**
- `LESSON_PLAN` → `TEACHING_JOURNAL` di seluruh diagram
- Relasi `lesson_plans (N) ──── (1) teachers/subjects/rombels/classes` diganti `teaching_journals (N) ──── (1) teaching_assignments/curriculum_modules/learning_objectives/meetings`
- Indeks `lesson_plans.teacher_id + lesson_date` → `teaching_journals.teaching_assignment_id + meeting_date`

**docs/DATABASE_DECISIONS.md:**
- Semua referensi `lesson_plans` → `teaching_journals`
- Urutan model: `LessonPlan` → `TeachingJournal`

---

## 3. Dampak terhadap Implementasi

### 3.1 Database Migration

Perubahan ini memerlukan **migrasi database** untuk:
1. Membuat tabel baru `teaching_journals`
2. Menghapus tabel `lesson_plans`
3. Mengubah kolom `meetings.lesson_plan_id` menjadi `meetings.teaching_journal_id`

**Catatan:** Data existing di `lesson_plans` harus dimigrasikan ke `teaching_journals` sebelum menghapus tabel lama.

### 3.2 Application Layer

| Komponen | Dampak | Kebutuhan |
|---|---|---|
| **Repository/DAO** | Semua query ke `lesson_plans` harus diubah ke `teaching_journals` | Update query Prisma |
| **Service Layer** | Business logic yang menggunakan `LessonPlan` harus di-refactor | Update service methods |
| **Controller/Route** | Route `/api/v1/agenda` tetap sama, hanya mapping ke `TeachingJournal` | Tidak ada perubahan route |
| **DTO/Validation** | Schema validation untuk `LessonPlan` → `TeachingJournal` | Update DTO |
| **Seed Data** | Tidak ada impact (seed.ts tidak membuat `lesson_plans`) | Tidak perlu perubahan |

### 3.3 Auth Foundation

Tidak ada dampak. Struktur RBAC dan tabel `users`, `profiles`, `audit_logs` tetap tidak berubah.

### 3.4 API Foundation

Tidak ada dampak pada kontrak API. Endpoint `/api/v1/agenda` tetap ada dengan method yang sama (GET, POST, PUT, DELETE). Hanya underlying table yang berubah.

### 3.5 UI Foundation

Tidak ada dampak. UI akan tetap menggunakan route `/api/v1/agenda`. Perubahan nama tabel tidak terlihat di frontend.

---

## 4. Tabel `grades_dashboard` — Materialized Grade Record

`grades_dashboard` **tetap dipertahankan sebagai tabel fisik** dengan label baru "Materialized Grade Record".

### Alasan Pemeliharaan
- Mendukung flag `is_published` per siswa per semester
- Audit trail dengan `created_at`/`updated_at`
- Performa query yang konsisten untuk dataset MVP
- Konsistensi dengan BUSINESS_RULES.md

### Update Dokumentasi
- `docs/ACADEMIC_STRUCTURE.md`: Label diperbarui dari "Computed View" menjadi "Materialized Grade Record"
- Tidak ada perubahan struktur tabel atau relasi

---

## 5. Validasi Schema

Semua referensi ke `LessonPlan` telah dihapus dari `prisma/schema.prisma`. Model baru `TeachingJournal` telah ditambahkan dengan relasi yang konsisten:
- `teaching_journals` → `teaching_assignments` (FK utama)
- `teaching_journals` → `curriculum_modules` (opsional)
- `teaching_journals` → `learning_objectives` (opsional)
- `meetings` → `teaching_journals` (opsional)

---

## 6. Status

### SIAP MASUK AUTH FOUNDATION

Database foundation telah selesai direvisi dan **siap masuk ke tahap Auth Foundation**. Semua tabel, relasi, enum, seed data, dan dokumentasi telah disinkronkan. Tidak ada kebutuhan revisi database tambahan sebelum implementasi lapisan berikutnya.
