# Database Decision Review — SAGU

## Ringkasan

Dokumen ini mereview dua keputusan database pada fase Database Foundation SAGU:

1. **`grades_dashboard`**: tabel fisik vs database view
2. **`lesson_plans`**: dipertahankan vs diganti `teaching_journals`

Review dilakukan dengan membandingkan keputusan yang tercatat di `docs/DATABASE_DECISIONS.md` dan `prisma/schema.prisma` terhadap seluruh dokumen domain: `docs/ACADEMIC_STRUCTURE.md`, `docs/WORKFLOWS.md`, `docs/BUSINESS_RULES.md`, `docs/MODULES.md`, dan `docs/AUTH_RBAC.md`.

---

## 1. Review `grades_dashboard`: Tabel Fisik vs Database View

### Status Saat Ini

`grades_dashboard` diimplementasikan sebagai **tabel fisik** di `prisma/schema.prisma` dengan kolom:
- `student_id`, `teaching_assignment_id`, `subject_id`, `semester_id`, `academic_year_id`
- `numeric_score`, `letter_grade`, `predicate`
- `is_published`, `created_at`, `updated_at`

Keputusan ini didokumentasikan di `docs/DATABASE_DECISIONS.md` bagian 7 dengan alasan performa, konsistensi, audit, dan kontrol publikasi.

### Kontradiksi yang Ditemukan

`docs/ACADEMIC_STRUCTURE.md` bagian 9 secara eksplisit menyebutkan:

> "Nilai Akhir Mata Pelajaran ... ### Entitas Nilai Akhir (Computed View)"

Ini kontradiksi langsung dengan implementasi tabel fisik di schema.

### Analisis Kebutuhan Bisnis

| Kebutuhan Bisnis | Sumber Doc | Implikasi |
|---|---|---|
| Perhitungan nilai akhir otomatis dari agregasi komponen sumatif | WORKFLOWS.md langkah 6, BUSINESS_RULES.md | Nilai dapat dihitung on-the-fly dari `summative_assessments` + `grading_components` |
| Publikasi bertahap per semester | BUSINESS_RULES.md bagian 2 | State `is_published` perlu disimpan |
| Audit trail perubahan nilai | BUSINESS_RULES.md bagian 3 | Perubahan tercatat di `audit_logs`, bukan di tabel nilai |
| Konsistensi nilai dengan data sumatif | WORKFLOWS.md | View selalu sinkron; tabel berisiko stale data |

### Kelebihan Tabel Fisik

| Aspek | Detail |
|---|---|
| Performa baca | Query agregasi per siswa per semester menjadi langsung tanpa join kompleks |
| State publikasi | `is_published` dapat disimpan langsung pada record nilai akhir |
| Audit timestamp | `created_at`/`updated_at` mencatat kapan nilai dihitung |
| Historis | Nilai akhir semester sebelumnya tetap terjaga meskipun `grading_components` berubah |
| Kontrol publish | `is_published` memudahkan filtering untuk siswa/orang tua |

### Kekurangan Tabel Fisik

| Aspek | Detail |
|---|---|
| Data duplication | Nilai numerik, huruf, dan predikat redundan dengan data sumber di `summative_assessments` |
| Stale data risk | Jika `summative_assessments` diubah, `grades_dashboard` harus di-recalculate manual |
| Sync burden | Application layer harus memastikan tabel tetap sinkron |
| Konsistensi dokumen | Bertentangan dengan ACADEMIC_STRUCTURE.md yang mendefinisikan sebagai "Computed View" |
| Storage overhead | Menyimpan data yang dapat dihitung ulang |

### Kelebihan Database View

| Aspek | Detail |
|---|---|
| Always in sync | Nilai selalu refleks dari data sumatif terkini |
| No duplication | Tidak ada duplikasi data numerik/huruf/predicate |
| Simpler schema | Tidak perlu sync logic atau trigger |
| Konsisten dengan domain doc | Sesuai ACADEMIC_STRUCTURE.md |
| Lower maintenance | Tidak ada mekanisme refresh atau re-calculation |

### Kekurangan Database View

