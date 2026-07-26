# ERD Dokumentasi SAGU

## Entity Relationship Diagram Final Database SAGU

Dokumen ini mendefinisikan struktur relasi antar tabel dalam database SAGU berdasarkan prisma/schema.prisma dan seluruh dokumen akademik yang telah disepakati.

---

## Entitas Utama dan Hubungan

```
SCHOOL (1) ──┬── SETTING (1:1)
               │
               ├── ACADEMIC_YEAR (1:N)
               │       │
               │       ├── SEMESTER (1:N)
               │       │       │
               │       │       ├── CLASS (1:N)
               │       │       │       │
               │       │       │       └── ROMBEL (N:1)
               │       │       │               │
               │       │       │               ├── STUDENT (N:1)
               │       │       │               ├── TEACHING_ASSIGNMENT (N:1)
               │       │       │               ├── TEACHING_JOURNAL (N:1)
               │       │       │               ├── ATTENDANCE (N:1)
               │       │       │               └── RAPORT (N:1)
               │       │       │
               │       │       ├── TEACHING_ASSIGNMENT (N:1)
               │       │       │       │
               │       │       │       ├── SUBJECT (N:1)
               │       │       │       ├── ROMBEL (N:1)
               │       │       │       ├── CLASS (N:1)
               │       │       │       ├── TEACHER (N:1)
               │       │       │       ├── ACADEMIC_YEAR (N:1)
               │       │       │       ├── SEMESTER (N:1)
               │       │       │       │
               │       │       │       ├── CURRICULUM_MODULE (LM) (1:N)  ← Lingkup Materi
               │       │       │       ├── LEARNING_OBJECTIVE (TP) (1:N) ← Tujuan Pembelajaran
               │       │       │       ├── MEETING (1:N)
               │       │       │       ├── FORMATIVE_ASSESSMENT (1:N)    ← Penilaian Formatif
               │       │       │       ├── SUMMATIVE_ASSESSMENT (1:N)    ← Penilaian Sumatif
               │       │       │       ├── RAPORT (1:N)
               │       │       │       └── GRADE_DASHBOARD (1:N) ← Nilai Akhir
               │       │       │
               │       │       ├── GRADING_COMPONENT (1:N)
               │       │       │       │
               │       │       │       └── SUMMATIVE_ASSESSMENT (N:1)  ← FK ke komponen penilaian
               │       │       │
               │       │       └── RAPORT (N:1)
               │       │
               │       └── TEACHING_ASSIGNMENT (N:1)
               │               │
               │               └── CURRICULUM_MODULE (LM) (N:1) → LM (N:1) → LEARNING_OBJECTIVE (TP) (N:1)
               │
               ├── SUBJECT (1:N)
               │       │
               │       ├── LEARNING_OBJECTIVE_CP (CP) (1:N) ← Capaian Pembelajaran
               │       ├── TEACHING_ASSIGNMENT (N:1)
               │       ├── TEACHING_JOURNAL (N:1)
               │       ├── SUMMATIVE_ASSESSMENT (N:1)
               │       ├── RAPORT (N:1)
               │       └── GRADING_COMPONENT (N:1)
               │
               ├── TEACHER (1:N)
               │       │
               │       └── TEACHING_ASSIGNMENT (N:1)
               │               └── (guru mengajar di rombel tertentu untuk mata pelajaran tertentu)
               │
               ├── STUDENT (1:N)
               │       │
               │       ├── ATTENDANCE (N:1)
               │       ├── FORMATIVE_ASSESSMENT (N:1)
               │       ├── SUMMATIVE_ASSESSMENT (N:1)
               │       ├── GRADE_DASHBOARD (N:1)
               │       └── RAPORT (N:1)
               │       └── PARENT (N:1) ← Orang Tua terhubung ke siswa
               │
               ├── PARENT (N:1)
               │       │
               │       └── USER (N:1) ← akun orang tua
               │
               └── USER (1:1) ← master pengguna dengan role
                       │
                       ├── TEACHER (1:1) ← guru memiliki profile guru
                       ├── STUDENT (1:1) ← siswa memiliki profile siswa
                       ├── PARENT (N:1) ← orang tua memiliki banyak relasi ke anak
                       ├── PROFILE (1:1) ← data profil tambahan
                       ├── ATTENDANCE (N:1) ← absensi yang dicatat
                       ├── TEACHING_JOURNAL (N:1) ← jurnal mengajar
                       ├── SUMMATIVE_ASSESSMENT (N:1) ← penilaian yang dipublikasikan
                       └── HOMEROOM_TEACHER → ROMBEL (relasi wali kelas)

ROLE (1:N) ──→ USER (melalui field role di tabel users)
```

