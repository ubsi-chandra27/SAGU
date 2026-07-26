# Academic Structure SAGU

## Definisi Seluruh Entitas Akademik Berdasarkan Kurikulum Merdeka

Dokumen ini mendefinisikan model domain akademik SAGU yang akan digunakan sebagai dasar perancangan database. Model ini mengikuti struktur Kurikulum Merdeka: Capaian Pembelajaran (CP) → Lingkup Materi (LM) → Tujuan Pembelajaran (TP) → Pertemuan → Penilaian Formatif → Penilaian Sumatif → Leger → Rapor.

---

## Gambaran Umum Model Akademik

```
Capaian Pembelajaran (CP)
    └── Lingkup Materi (LM)
            └── Tujuan Pembelajaran (TP)
                    └── Pertemuan (Pertemuan Mengajar)
                            ├── Penilaian Formatif
                            └── Penilaian Sumatif

Gabungan seluruh Penilaian Formatif + Sumatif → Leger Nilai
Leger Nilai per siswa per mata pelajaran → Rapor Akhir
```

---

## 1. Capaian Pembelajaran (CP)

CP adalah dokumen tingkat nasional yang menetapkan capaian pembelajaran untuk setiap mata pelajaran pada setiap jenjang pendidikan. SAGU mengacu pada CP Kurikulum Merdeka tanpa mendefinisikan ulang isi CP. CP disimpan sebagai referensi lookup.

### Entitas CP

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik CP |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran terkait |
| grade_level | VARCHAR(10) | Jenjang (X, XI, XII) |
| cp_code | VARCHAR(20) | Kode CP (misalnya CP-INF-01) |
| description | TEXT | Deskripsi capaian pembelajaran |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran referensi |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

---

## 2. Lingkup Materi (LM)

LM adalah kelompok topik materi yang membentuk cakupan pembelajaran dalam satu mata pelajaran. Setiap LM berisi beberapa TP. LM adalah unit penilaian sumatif.

### Entitas LM

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik LM |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| cp_id | UUID (FK -> learning_objectives_cp.id) | Relasi ke CP (opsional) |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| number | INT | Nomor urut LM |
| title | VARCHAR(255) | Judul Lingkup Materi |
| description | TEXT | Deskripsi LM |
| topics | TEXT | Daftar topik yang termasuk dalam LM |
| assessment_type | ENUM | sumatif_tengah_semester, sumatif_akhir_semester, proyek, uts, uas |
| weight | DECIMAL(3,2) | Bobot LM dalam perhitungan nilai akhir mata pelajaran |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### Relasi LM

- 1 LM termasuk dalam 1 teaching_assignment (1 guru, 1 rombel, 1 mata pelajaran).
- 1 LM dapat berisi beberapa TP.
- Banyak LM termasuk dalam 1 teaching_assignment.
- LM terkait dengan 1 semester akademik.

---

## 3. Tujuan Pembelajaran (TP)

TP adalah tujuan spesifik yang harus dicapai siswa pada setiap pertemuan atau rangkaian pertemuan. Setiap TP bersifat terukur dan terkait dengan satu LM. TP digunakan sebagai dasar penilaian formatif.

### Entitas TP

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik TP |
| curriculumModuleId | UUID (FK -> curriculum_modules.id) | Relasi ke LM induk |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| tp_number | INT | Nomor urut TP (contoh: TP1, TP2, TP3) |
| title | VARCHAR(255) | Judul Tujuan Pembelajaran |
| description | TEXT | Deskripsi detail TP |
| indicator | TEXT | Indikator pencapaian TP |
| assessment_type | ENUM | formatif |
| weight | DECIMAL(3,2) | Bobot TP dalam konteks LM |
| due_date | DATE | Batas waktu penilaian TP (nullable) |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### Relasi TP

- 1 TP termasuk dalam 1 LM.
- 1 TP dimiliki oleh 1 teaching_assignment (guru, rombel, mata pelajaran).
- Banyak TP termasuk dalam 1 LM.
- TP digunakan sebagai dasar penilaian formatif.

---

## 4. Pertemuan (Pertemuan Mengajar)

