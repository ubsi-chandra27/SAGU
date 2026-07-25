# Database Schema

## Skema Database SAGU

Dokumen ini mendefinisikan struktur database SAGU untuk MVP single-school. Semua nama tabel dan field menggunakan konvensi `snake_case`. Soft delete diterapkan pada tabel data master dan transaksi akademik.

### Arsitektur Single-School

SAGU MVP dirancang untuk satu sekolah. Tabel `schools` menyimpan data institusi sekolah sebagai konfigurasi utama. Seluruh data akademik berada dalam satu konteks sekolah dan tidak perlu `school_id` foreign key pada setiap tabel. Skema ini dapat diperluas ke multi-school di fase berikutnya.

## Konvensi Umum

- Semua tabel menggunakan `id` sebagai primary key dengan tipe `UUID`.
- Timestamp `created_at` dan `updated_at` tersedia di setiap tabel.
- Field `deleted_at` digunakan untuk soft delete (nullable), kecuali pada tabel `audit_logs`, `settings`, dan `schools`.
- Foreign key menggunakan referensi `ON DELETE RESTRICT` untuk data utama dan `ON DELETE SET NULL` untuk relasi opsional.
- Semua password di-hash menggunakan algoritma yang aman (bcrypt).
- Akses data berdasarkan relasi role diterapkan pada application layer (Row Level Security).

## Enum

### Role
`ADMIN`, `GURU`, `WALI_KELAS`, `SISWA`, `ORANG_TUA`

### Gender
`LAKI_LAKI`, `PEREMPUAN`

### AttendanceStatus
`HADIR`, `IZIN`, `SAKIT`, `ALPHA`, `TERLAMBAT`

### AssessmentCategory
`FORMATIF`, `SUMATIF`

### AssessmentTypeDetail
`HARIAN`, `TUGAS_HARIAN`, `KUIS_SINGKAT`, `REFLEKSI`, `DISKUSI`, `TENGAH_SEMESTER`, `AKHIR_SEMESTER`, `UTS`, `UAS`, `PROYEK`, `PORTOFOLIO`

### GradeLetter
`A`, `B`, `C`, `D`, `E`

### Predicate
`SANGAT_BAIK`, `BAIK`, `CUKUP`, `KURANG`, `TIDAK_MEMENUHI`

## Entitas Utama

### schools