---

## Diagram Detail Per Modul Akademik

### Modul Akademik Inti (CP → LM → TP → Pertemuan → Penilaian)

```
ACADEMIC_YEAR (1) ──┐
SEMESTER    (1) ────┘
         │
         ▼
    SUBJECT
     │  1:N  │
     ▼        ▼
LEARNING_OBJECTIVE_CP  CURRICULUM_MODULE (LM)
(CP nasional per        1:N          │
 jenjang)          ─────┤              │
                         │              1:N
                         │              ▼
                         │        LEARNING_OBJECTIVE (TP)
                         │              │  1:N
                         │              ▼
                         │          MEETING (Pertemuan)
                         │              │  1:N
                         │              ▼
                         │     FORMATIVE_ASSESSMENT (Formatif per TP)
                         │
              ───────────┤
                         │  1:N (per LM per komponen)
                         │
      GRADING_COMPONENT ─┤
      (Tentukan bobot)   │  N:1
                         ▼
               SUMMATIVE_ASSESSMENT (Sumatif per LM)
                         │
                         │  N:1 (per siswa)
                         ▼
              GRADE_DASHBOARD (Nilai Akhir Final)
                         │
                         │  N:1
                         ▼
                   RAPOR (Dokumentasi akhir per semester)
```

### Alur Penugasan Mengajar (Teaching Assignment)

```
TEACHER          ROMBEL           SUBJECT        ACADEMIC_YEAR    SEMESTER
   │                │                │                │                │
   └────────────────┴────────────────┴────────────────┴────────────────┘
                              │
                              ▼
                    TEACHING_ASSIGNMENT
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
    CURRICULUM_MODULE    LEARNING_OBJECTIVE    MEETING
        (LM) 1:N             (TP) 1:N          1:N
            │                 │                 │
            ▼                 ▼                 ▼
    SUMMATIVE_ASSESSMENT  FORMATIVE_ASSESSMENT  (per pertemuan)
        (per LM per         (per TP per pertemuan)
         grading component)
```

---

## Keterangan Indeks dan Constraint

### Primary Key
Semua tabel menggunakan UUID sebagai primary key dengan prefix `id`.

### Unique Constraints
| Tabel | Field | Keterangan |
|---|---|---|
| users | username | Username harus unik |
| users | email | Email harus unik |
| profiles | userId | Satu profil per pengguna |
| students | nis | NIS harus unik |
| students | nisn | NISN harus unik |
| students | userId | Satu student per pengguna |
| teachers | userId | Satu guru per pengguna |
| rombels | class_id + academic_year_id + semester_id + name | Nama rombel unik per kelas per periode |
| teaching_assignments | teacher_id + rombel_id + subject_id + academic_year_id + semester_id | Satu penugasan mengajar unik per kombinasi |
| curriculum_modules | teaching_assignment_id + number | LM unik per penugasan per nomor |
| learning_objectives | curriculum_module_id + tp_number | TP unik per LM per nomor |
| meetings | teaching_assignment_id + meeting_number | Pertemuan unik per penugasan per nomor |
| attendances | student_id + meeting_id | Satu absensi per siswa per pertemuan |
| grading_components | academic_year_id + semester_id + subject_id + name | Komponen unik per mata pelajaran per periode |
| formative_assessments | learning_objective_id + student_id + assessment_date | Satu nilai formatif per TP per siswa per tanggal |
| summative_assessments | curriculum_module_id + student_id + grading_component_id | Satu nilai sumatif per siswa per LM per komponen |
| grades_dashboard | student_id + semester_id + academic_year_id | Satu nilai akhir per siswa per semester |
| raport | student_id + semester_id + academic_year_id | Satu rapor per siswa per semester |
| audit_logs | (tidak ada unique, murni append-only) | Log audit bertambah terus |