Pertemuan adalah sesi pembelajaran yang direncanakan oleh guru dan dijalankan pada tanggal tertentu. Pertemuan terhubung ke TP yang sedang diajarkan.

### Entitas Pertemuan

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik pertemuan |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| curriculumModuleId | UUID (FK -> curriculum_modules.id, nullable) | LM yang diajarkan |
| learningObjectiveId | UUID (FK -> learning_objectives.id, nullable) | TP yang diajarkan |
| teaching_journal_id | UUID (FK -> teaching_journals.id) | Relasi ke jurnal mengajar |
| meeting_number | INT | Nomor urut pertemuan |
| meeting_date | DATE | Tanggal pertemuan |
| start_time | DateTime | Waktu mulai |
| end_time | DateTime | Waktu selesai |
| topic_summary | TEXT | Ringkasan topik yang dibahas |
| tp_covered | TEXT | TP yang tercapai pada pertemuan ini |
| homeroom_teacher_note | TEXT | Catatan wali kelas (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### Relasi Pertemuan

- 1 pertemuan terhubung ke 1 teaching_assignment.
- 1 pertemuan boleh terhubung ke 1 LM atau 1 TP (atau keduanya).
- 1 pertemuan terhubung ke 1 teaching_journal (jurnal mengajar).
- Banyak pertemuan membentuk rangkaian pertemuan dalam 1 semester.
- 1 pertemuan memiliki banyak catatan absensi siswa.

---

## 4A. Absensi Operasional per Pertemuan

Absensi MVP dicatat per pertemuan mengajar, bukan hanya per tanggal. Pola ini mencegah benturan data saat satu siswa mengikuti lebih dari satu pertemuan atau mata pelajaran pada tanggal yang sama.

### Entitas Absensi

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik absensi |
| student_id | UUID (FK -> students.id) | Siswa yang dicatat |
| meeting_id | UUID (FK -> meetings.id) | Pertemuan terkait |
| rombel_id | UUID (FK -> rombels.id) | Rombel siswa saat absensi |
| attendance_date | DATE | Tanggal absensi, mengikuti tanggal pertemuan |
| status | ENUM | HADIR, IZIN, SAKIT, ALPHA, TERLAMBAT |
| note | TEXT | Catatan guru (opsional) |
| recorded_by | UUID (FK -> users.id) | Guru pencatat |
| deleted_at | TIMESTAMP | Soft delete |

### Aturan Absensi MVP

- Unique operasional: `student_id + meeting_id`.
- Saat daftar absensi dibuka pertama kali, siswa rombel ditampilkan dengan status default HADIR di UI/API, tetapi baris database baru dibuat setelah guru menyimpan.
- Guru hanya dapat mengisi absensi untuk pertemuan dari penugasan mengajar miliknya.
- Admin dapat membaca rekap dan mencetak absensi, tetapi pencatatan operasional dilakukan oleh Guru.

---

## 5. Penilaian Formatif

Penilaian formatif dilakukan setiap pertemuan (atau secara berkala) untuk memantau perkembangan siswa dan memberikan umpan balik. Penilaian formatif tidak secara langsung menentukan nilai akhir mata pelajaran (bersifat umpan balik).

### Entitas Penilaian Formatif

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik penilaian formatif |
| learningObjectiveId | UUID (FK -> learning_objectives.id) | Relasi ke TP |
| meeting_id | UUID (FK -> meetings.id) | Relasi ke pertemuan |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| student_id | UUID (FK -> students.id) | Siswa yang dinilai |
| score | DECIMAL(5,2) | Skor penilaian formatif |
| max_score | DECIMAL(5,2) | Skor maksimal |
| feedback | TEXT | Umpan balik guru kepada siswa |
| assessment_date | DATE | Tanggal penilaian (biasanya = tanggal pertemuan) |
| assessment_type | ENUM | observasi, tugas_harian, kuis_singkat, refleksi, diskusi |
| recorded_by | UUID (FK -> teachers.id) | Guru yang mencatat |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### Relasi Penilaian Formatif

- 1 penilaian formatif dikaitkan dengan 1 TP.
- 1 penilaian formatif dikaitkan dengan 1 pertemuan.
- 1 penilaian formatif dikaitkan dengan 1 siswa.
- Banyak penilaian formatif dapat dilakukan untuk TP yang sama dalam pertemuan berbeda.
- Penilaian formatif tidak berkontribusi langsung ke nilai akhir.

---

## 6. Penilaian Sumatif

Penilaian sumatif dilakukan pada akhir fase atau sub-fase pembelajaran untuk mengukur pencapaian kompetensi siswa secara keseluruhan. Dilakukan per LM (Lingkup Materi). Komponen penilaian sumatif meliputi: Harian, UTS, UAS, Proyek, Portofolio.

### Entitas Penilaian Sumatif

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik penilaian sumatif |
| curriculum_module_id | UUID (FK -> curriculum_modules.id) | Relasi ke LM |
| meeting_id | UUID (FK -> meetings.id, nullable) | Pertemuan terkait (jika ada) |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan |
| student_id | UUID (FK -> students.id) | Siswa yang dinilai |
| grading_component_id | UUID (FK -> grading_components.id) | Komponen penilaian (Harian, UTS, UAS) |
| score | DECIMAL(5,2) | Skor yang diperoleh |
| max_score | DECIMAL(5,2) | Skor maksimal |
| weight_override | DECIMAL(3,2) | Bobot khusus (jika berbeda dari default grading_component) |
| is_published | BOOLEAN | Status publikasi |
| published_by | UUID (FK -> teachers.id, nullable) | Guru yang mempublikasikan |
| published_at | TIMESTAMP (nullable) | Waktu publikasi |
| notes | TEXT | Catatan tambahan |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### Relasi Penilaian Sumatif

- 1 penilaian sumatif dikaitkan dengan 1 LM.
- 1 penilaian sumatif dikaitkan dengan 1 komponen penilaian (grading_component).
- 1 penilaian sumatif dikaitkan dengan 1 siswa.
- 1 penilaian sumatif boleh dikaitkan dengan 1 pertemuan (opsional).
- Nilai sumatif berkontribusi langsung ke nilai akhir mata pelajaran.

---

## 7. Grading Component (Komponen Penilaian)

Komponen penilaian adalah entitas konfigurasi tingkat sekolah. Setiap komponen memiliki bobot dan tipe (formatif atau sumatif). Komponen menentukan bagaimana nilai akhir dihitung.

### Entitas Grading Component (Revisi dari Versi Sebelumnya)

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik komponen |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran (opsional, bisa umum) |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| name | VARCHAR(50) | Nama komponen (Harian, UTS, UAS) |
| weight | DECIMAL(3,2) | Bobot komponen (0.30 contohnya) |
| assessment_category | ENUM | formative, summative |
| assessment_type_detail | VARCHAR(50) | Detail jenis (harian, tengah_semester, akhir_semester, uts, uas) |
| description | TEXT | Deskripsi komponen |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### Contoh Konfigurasi Komponen

| Nama | Bobot | Kategori | Tipe Detail |
|---|---|---|---|
| Harian | 0.30 | summative | harian |
| UTS | 0.20 | summative | tengah_semester |
| UAS | 0.50 | summative | akhir_semester |

Total bobot seluruh komponen sumatif harus = 1.00 (100%).

---

## 8. Leger Nilai

Leger adalah tampilan terstruktur dari seluruh penilaian siswa (formatif dan sumatif) per mata pelajaran, per TP, dan per LM. Leger bukan tabel tersendiri; ini adalah query view.

### Struktur Leger (Query View)

Leger menggabungkan data dari:
- `teaching_assignments` (guru, rombel, mata pelajaran)
- `learning_objectives` (TP)
- `curriculum_modules` (LM)
- `meetings` (Pertemuan)
- `formative_assessments` (Penilaian Formatif)
- `summative_assessments` (Penilaian Sumatif)
- `grading_components` (Komponen penilaian)
- `students` (Data siswa)

### Tampilan Leger per TP (Formatif)

| TP | Pertemuan | Tanggal | Skor | Max Skor | Umpan Balik |
|---|---|---|---|---|---|
| TP1 | Pertemuan 1 | 2025-08-15 | 85 | 100 | Bagus |
| TP1 | Pertemuan 2 | 2025-08-22 | 90 | 100 | Sangat Bagus |
| TP2 | Pertemuan 3 | 2025-08-29 | 78 | 100 | Perbaiki |

### Tampilan Leger per LM (Sumatif)

| LM | Komponen | Skor | Bobot | Nilai Tertimbang |
|---|---|---|---|---|
| LM1 | Harian (0.30) | 85 | 0.30 | 25.5 |
| LM1 | UTS (0.20) | 80 | 0.20 | 16.0 |
| LM1 | UAS (0.50) | 78 | 0.50 | 39.0 |
| | **Total** | | **1.00** | **80.5** |

---

## 9. Nilai Akhir Mata Pelajaran

Nilai akhir dihitung secara otomatis dari agregasi nilai komponen sumatif yang telah dikonfigurasi dalam grading_components. Format konversi:

| Rentang Nilai | Huruf | Predikat |
|---|---|---|
| 90 - 100 | A | Sangat Baik |
| 80 - 89 | B | Baik |
| 70 - 79 | C | Cukup |
| 60 - 69 | D | Kurang |
| < 60 | E | Tidak Memenuhi |

### Entitas Nilai Akhir (Materialized Grade Record)

| Field | Tipe | Keterangan |
|---|---|---|
| student_id | UUID (FK) | Siswa |
| teaching_assignment_id | UUID (FK) | Penugasan mengajar |
| subject_id | UUID (FK) | Mata pelajaran |
| semester_id | UUID (FK) | Semester |
| academic_year_id | UUID (FK) | Tahun ajaran |
| numeric_score | DECIMAL(5,2) | Nilai numerik akhir |
| letter_grade | VARCHAR(2) | Huruf (A/B/C/D/E) |
| predicate | VARCHAR(20) | Predikat (Sangat Baik, Baik, Cukup, Kurang, Tidak Memenuhi) |
| is_published | BOOLEAN | Status publikasi |

---

## 10. Rapor

Rapor adalah dokumen resmi hasil pembelajaran siswa per semester. Rapor berisi nilai akhir per mata pelajaran, deskripsi prestasi, dan catatan.

### Entitas Rapor

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik rapor |
| student_id | UUID (FK -> students.id) | Siswa |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Penugasan mengajar |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| numeric_score | DECIMAL(5,2) | Nilai akhir (sumber dari nilai_akhir) |
| letter_grade | VARCHAR(2) | Huruf |
| predicate | VARCHAR(20) | Predikat |
| attendance_summary | JSON | Rekap absensi (hadir, izin, sakit, alpa) |
| teacher_note | TEXT | Catatan guru |
| parent_note | TEXT | Catatan orang tua (nullable) |
| is_printed | BOOLEAN | Status pencetakan |
| printed_at | TIMESTAMP (nullable) | Waktu cetak |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

---

## 11. Contoh Implementasi: Mata Pelajaran Informatika

### Struktur CP untuk Informatika (Kelas XI)

| Kode CP | Deskripsi |
|---|---|
| CP-INF-01 | Memahami konsep dasar pemrograman |
| CP-INF-02 | Mengembangkan perangkat lunak sederhana |
| CP-INF-03 | Menerapkan etika digital dan keamanan data |

### Struktur LM untuk Informatika Semester Ganjil

| LM | Judul | Topik | Penilaian Sumatif | Bobot |
|---|---|---|---|---|
| LM1 | Dasar Pemrograman | Variabel, tipe data, operasi | UAS | 0.25 |
| LM2 | Struktur Kontrol | IF, WHILE, FOR | UTS | 0.25 |
| LM3 | Fungsi dan Modul | Definisi fungsi, parameter | Proyek | 0.25 |
| LM4 | Keamanan Digital | Etika, enkripsi dasar | UAS | 0.25 |

### Struktur TP untuk LM1 (Dasar Pemrograman)

| TP | Judul | Indikator |
|---|---|---|
| TP1 | Memahami variabel dan tipe data | Menjelaskan jenis tipe data dan mendeklarasikan variabel |
| TP2 | Melakukan operasi aritmatika | Menulis ekspresi aritmatika sederhana dalam kode |
| TP3 | Menggunakan input/output dasar | Membuat program dengan input dan output |

### Alur Penilaian Informatika

```
Pertemuan 1-3 (Dasar Pemrograman)
    → Formatif per TP: TP1 (observasi + kuis), TP2 (tugas), TP3 (refleksi)
Pertemuan 4-6 (Struktur Kontrol)
    → Formatif per TP: TP4, TP5, TP6
    → Sumatif LM1 (Pertemuan 6): UTS → Bobot 0.25
Pertemuan 7-9 (Fungsi dan Modul)
    → Formatif per TP: TP7, TP8, TP9
    → Sumatif LM3 (Pertemuan 9): Proyek → Bobot 0.25
Pertemuan 10-12 (Keamanan Digital)
    → Formatif per TP: TP10, TP11, TP12
    → Sumatif LM4 (Pertemuan 12): UAS → Bobot 0.25
    Sumatif LM2 (Pertemuan 6): UAS → Bobot 0.25

Perhitungan Nilai Akhir:
    Harian (0.20) + UTS (0.25) + Proyek (0.25) + UAS (0.30) = 100%
```

---

## Diagram Alur Akademik Lengkap

```
┌─────────────────────────────────────────────────────────┐
│                   Capaian Pembelajaran (CP)              │
│            (Referensi nasional per jenjang)              │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Lingkup Materi (LM)                        │
│   • Cakupan materi per semester per mata pelajaran     │
│   • Induk dari TP                                      │
│   • Unit penilaian sumatif                             │
└──────────────┬────────────────────────────┬──────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   Tujuan Pembelajaran   │     │  Penilaian Sumatif      │
│        (TP)             │     │  (per LM)               │
│  • TP1, TP2, TP3       │     │  • Harian               │
│  • Induk: LM            │     │  • UTS                  │
│  • Induk: CP            │     │  • UAS                  │
│  • Dasar: Formatif      │     │  • Proyek               │
└────────────┬────────────┘     │  • Portofolio           │
             │                   │  (per komponen bobot)   │
             ▼                   └────────────┬────────────┘
┌──────────────────────────────────────────────┼────────────┐
│              Pertemuan Mengajar              │            │
│  • Tanggal, waktu, topik, TP tercapai       │            │
│  • Terhubung ke jurnal mengajar (teaching_journals)│           │
└──────────────────────┬───────────────────────┘            │
                       │                                    │
     ┌─────────────────┼─────────────────┐                  │
     ▼                 ▼                 ▼                  │
┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  Formatif  │  │   Leger    │  │     Rapor          │    │
│  (per TP)  │  │ (rekap nilai)│  │ (nilai akhir +    │    │
│  • Observasi│  │ • Per TP   │  │  absensi + catatan)│    │
│  • Tugas    │  │ • Per LM   │  │ • Cetak PDF       │    │
│  • Kuis     │  │ • Per siswa│  └────────────────────┘    │
│  • Refleksi │  └────────────┘                            │
│  • Umpan balik│  ◄── Agregasi Nilai ──►                  │
└────────────┘      (otomatis per grading_components)      │
                                                           │
                    ┌─────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │  Nilai Akhir Mata      │
        │  Pelajaran             │
        │  • Numerik → Huruf     │
        │  • Konversi A-E        │
        │  • Publikasi bertahap  │
        └────────────────────────┘
```

---

## Indeks yang Disarankan

- `learning_objectives.lm_id` + `learning_objectives.tp_number` — COMPOSITE INDEX
- `curriculum_modules.lm_id` + `teaching_assignment_id` — COMPOUND INDEX
- `meetings.teaching_assignment_id` + `meeting_date` — COMPOSITE INDEX
- `formative_assessments.tp_id` + `student_id` — COMPOSITE INDEX
- `summative_assessments.lm_id` + `student_id` + `grading_component_id` — COMPOSITE INDEX
- `grades_dashboard.teaching_assignment_id` + `student_id` — COMPOSITE INDEX
- `raport.student_id` + `semester_id` — COMPOSITE INDEX