Data institusi sekolah.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik sekolah |
| name | VARCHAR(255) | Nama sekolah |
| npsn | VARCHAR(10) | Nomor Pokok Sekolah Nasional (nullable) |
| address | TEXT | Alamat sekolah |
| phone | VARCHAR(15) | Nomor telepon sekolah |
| email | VARCHAR(100) | Email resmi sekolah |
| logo_url | VARCHAR(255) | URL logo sekolah (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### settings

Pengaturan aplikasi global untuk sekolah.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik pengaturan |
| school_id | UUID (FK -> schools.id) | Relasi ke sekolah |
| key | VARCHAR(100) | Kunci pengaturan |
| value | VARCHAR(500) | Nilai pengaturan |
| description | TEXT | Deskripsi pengaturan (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |

### users

Menyimpan data pengguna sistem dengan role-based access.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik pengguna |
| username | VARCHAR(50) | Nama pengguna, unik |
| email | VARCHAR(100) | Alamat email, unik |
| password_hash | VARCHAR(255) | Password yang telah di-hash |
| role | ENUM (Role) | admin, guru, wali_kelas, siswa, orang_tua |
| avatar_url | VARCHAR(255) | URL foto profil (nullable) |
| is_active | BOOLEAN | Status aktif pengguna |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### profiles

Profil tambahan pengguna yang terpisah dari tabel `users`.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik profil |
| user_id | UUID (FK -> users.id) | Relasi ke pengguna |
| full_name | VARCHAR(255) | Nama lengkap |
| gender | ENUM (Gender) | laki-laki, perempuan |
| place_of_birth | VARCHAR(100) | Tempat lahir (nullable) |
| date_of_birth | DATE | Tanggal lahir (nullable) |
| phone | VARCHAR(15) | Nomor telepon pribadi (nullable) |
| address | TEXT | Alamat pribadi (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |

### academic_years

Tahun ajaran sekolah.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik tahun ajaran |
| name | VARCHAR(20) | Nama tahun ajaran, contoh: 2025/2026 |
| start_date | DATE | Tanggal mulai |
| end_date | DATE | Tanggal berakhir |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### semesters

Semester dalam tahun ajaran.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik semester |
| academic_year_id | UUID (FK -> academic_years.id) | Relasi ke tahun ajaran |
| name | VARCHAR(10) | Nama semester, contoh: Ganjil, Genap |
| start_date | DATE | Tanggal mulai |
| end_date | DATE | Tanggal berakhir |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### classes

Kelas (tingkat kelas, contoh: X, XI, XII).

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik kelas |
| name | VARCHAR(20) | Nama kelas, contoh: X-1, XI-A, XII-IPA-1 |
| level | VARCHAR(10) | Tingkat kelas, contoh: X, XI, XII |
| academic_year_id | UUID (FK -> academic_years.id) | Relasi ke tahun ajaran |
| semester_id | UUID (FK -> semesters.id, nullable) | Relasi ke semester (nullable) |
| capacity | INT | Kapasitas maksimal siswa (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### rombels

Rombongan belajar (kelas aktif yang terdiri dari siswa dan wali kelas).

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik rombel |
| class_id | UUID (FK -> classes.id) | Relasi ke kelas |
| academic_year_id | UUID (FK -> academic_years.id) | Relasi ke tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Relasi ke semester |
| name | VARCHAR(50) | Nama rombel, contoh: X-1 Ganjil |
| homeroom_teacher_id | UUID (FK -> users.id, nullable) | Relasi ke guru wali kelas |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### subjects

Mata pelajaran.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik mata pelajaran |
| name | VARCHAR(100) | Nama mata pelajaran |
| code | VARCHAR(10) | Kode mata pelajaran |
| description | TEXT | Deskripsi mata pelajaran (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### teachers

Data guru (detail tambahan di `profiles`).

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik guru |
| user_id | UUID (FK -> users.id) | Relasi ke pengguna |
| nip | VARCHAR(18) | Nomor Induk Pegawai (nullable) |
| specialization | VARCHAR(100) | Bidang keahlian (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### students

Data siswa.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik siswa |
| user_id | UUID (FK -> users.id) | Relasi ke pengguna |
| nis | VARCHAR(10) | Nomor Induk Siswa |
| nisn | VARCHAR(10) | Nomor Induk Siswa Nasional |
| rombel_id | UUID (FK -> rombels.id, nullable) | Rombel aktif saat ini |
| parent_name | VARCHAR(255) | Nama orang tua/wali (nullable) |
| parent_phone | VARCHAR(15) | Telepon orang tua (nullable) |
| parent_email | VARCHAR(100) | Email orang tua (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### parents

Akun orang tua yang terhubung ke siswa.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik orang tua |
| user_id | UUID (FK -> users.id) | Relasi ke pengguna |
| student_id | UUID (FK -> students.id) | Relasi ke siswa |
| relationship | VARCHAR(50) | Hubungan dengan siswa, contoh: ayah, ibu, wali |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### teaching_assignments

Penugasan guru mengajar ke rombel untuk mata pelajaran tertentu. Satu penugasan mencakup guru, rombel, kelas, mata pelajaran, dan periode akademik.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik penugasan |
| teacher_id | UUID (FK -> teachers.id) | Relasi ke guru |
| rombel_id | UUID (FK -> rombels.id) | Relasi ke rombel |
| class_id | UUID (FK -> classes.id) | Relasi ke kelas |
| subject_id | UUID (FK -> subjects.id) | Relasi ke mata pelajaran |
| academic_year_id | UUID (FK -> academic_years.id) | Relasi ke tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Relasi ke semester |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

### learning_objectives_cp (CP)

Capaian Pembelajaran nasional per mata pelajaran per jenjang.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik CP |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran terkait |
| grade_level | VARCHAR(10) | Jenjang (X, XI, XII) |
| cp_code | VARCHAR(20) | Kode CP (misalnya CP-INF-01) |
| description | TEXT | Deskripsi capaian pembelajaran |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### curriculum_modules (LM)

Lingkup Materi per penugasan mengajar.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik LM |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| cp_id | UUID (FK -> learning_objectives_cp.id, nullable) | Relasi ke CP (opsional) |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| number | INT | Nomor urut LM |
| title | VARCHAR(255) | Judul Lingkup Materi |
| description | TEXT | Deskripsi LM (nullable) |
| topics | TEXT | Daftar topik (nullable) |
| assessment_type | VARCHAR(50) | Tipe penilaian (nullable) |
| weight | DECIMAL(3,2) | Bobot LM dalam perhitungan nilai akhir |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### learning_objectives (TP)

Tujuan Pembelajaran per LM.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik TP |
| curriculum_module_id | UUID (FK -> curriculum_modules.id) | Relasi ke LM induk |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| tp_number | INT | Nomor urut TP (contoh: TP1, TP2, TP3) |
| title | VARCHAR(255) | Judul Tujuan Pembelajaran |
| description | TEXT | Deskripsi detail TP (nullable) |
| indicator | TEXT | Indikator pencapaian TP (nullable) |
| due_date | DATE | Batas waktu penilaian TP (nullable) |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### meetings

Pertemuan mengajar aktual.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik pertemuan |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| teaching_journal_id | UUID (FK -> teaching_journals.id, nullable) | Relasi ke jurnal mengajar |
| curriculum_module_id | UUID (FK -> curriculum_modules.id, nullable) | LM yang diajarkan |
| learning_objective_id | UUID (FK -> learning_objectives.id, nullable) | TP yang diajarkan |
| meeting_number | INT | Nomor urut pertemuan |
| meeting_date | DATE | Tanggal pertemuan |
| start_time | TIMESTAMP | Waktu mulai |
| end_time | TIMESTAMP | Waktu selesai |
| topic_summary | TEXT | Ringkasan topik yang dibahas (nullable) |
| tp_covered | TEXT | TP yang tercapai pada pertemuan ini (nullable) |
| homeroom_teacher_note | TEXT | Catatan wali kelas (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### teaching_journals (Jurnal Mengajar)

Jurnal mengajar guru yang mencakup rencana dan record pasca-pertemuan.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik jurnal |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| curriculum_module_id | UUID (FK -> curriculum_modules.id, nullable) | LM yang diajarkan |
| learning_objective_id | UUID (FK -> learning_objectives.id, nullable) | TP yang diajarkan |
| meeting_number | INT | Nomor urut pertemuan |
| meeting_date | DATE | Tanggal pertemuan |
| start_time | TIMESTAMP | Waktu mulai |
| end_time | TIMESTAMP | Waktu selesai |
| topic | VARCHAR(255) | Topik pembelajaran |
| description | TEXT | Deskripsi kegiatan (nullable) |
| tp_covered | TEXT | TP yang tercapai (nullable) |
| metode_pembelajaran | VARCHAR(100) | Metode pembelajaran (nullable) |
| media | TEXT | Media yang digunakan (nullable) |
| refleksi_guru | TEXT | Refleksi guru setelah pertemuan (nullable) |
| tindak_lanjut | TEXT | Rencana pertemuan berikutnya (nullable) |
| is_plan | BOOLEAN | Status rencana vs jurnal aktual |
| user_id | UUID (FK -> users.id) | Guru yang membuat jurnal |
| class_id | UUID (FK -> classes.id) | Relasi ke kelas |
| rombel_id | UUID (FK -> rombels.id) | Relasi ke rombel |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### attendances

Catatan kehadiran siswa.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik absensi |
| student_id | UUID (FK -> students.id) | Relasi ke siswa |
| rombel_id | UUID (FK -> rombels.id) | Relasi ke rombel |
| attendance_date | DATE | Tanggal absensi |
| status | ENUM (AttendanceStatus) | hadir, izin, sakit, alpa, terlambat |
| note | TEXT | Keterangan tambahan (nullable) |
| recorded_by | UUID (FK -> users.id) | Guru yang mencatat |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### grading_components

Komponen penilaian yang dikonfigurasi untuk setiap periode akademik.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik komponen |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| academic_year_id | UUID (FK -> academic_years.id) | Relasi ke tahun ajaran |
| semester_id | UUID (FK -> semesters.id) | Relasi ke semester |
| name | VARCHAR(50) | Nama komponen, contoh: Harian, UTS, UAS |
| weight | DECIMAL(3,2) | Bobot komponen (misal: 0.30 untuk 30%) |
| assessment_category | ENUM (AssessmentCategory) | formative, summative |
| assessment_type_detail | ENUM (AssessmentTypeDetail) | Detail jenis penilaian |
| description | TEXT | Deskripsi komponen (nullable) |
| is_active | BOOLEAN | Status aktif |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### formative_assessments

Penilaian formatif per TP per pertemuan per siswa.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik penilaian formatif |
| learning_objective_id | UUID (FK -> learning_objectives.id) | Relasi ke TP |
| meeting_id | UUID (FK -> meetings.id) | Relasi ke pertemuan |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| student_id | UUID (FK -> students.id) | Siswa yang dinilai |
| score | DECIMAL(5,2) | Skor penilaian formatif |
| max_score | DECIMAL(5,2) | Skor maksimal |
| feedback | TEXT | Umpan balik guru kepada siswa (nullable) |
| assessment_date | DATE | Tanggal penilaian |
| assessment_type | ENUM (AssessmentTypeDetail) | Jenis penilaian formatif |
| recorded_by | UUID (FK -> users.id) | Guru yang mencatat |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### summative_assessments

Penilaian sumatif per komponen per LM per siswa.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik penilaian sumatif |
| curriculum_module_id | UUID (FK -> curriculum_modules.id) | Relasi ke LM |
| grading_component_id | UUID (FK -> grading_components.id) | Komponen penilaian |
| meeting_id | UUID (FK -> meetings.id, nullable) | Pertemuan terkait (jika ada) |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| student_id | UUID (FK -> students.id) | Siswa yang dinilai |
| score | DECIMAL(5,2) | Skor yang diperoleh |
| max_score | DECIMAL(5,2) | Skor maksimal |
| weight_override | DECIMAL(3,2) | Bobot khusus (jika berbeda dari default) (nullable) |
| is_published | BOOLEAN | Status publikasi |
| published_by | UUID (FK -> users.id, nullable) | Guru yang mempublikasikan |
| published_at | TIMESTAMP (nullable) | Waktu publikasi |
| notes | TEXT | Catatan tambahan (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### grades_dashboard (Materialized Grade Record)

Nilai akhir final per siswa per mata pelajaran per semester.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik record |
| student_id | UUID (FK -> students.id) | Siswa |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Penugasan mengajar |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| numeric_score | DECIMAL(5,2) | Nilai numerik akhir |
| letter_grade | ENUM (GradeLetter) | Huruf (A/B/C/D/E) |
| predicate | ENUM (Predicate) | Predikat (Sangat Baik, Baik, Cukup, Kurang, Tidak Memenuhi) |
| is_published | BOOLEAN | Status publikasi |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |

### raport

Dokumen rapor akhir per semester.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik rapor |
| student_id | UUID (FK -> students.id) | Siswa |
| class_id | UUID (FK -> classes.id) | Relasi ke kelas |
| rombel_id | UUID (FK -> rombels.id, nullable) | Relasi ke rombel |
| teaching_assignment_id | UUID (FK -> teaching_assignments.id) | Penugasan mengajar |
| subject_id | UUID (FK -> subjects.id) | Mata pelajaran |
| semester_id | UUID (FK -> semesters.id) | Semester |
| academic_year_id | UUID (FK -> academic_years.id) | Tahun ajaran |
| numeric_score | DECIMAL(5,2) | Nilai akhir |
| letter_grade | ENUM (GradeLetter) | Huruf |
| predicate | ENUM (Predicate) | Predikat |
| attendance_summary | JSON | Rekap absensi (hadir, izin, sakit, alpa) |
| teacher_note | TEXT | Catatan guru |
| parent_note | TEXT | Catatan orang tua (nullable) |
| is_printed | BOOLEAN | Status pencetakan |
| printed_at | TIMESTAMP (nullable) | Waktu cetak |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Soft delete |

### audit_logs

Log audit untuk aktivitas sensitif.

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | Identifikasi unik log |
| user_id | UUID (FK -> users.id) | Relasi ke pengguna |
| action | VARCHAR(50) | Jenis aksi, contoh: create, update, delete, login, logout |
| table_name | VARCHAR(50) | Nama tabel yang terpengaruh |
| record_id | VARCHAR(100) | ID record yang diubah |
| old_values | JSON (nullable) | Nilai sebelumnya |
| new_values | JSON (nullable) | Nilai setelah perubahan |
| ip_address | VARCHAR(45) | Alamat IP pengguna |
| user_agent | TEXT | User agent browser (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |

## Diagram ERD Konseptual

```
schools (1) ──── (1) settings

users (1) ──── (1) profiles
users (1) ──── (N) teachers
users (1) ──── (N) students
users (1) ──── (N) parents
users (1) ──── (N) attendances (sebagai recorded_by)
users (1) ──── (N) audit_logs
users (1) ──── (N) teaching_journals (sebagai user_id)
users (1) ──── (N) summative_assessments (sebagai published_by)
users (1) ──── (N) formative_assessments (sebagai recorded_by)

academic_years (1) ──── (N) semesters
academic_years (1) ──── (N) classes
academic_years (1) ──── (N) rombels
academic_years (1) ──── (N) teaching_assignments
academic_years (1) ──── (N) grading_components
academic_years (1) ──── (N) raport

semesters (1) ──── (N) teaching_assignments
semesters (1) ──── (N) grading_components
semesters (1) ──── (N) rombels
semesters (1) ──── (N) raport
semesters (1) ──── (N) grades_dashboard

classes (1) ──── (N) rombels
classes (1) ──── (N) teaching_journals

rombels (1) ──── (N) students
rombels (1) ──── (N) teaching_assignments
rombels (1) ──── (N) attendances
rombels (1) ──── (N) teaching_journals
rombels (N) ──── (1) users (homeroom_teacher_id)
rombels (1) ──── (N) raport

subjects (1) ──── (N) teaching_assignments
subjects (1) ──── (N) teaching_journals
subjects (1) ──── (N) summative_assessments
subjects (1) ──── (N) raport
subjects (1) ──── (N) grades_dashboard
subjects (1) ──── (N) learning_objectives_cp

teachers (1) ──── (N) teaching_assignments

students (1) ──── (N) attendances
students (1) ──── (N) formative_assessments
students (1) ──── (N) summative_assessments
students (1) ──── (N) grades_dashboard
students (1) ──── (N) raport
students (1) ──── (N) parents

teaching_assignments (1) ──── (N) curriculum_modules
teaching_assignments (1) ──── (N) learning_objectives
teaching_assignments (1) ──── (N) meetings
teaching_assignments (1) ──── (N) formative_assessments
teaching_assignments (1) ──── (N) summative_assessments
teaching_assignments (1) ──── (N) teaching_journals
teaching_assignments (1) ──── (N) raport
teaching_assignments (1) ──── (N) grades_dashboard

learning_objectives_cp (1) ──── (N) curriculum_modules

curriculum_modules (1) ──── (N) learning_objectives
curriculum_modules (1) ──── (N) summative_assessments
curriculum_modules (1) ──── (N) meetings

learning_objectives (1) ──── (N) formative_assessments
learning_objectives (1) ──── (N) meetings

teaching_journals (N) ──── (1) meetings

meetings (1) ──── (N) formative_assessments
meetings (1) ──── (N) summative_assessments

grading_components (1) ──── (N) summative_assessments
```

## Indeks yang Disarankan

- `users.username` — UNIQUE
- `users.email` — UNIQUE
- `users.role` — INDEX (untuk query berdasarkan role)
- `students.nis` — UNIQUE
- `students.nisn` — UNIQUE
- `teaching_assignments.teacher_id + teaching_assignments.rombel_id` — COMPOSITE INDEX
- `teaching_assignments.academic_year_id + teaching_assignments.semester_id` — COMPOSITE INDEX
- `teaching_assignments.subject_id` — INDEX
- `attendances.attendance_date + attendances.student_id` — COMPOSITE INDEX
- `attendances.rombel_id` — INDEX
- `meetings.teaching_assignment_id + meeting_date` — COMPOSITE INDEX
- `teaching_journals.teaching_assignment_id + meeting_date` — COMPOSITE INDEX
- `teaching_journals.meeting_date` — INDEX
- `formative_assessments.learning_objective_id` — INDEX
- `formative_assessments.meeting_id` — INDEX
- `formative_assessments.student_id` — INDEX
- `summative_assessments.curriculum_module_id` — INDEX
- `summative_assessments.student_id` — INDEX
- `summative_assessments.grading_component_id` — INDEX
- `summative_assessments.teaching_assignment_id` — INDEX
- `summative_assessments.meeting_id` — INDEX
- `grades_dashboard.teaching_assignment_id + student_id` — COMPOSITE INDEX
- `grades_dashboard.student_id + semester_id` — COMPOSITE INDEX
- `raport.student_id + semester_id` — COMPOSITE INDEX
- `audit_logs.user_id` — INDEX
- `audit_logs.created_at` — INDEX
- `audit_logs.action` — INDEX
- `audit_logs.table_name` — INDEX
- `learning_objectives_cp.subject_id + grade_level` — COMPOSITE INDEX
- `curriculum_modules.teaching_assignment_id` — INDEX
- `curriculum_modules.academic_year_id + semester_id` — COMPOSITE INDEX
- `learning_objectives.curriculum_module_id` — INDEX
- `learning_objectives.teaching_assignment_id` — INDEX
- `learning_objectives.academic_year_id + semester_id` — COMPOSITE INDEX
- `profiles.user_id` — UNIQUE
- `grading_components.academic_year_id + semester_id` — COMPOSITE INDEX
- `parents.user_id + student_id` — UNIQUE
- `settings.school_id + key` — UNIQUE