### Indeks Komposit yang Disarankan
| Tabel | Indeks | Tujuan |
|---|---|---|
| rombels | class_id + academic_year_id + semester_id + name | Pencarian rombel |
| teaching_assignments | teacher_id + rombel_id | Cek penugasan guru per rombel |
| teaching_assignments | academic_year_id + semester_id | Cek penugasan per periode |
| teaching_assignments | subject_id | Cari penugasan berdasarkan mata pelajaran |
| meetings | teaching_assignment_id + meeting_date | Dapatkan pertemuan per periode |
| attendances | meeting_id | Daftar absensi per pertemuan |
| attendances | attendance_date + student_id | Rekap absensi harian per siswa |
| attendances | rombel_id | Daftar absensi per rombel |
| formative_assessments | learning_objective_id + student_id | Cek nilai formatif per TP per siswa |
| formative_assessments | meeting_id | Nilai formatif per pertemuan |
| summative_assessments | curriculum_module_id | Nilai sumatif per LM |
| summative_assessments | student_id | Semua nilai sumatif siswa (untuk leger) |
| summative_assessments | grading_component_id | Nilai per komponen penilaian |
| summative_assessments | teaching_assignment_id | Semua nilai sumatif per penugasan |
| grades_dashboard | teaching_assignment_id + student_id | Leger per siswa per penugasan |
| grades_dashboard | student_id + semester_id | Leger per siswa per semester |
| raport | student_id + semester_id | Rapor per siswa per semester |
| audit_logs | userId | Cari audit log pengguna |
| audit_logs | createdAt | Monitor audit log temporal |
| audit_logs | action | Cari aksi tertentu dalam log |
| audit_logs | tableName | Cari log berdasarkan tabel |
| learning_objectives_cp | subject_id + grade_level | Cari CP per mata pelajaran per jenjang |
| curriculum_modules | teaching_assignment_id | Semua LM untuk penugasan tertentu |
| curriculum_modules | academic_year_id + semester_id | LM per periode akademik |
| learning_objectives | curriculum_module_id | Semua TP untuk LM tertentu |
| learning_objectives | teaching_assignment_id | Semua TP yang ditugaskan per guru |
| learning_objectives | academic_year_id + semester_id | TP per periode akademik |
| teaching_journals | teaching_assignment_id + meeting_date | Jurnal mengajar per penugasan per tanggal |
| profiles | userId | Profil per pengguna (unik sudah di-definisi) |
| settings | school_id + key | Pengaturan per sekolah per kunci |
| parents | userId + studentId | Hubungan unik per orang tua per siswa |

---

## Catatan tentang Relasi Kunci

1. **users → teachers (1:1)**: Setiap guru memiliki tepat satu record di tabel `teachers` yang menghubungkan ke `users.id`.
2. **users → students (1:1)**: Setiap siswa memiliki tepat satu record di tabel `students` yang menghubungkan ke `users.id`.
3. **users → parents (1:N)**: Satu pengguna orang tua dapat terhubung ke satu atau lebih siswa (orang tua beberapa anak).
4. **homeroom_teacher_id → users.id**: Rombel menunjuk pengguna sebagai wali kelas. Pengguna ini seharusnya memiliki role `GURU` atau `WALI_KELAS`. Pembatasan role diterapkan di application layer.
5. **attendances.meeting_id → meetings.id**: Absensi operasional dicatat per pertemuan agar satu siswa dapat memiliki beberapa catatan kehadiran pada tanggal yang sama untuk penugasan berbeda.
6. **attendances.recorded_by → users.id**: Siapa pun dengan role yang berwenang (Guru) dapat mencatat absensi. Pembatasan per rombel dan kepemilikan penugasan diterapkan di application layer.
7. **summative_assessments.published_by → users.id**: Guru yang mempublikasikan nilai. Di aplikasi level, hanya Guru/Wali Kelas yang boleh mempublish.
8. **teaching_assignments adalah pusat hubungan akademik**: Semua entitas akademik (LM, TP, pertemuan, penilaian, leger) terhubung melalui teaching_assignment yang menghubungkan guru, rombel, mata pelajaran, dan periode akademik.