| Aspek | Detail |
|---|---|
| Performa query | Join 5+ tabel per query bisa lambat pada dataset besar |
| State publikasi sulit | `is_published` tidak bisa disimpan di view; perlu tabel terpisah atau kolom di `summative_assessments` |
| Tidak ada timestamp kalkulasi | Tidak ada `created_at` untuk kapan nilai akhir dihitung |
| Historis | Perubahan grading_components mengubah nilai view secara retroaktif |
| Kompleksitas filter | Filter `is_published` harus ditambahkan di setiap query |

### Rekomendasi untuk MVP

**Tetap dipertahankan sebagai tabel fisik**.

Alasan:
1. Publikasi nilai adalah kebutuhan bisnis utama (BUSINESS_RULES.md). State `is_published` per siswa per semester lebih mudah dikelola sebagai kolom tabel.
2. Dataset MVP sekolah (puluh-tahun ribu siswa) tidak membutuhkan optimasi view untuk performa.
3. Audit trail `created_at`/`updated_at` pada nilai akhir memberikan nilai untuk tracking kapan nilai di-finalisasi.
4. Risk stale data dapat diminimalkan dengan application-layer trigger atau job yang re-calculate saat ada perubahan sumatif.
5. Kontradiksi dengan ACADEMIC_STRUCTURE.md harus diperbaiki di dokumen, bukan di schema.

### Tindakan yang Disarankan

Perbarui `docs/ACADEMIC_STRUCTURE.md` bagian 9 dari "Computed View" menjadi "Computed Table" atau "Materialized Grade Record" agar konsisten dengan implementasi.

---

## 2. Review `lesson_plans`: Pertahankan vs Ganti `teaching_journals`

### Status Saat Ini

`lesson_plans` adalah tabel fisik dengan struktur:
- `id`, `teacher_id`, `subject_id`, `rombel_id`, `class_id`, `academic_year_id`, `semester_id`
- `lesson_date`, `start_time`, `end_time`
- `topic`, `description`, `tp_covered`
- `created_at`, `updated_at`, `deleted_at`

Tabel ini memiliki **FK redundan** kepada `teaching_assignments` (teacher, rombel, class, subject, academic_year, semester). Di schema saat ini, `teaching_assignments` adalah hub yang menghubungkan keenam entitas tersebut.

### Kontradiksi yang Ditemukan

`docs/BUSINESS_RULES.md` bagian 5 (Aturan Jurnal Mengajar) mendefinisikan struktur jurnal mengajar yang wajib diisi guru:

| Field | Keterangan |
|---|---|
| Tanggal Pertemuan | Tanggal pelaksanaan |
| Jam Mulai dan Selesai | Durasi mengajar |
| Mata Pelajaran | Nama mata pelajaran |
| Rombel | Nama rombel |
| Topik Pembahasan | Topik yang diajarkan |
| TP yang Dicapai | TP yang tercapai |
| LM yang Dibahas | LM yang mencakup topik |
| **Metode Pembelajaran** | Ceramah, diskusi, praktik, dll. |
| **Media yang Digunakan** | Whiteboard, PPT, perangkat lunak, dll. |
| **Refleksi Guru** | Catatan refleksi setelah pertemuan |
| **Tindak Lanjut** | Rencana pertemuan berikutnya |

Kolom **Metode Pembelajaran, Media, Refleksi Guru, dan Tindak Lanjut** TIDAK ADA di `lesson_plans` maupun di `meetings`.

### Analisis Workflow

`docs/WORKFLOWS.md` menunjukkan dua fase yang berbeda:

**Fase 1: Mulai Pertemuan**
1. Guru memilih mata pelajaran, rombel, tanggal
2. Sistem menampilkan agenda mengajar yang telah direncanakan (`lesson_plans`)
3. Guru memulai pertemuan

**Fase 2: Jurnal Mengajar**
1. Guru memilih pertemuan yang telah dilakukan
2. Guru memperbarui jurnal: metode, media, refleksi, tindak lanjut
3. Sistem **memperbarui data di tabel `meetings`**

`meetings` saat ini memiliki:
- `topic_summary`, `tp_covered`, `homeroom_teacher_note`
- TAPI tidak ada `metode_pembelajaran`, `media`, `refleksi_guru`, `tindak_lanjut`

### Kelebihan `lesson_plans` Saat Ini

| Aspek | Detail |
|---|---|
| Pre-meeting plan | Memisahkan rencana vs eksekusi |
| Sudah ada di schema | Tidak perlu migrasi data |
| Route `agenda` sudah menggunakannya | ROUTES.md mendefinisikan CRUD agenda |

### Kekurangan `lesson_plans` Saat Ini

| Aspek | Detail |
|---|---|
| **Redundan dengan `teaching_assignments`** | `teacher_id`, `subject_id`, `rombel_id`, `class_id`, `academic_year_id`, `semester_id` sudah ada di `teaching_assignments` |
| **Tidak ada field jurnal** | Tidak ada `metode_pembelajaran`, `media`, `refleksi_guru`, `tindak_lanjut` |
| **Tidak ada relasi ke LM/TP** | Tidak terhubung ke `curriculum_modules` atau `learning_objectives` |
| **Nama ambigu** | "Lesson plan" dalam Kurikulum Merdeka lebih ke rencana, tapi workflow SAGU butuh jurnal (record pasca-pertemuan) |
| **Duplikasi dengan `meetings`** | `meetings` juga punya `topic_summary`, `tp_covered`, `start_time`, `end_time` |

### Kelebihan `teaching_journals`

| Aspek | Detail |
|---|---|
| Nama sesuai domain | "Jurnal Mengajar" adalah istilah Kurikulum Merdeka |
| Konsolidasi plan + journal | Satu tabel untuk rencana dan record pasca-pertemuan |
| Eliminasi redundansi | Menggunakan `teaching_assignment_id` sebagai FK tunggal |
| Field lengkap | Dapat menyertakan metode, media, refleksi, tindak lanjut |
| Relasi ke LM/TP | Dapat langsung terhubung ke `curriculum_module_id` dan `learning_objective_id` |

### Kekurangan `teaching_journals`

| Aspek | Detail |
|---|---|
| Perlu migrasi | Data `lesson_plans` harus dipindah |
| Perlu update route | ROUTES.md mereferensikan `/api/v1/agenda` |
| Perlu update seed | `prisma/seed.ts` harus disesuaikan |
| Perlu update relasi | `meetings.lesson_plan_id` harus diubah/dihapus |

### Rekomendasi untuk MVP

**Direkomendasikan diganti menjadi `teaching_journals`**.

Alasan:

1. **Kesesuaian Workflow**: BUSINESS_RULES.md dan WORKFLOWS.md secara konsisten menggunakan istilah "jurnal mengajar". Nama `teaching_journals` lebih akurat merepresentasikan kebutuhan bisnis.

2. **Eliminasi Redundansi**: Menggunakan `teaching_assignment_id` sebagai FK tunggal menghilangkan 6 FK redundan di `lesson_plans`. Ini mengurangi risiko data inconsistency.

3. **Kelengkapan Field**: `teaching_journals` dapat menyertakan semua field yang dibutuhkan BUSINESS_RULES.md: `metode_pembelajaran`, `media`, `refleksi_guru`, `tindak_lanjut`.

4. **Sederhana untuk Guru**: Satu entitas "jurnal" yang bisa diisi sebelum (sebagai plan) dan sesudah pertemuan (sebagai journal) lebih intuitif daripada maintaining dua tabel terpisah.

5. **Relasi yang Jelas**: `teaching_journals` dapat langsung terhubung ke `teaching_assignments`, `curriculum_modules`, dan `learning_objectives` tanpa FK tambahan yang berlebihan.

### Tindakan yang Disarankan

Jika diganti, struktur `teaching_journals` yang disarankan:

```
model TeachingJournal {
  id                    String    @id @default(uuid()) @db.Uuid
  teachingAssignmentId  String    @map("teaching_assignment_id") @db.Uuid
  curriculumModuleId    String?   @map("curriculum_module_id") @db.Uuid
  learningObjectiveId   String?   @map("learning_objective_id") @db.Uuid
  meetingNumber         Int       @map("meeting_number")
  meetingDate           DateTime  @map("meeting_date") @db.Date
  startTime             DateTime  @map("start_time")
  endTime               DateTime  @map("end_time")
  topic                 String    @db.VarChar(255)
  description           String?   @db.Text
  tpCovered             String?   @map("tp_covered") @db.Text
  metodePembelajaran    String?   @map("metode_pembelajaran") @db.VarChar(100)
  media                 String?   @db.Text
  refleksiGuru          String?   @map("refleksi_guru") @db.Text
  tindakLanjut          String?   @map("tindak_lanjut") @db.Text
  isPlan                Boolean   @default(true) @map("is_plan")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  deletedAt             DateTime? @map("deleted_at")

  teachingAssignment TeachingAssignment @relation(fields: [teachingAssignmentId], references: [id])
  curriculumModule    CurriculumModule?   @relation(fields: [curriculumModuleId], references: [id])
  learningObjective   LearningObjective?  @relation(fields: [learningObjectiveId], references: [id])
  meetings            Meeting[]

  @@map("teaching_journals")
  @@unique([teachingAssignmentId, meetingNumber])
  @@index([teachingAssignmentId, meetingDate])
  @@index([meetingDate])
}
```

Catatan: `meetings` dapat tetap ada sebagai record attendance/penilaian yang terpisah, atau dapat diintegrasikan ke dalam `teaching_journals` tergantung kebutuhan tracking yang lebih detail. Untuk MVP, `meetings` tetap berguna untuk menandai kapan pertemuan terjadi dan menautkan ke penilaian formatif/sumatif.

---

## 3. Rekomendasi Akhir untuk MVP SAGU

### Tabel yang Direvisi

| Tabel | Rekomendasi | Alasan Utama |
|---|---|---|
| `grades_dashboard` | **Tetap dipertahankan** sebagai tabel fisik | Publikasi state, audit timestamp, konsistensi dengan BUSINESS_RULES.md |
| `lesson_plans` | **Direkomendasikan diganti** `teaching_journals` | Konsistensi domain, eliminasi redundansi, kelengkapan field jurnal |

### Tindakan Remediasi

1. **Perbarui `docs/ACADEMIC_STRUCTURE.md`**: Ubah label "Computed View" menjadi "Materialized Grade Record" atau tambahkan catatan bahwa untuk MVP ini diimplementasikan sebagai tabel fisik untuk mendukung publikasi state.

2. **Ganti `lesson_plans` menjadi `teaching_journals`** di `prisma/schema.prisma`:
   - Gunakan `teaching_assignment_id` sebagai FK utama
   - Tambahkan field `metode_pembelajaran`, `media`, `refleksi_guru`, `tindak_lanjut`
   - Tambahkan field `is_plan` untuk membedakan rencana vs jurnal aktual
   - Hapus `meetings.lesson_plan_id` atau pertahankan sebagai opsional

3. **Perbarui relasi `meetings`**:
   - `meetings.teaching_assignment_id` sudah ada
   - `meetings.lesson_plan_id` dapat diubah menjadi `teaching_journal_id` atau dihapus jika `teaching_journals` menggabungkan plan + journal

4. **Perbarui seed data** di `prisma/seed.ts` untuk menggunakan `teaching_journals`.

5. **Perbarui ROUTES.md**: Ubah referensi `/api/v1/agenda` jika perlu, atau pertahankan endpoint dengan mapping ke `teaching_journals`.

### Dampak ke Fase Berikutnya

| Fase | Dampak |
|---|---|
| Auth Foundation | Tidak ada — struktur RBAC dan auth sudah independen dari tabel ini |
| API Foundation | Perlu update route `/api/v1/agenda` untuk `teaching_journals` |
| UI Foundation | Tidak ada — fokus UI nanti |
| Testing | Perlu update test untuk `teaching_journals` |

---

## Status

**DIREKOMENDASIKAN REVISI**

Dua titik revisi diperlukan:
1. **Dokumentasi `ACADEMIC_STRUCTURE.md`** harus diselaraskan dengan keputusan `grades_dashboard` sebagai tabel fisik.
2. **Tabel `lesson_plans`** harus diganti `teaching_journals` untuk konsistensi dengan workflow dan BUSINESS_RULES.md.

Tidak ada perubahan schema yang dilakukan pada tahap review ini. Revisi dapat dilaksanakan pada tahap berikutnya sebelum implementasi Auth Foundation atau API Foundation.
