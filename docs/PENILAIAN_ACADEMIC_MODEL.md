# Penilaian Academic Model untuk SAGU

## Model Penilaian Sesuai Kurikulum Merdeka

Dokumen ini mendefinisikan model penilaian akademik SAGU yang sesuai dengan praktik sekolah Indonesia menggunakan Kurikulum Merdeka. Model ini mencakup Tujuan Pembelajaran (TP), Lingkup Materi (LM), Penilaian Formatif, Penilaian Sumatif, Leger Nilai, dan Nilai Akhir Mata Pelajaran.

---

## 1. Konsep Penilaian SAGU

SAGU mengadopsi model penilaian Kurikulum Merdeka yang membedakan dua jenis penilaian utama:

- **Penilaian Formatif**: Penilaian yang dilakukan secara berkala selama proses pembelajaran untuk memantau perkembangan siswa dan memberikan umpan balik. Dilakukan per TP (Tujuan Pembelajaran).
- **Penilaian Sumatif**: Penilaian yang dilakukan pada akhir fase atau sub-fase pembelajaran untuk mengukur pencapaian kompetensi siswa secara keseluruhan. Dilakukan per Lingkup Materi (LM).

Guru menginput nilai per siswa per komponen penilaian. Sistem menghitung nilai akhir berdasarkan bobot komponen yang telah ditentukan.

---

## 2. Struktur TP (Tujuan Pembelajaran)

TP adalah tujuan spesifik yang harus dicapai siswa pada setiap mata pelajaran per semester. Setiap TP berkaitan dengan satu atau lebih topik pembelajaran.

### Aturan TP

- Setiap mata pelajaran memiliki satu atau lebih TP per semester.
- TP didefinisikan oleh guru pengampu dan disetujui oleh wali kelas atau koordinator mata pelajaran.
- TP bersifat spesifik, terukur, dan dapat dicapai (SMART).
- TP terhubung ke teaching_assignment (guru mata pelajaran pada rombel tertentu).

### Struktur Data TP

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID / INT (PK) | Identifikasi unik TP |
| teaching_assignment_id | UUID / INT (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| academic_year_id | UUID / INT (FK -> academic_years.id) | Relasi ke tahun ajaran |
| semester_id | UUID / INT (FK -> semesters.id) | Relasi ke semester |
| subject_id | UUID / INT (FK -> subjects.id) | Relasi ke mata pelajaran |
| number | INT | Nomor urut TP (misalnya TP1, TP2, TP3) |
| title | VARCHAR(255) | Judul/tujuan TP |
| description | TEXT | Deskripsi detail TP |
| indicator | TEXT | Indikator pencapaian TP |
| assessment_type | ENUM | formatif, sumatif |
| weight | DECIMAL(3,2) | Bobot TP dalam konteks penilaian |
| due_date | DATE | Batas waktu penilaian TP (nullable) |
| is_active | BOOLEAN | Status aktif TP |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

---

## 3. Struktur Lingkup Materi (LM)

LM adalah kelompok topik materi yang menjadi cakupan pembelajaran dalam satu mata pelajaran. LM menjadi unit penilaiansumatif.

### Aturan LM

- Setiap mata pelajaran memiliki satu atau lebih LM per semester.
- LM dikelompokkan oleh guru berdasarkan urutan materi atau fase pembelajaran.
- LM terhubung ke teaching_assignment.
- Setiap LM dapat mengandung beberapa TP.
- Penilaian sumatif dilakukan per LM.

### Struktur Data LM

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID / INT (PK) | Identifikasi unik LM |
| teaching_assignment_id | UUID / INT (FK -> teaching_assignments.id) | Relasi ke penugasan mengajar |
| academic_year_id | UUID / INT (FK -> academic_years.id) | Relasi ke tahun ajaran |
| semester_id | UUID / INT (FK -> semesters.id) | Relasi ke semester |
| subject_id | UUID / INT (FK -> subjects.id) | Relasi ke mata pelajaran |
| number | INT | Nomor urut LM (misalnya LM1, LM2, LM3) |
| title | VARCHAR(255) | Judul Lingkup Materi |
| description | TEXT | Deskripsi LM |
| topics | TEXT | Topik-topik yang termasuk dalam LM |
| assessment_component | ENUM | sumatif_tengah_semester, sumatif_akhir_semester, proyek, uts, uas |
| weight | DECIMAL(3,2) | Bobot LM dalam perhitungan nilai akhir |
| is_active | BOOLEAN | Status aktif LM |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

---

## 4. Struktur Penilaian Formatif

Penilaian formatif dilakukan per TP selama proses pembelajaran berlangsung. Contoh penilaian formatif: observasi kelas, tugas harian, kuis singkat, diskusi kelompok, refleksi siswa.

### Aturan Penilaian Formatif

- Penilaian formatif dilakukan per TP (bukan per LM).
- Nilai formatif ditetapkan per siswa per TP.
- Nilai formatif tidak langsung memengaruhi nilai akhir mata pelajaran (bersifat umpan balik).
- Guru dapat memberikan catatan deskriptif pada penilaian formatif.
- Penilaian formatif dapat dilakukan berkali-kali dalam satu TP.

### Struktur Data Penilaian Formatif

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID / INT (PK) | Identifikasi unik penilaian formatif |
| grade_id | UUID / INT (FK -> grades.id) | Relasi ke entri nilai |
| tp_id | UUID / INT (FK -> learningobjectives.id) | Relasi ke TP |
| teaching_assignment_id | UUID / INT (FK -> teaching_assignments.id) | Relasi ke penugasan |
| student_id | UUID / INT (FK -> students.id) | Relasi ke siswa |
| score | DECIMAL(5,2) | Skor penilaian formatif |
| max_score | DECIMAL(5,2) | Skor maksimal |
| feedback | TEXT | Umpan balik guru ke siswa |
| assessment_date | DATE | Tanggal penilaian |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu pembaruan |
| deleted_at | TIMESTAMP | Waktu penghapusan lunak (nullable) |

---

## 5. Struktur Penilaian Sumatif

Penilaian sumatif dilakukan per Lingkup Materi pada akhir fase/fase pembelajaran atau di akhir semester. Contoh: UTS, UAS, Penilaian Proyek, Portofolio.

### Aturan Penilaian Sumatif

- Penilaian sumatif dilakukan per LM (bukan per TP).
- Nilai sumatif ditetapkan per siswa per LM.
- Nilai sumatif berkontribusi langsung ke nilai akhir mata pelajaran.
- Bobot LM menentukan kontribusi terhadap nilai akhir.
- Setiap komponen grading_component dikaitkan dengan LM.

### Hubungan Antar Entitas Penilaian Sumatif

```
teaching_assignment → lm (Lingkup Materi)
lm → grading_components (dengan bobot per komponen)
grading_components → grades (nilai per siswa)
grades → students (relasi siswa)
```

---

## 6. Struktur Leger Nilai

Leger nilai menampilkan seluruh penilaian siswa (formatif dan sumatif) per mata pelajaran dalam satu tampilan terstruktur.

### Tampilan Leger Per Siswa

| TP | Lingkup Materi | Komponen Penilaian | Skor | Bobot | Nilai Tertimbang |
|---|---|---|---|---|---|
| TP1 | LM1 | Harian | 85 | 30% | 25.50 |
| TP1 | LM1 | UTS | 80 | 20% | 16.00 |
| TP2 | LM2 | Harian | 90 | 30% | 27.00 |
| TP2 | LM2 | UAS | 75 | 50% | 37.50 |
| | | **Total** | | **100%** | **106.00** |

### Struktur Data Leger (query view)

Leger tidak requires tabel terpisah. Leger adalah query view yang menggabungkan data dari:
- `teaching_assignments`
- `learningobjectives`
- `curriculum_modules` (LM)
- `grading_components`
- `grades`
- `students`

Query mengelompokkan berdasarkan TP dan LM, menghitung nilai tertimbang per komponen.

---

## 7. Struktur Nilai Akhir Mata Pelajaran

Nilai akhir dihitung berdasarkan kontribusi bobot dari setiap komponen penilaian dalam grading_components. Rumus:

```
Nilai Akhir = (sumatif komponen nilai × bobot komponen) / total bobot
```

Atau dengan memperlakukan TP dan LM sebagai kategori terpisah jika struktur sekolah menggunakan pendekatan TP-based dan LM-based yang berbeda.

### Contoh Perhitungan Nilai Akhir

Asumsi bobot komponen: Harian 30%, UTS 20%, UAS 50%.

| Komponen | Skor | Bobot | Kontribusi |
|---|---|---|---|
| Harian | 85 | 0.30 | 25.5 |
| UTS | 80 | 0.20 | 16.0 |
| UAS | 75 | 0.50 | 37.5 |
| **Nilai Akhir** | | **100%** | **79.0** |

### Struktur Data yang Mencukupi

Nilai akhir tidak memerlukan tabel tersendiri. Nilai akhir dihitung secara dinamis dari nilai-nilai individual di tabel grades dan bobot grading_components. Namun untuk keperluan laporan (Rapor), nilai akhir disimpan sebagai computed field atau materialized view.

---

## 8. Contoh Alur Guru Menginput Nilai

### Langkah 1: Guru membuka halaman Leger

1. Guru login.
2. Guru mengakses menu Leger Penilaian.
3. Guru memilih mata pelajaran yang diajarkan.
4. Guru memilih rombel yang ditugaskan.
5. Guru memilih semester dan tahun ajaran.

### Langkah 2: Sistem menampilkan TP dan LM yang relevan

Sistem menampilkan daftar TP dan LM berdasarkan teaching_assignment guru tersebut.

```
Mata Pelajaran: Matematika
Rombel: XI-MIA-1
Semester: Ganjil 2025/2026

TP1: Memahami konsep aljabar dasar
TP2: Menerapkan persamaan linear
TP3: Menganalisis fungsi kuadrat

LM1: Aljabar Dasar (TP1, TP2)
LM2: Fungsi dan Grafik (TP3)
```

### Langkah 3: Guru menginput nilai formatif per TP

Guru masuk ke panel Penilaian Formatif, memilih TP tertentu, dan menginput skor per siswa disertai umpan balik.

```
TP1: Memahami konsep aljabar dasar
├── Ani: Nilai 85, Catatan: "Bagus, pemahaman konsep kuat"
├── Budi: Nilai 70, Catatan: "Perlu latihan tambahan"
└ ... dst.
```

### Langkah 4: Guru menginput nilai sumatif per LM

Guru masuk ke panel Penilaian Sumatif, memilih LM tertentu, menginput komponen penilaian (harian, UTS, UAS), dan memberikan skor per siswa per komponen.

```
LM1: Aljabar Dasar
├── Harian (bobot 30%):
│   ├── Ani: 85
│   └── Budi: 70
├── UTS (bobot 20%):
│   ├── Ani: 80
│   └── Budi: 75
└── UAS (bobot 50%):
    ├── Ani: 78
    └── Budi: 65
```

### Langkah 5: Sistem menghitung nilai akhir otomatis

```
Nilai Ani = (85×0.30) + (80×0.20) + (78×0.50) = 25.5 + 16.0 + 39.0 = 80.5
Nilai Budi = (70×0.30) + (75×0.20) + (65×0.50) = 21.0 + 15.0 + 32.5 = 68.5
```

### Langkah 6: Guru mempublikasikan nilai

Guru mengklik tombol Publikasikan. Siswa dan Orang Tua melihat nilai yang sudah dipublikasikan. Nilai yang belum dipublikasikan tidak terlihat oleh Siswa dan Orang Tua.

---

## 9. Contoh Rekap Nilai Siswa

| Mata Pelajaran | TP1 | LM1 | TP2 | LM2 | TP3 | Nilai Akhir | Grade |
|---|---|---|---|---|---|---|---|
| Matematika | 85 (Harian TP1) | 80 (Rekap LM1) | 90 (Harian TP2) | 75 (Rekap LM2) | 88 (Rekap TP3) | 80.5 | B |
| Bahasa Indonesia | 80 | 78 | 85 | 82 | 88 | 81.8 | B |
| PPKn | 90 | 88 | 92 | 90 | 95 | 90.6 | A |

Grade menggunakan skala:
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- E: <60

---

## 10. Relasi Data yang Dibutuhkan

```
teaching_assignments (guru mengajar ke rombel)
  ├── learningobjectives (TP per penugasan)
  │     ├── grades_formatif (formatif per TP per siswa) [opsional, dipisah agar formatif tidak masuk leger utama]
  │     └── curriculum_modules (LM yang mencakup TP ini)
  │           ├── grading_components (komponen bobot per LM)
  │           └── grades (nilai sumatif per LM per siswa)
  │                 └── computed: nilai_akhir_mata_pelajaran (view/materialized)
  └── grades_dashboard (tabel ringkasan final per siswa per mata pelajaran)

students → grades (melalui teaching_assignment dan learningobjective/curriculum_module)
```

### Tabel Baru yang Dibutuhkan (belum ada di DATABASE_SCHEMA.md)

1. **learningobjectives** — menyimpan TP per mata pelajaran per semester
2. **curriculum_modules** — menyimpan LM per mata pelajaran per semester
3. **grades_dashboard** — menyimpan nilai akhir final yang dihitung per siswa per mata pelajaran

### Tabel yang Sudah Ada dan Perlu Direvisi

1. **grading_components** — perlu penambahan FK ke learningobjectives atau curriculum_modules
2. **grades** — perlu dukungan untuk formatif dan sumatif yang terpisah
3. **lesson_plans** — tp_number_id atau learningobjective_id opsional untuk kaitan agenda mengajar dengan TP

---

## 11. Risiko Jika Model Salah Dibangun

### Risiko Utama

| Risiko | Dampak | Mitigasi |
|---|---|---|
| TP dan LM tidak dipisah | Guru tidak dapat menginput nilai formatif per TP dan nilai sumatif per LM secara terpisah; model menjadi satu dimensi dan tidak mengikuti standar Kurikulum Merdeka | Pastikan learningobjectives dan curriculum_modules adalah tabel terpisah |
| grading_components tidak terkait dengan LM | Komponen penilaian tidak memiliki cakupan (formatif per TP atau sumatif per LM); bobot tidak terstruktur | grading_components harus merujuk ke LM (curriculum_module_id) |
| Nilai formatif dan sumatif tercampur | Leger menjadi tidak rapi; perhitungan nilai akhir salah karena mencampurkan umpan balik formatif dengan skor sumatif | Pisahkan grading component type menjadi formatif vs sumatif |
| Tidak ada publikasi nilai | Siswa dan orang tua mengakses nilai yang belum final | Tambahkan status is_published pada grades |
| Tidak ada konversi grade ke huruf | Rapor tidak sesuai format Sekolah | Tambahkan konversi nilai numerik ke grade huruf (A/B/C/D/E) |
| Kompleksitas perhitungan nilai akhir tinggi untuk multi-LM | Guru bingung menginput dan siswa menerima nilai yang salah | Hitung otomatis berdasarkan bobot komponen dan LM |
| TP tidak memiliki bobot individual | TP dalam satu LM terbobot sama padahal seharusnya bisa berbeda | TP bisa memiliki bobot, dan LM mengagregasi dari bobot TP-nya |

### Risiko Implementasi Database

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Migration tambahan diperlukan untuk TP dan LM | Developer perlu merencanakan skema tambahan | Dokumentasikan dalam DATABASE_SCHEMA.md sebelum coding |
| Kombinasi FK yang kompleks pada grades | Query menjadi lambat tanpa indeks yang tepat | Pastikan composite index pada grades (student_id + teaching_assignment_id + grading_component_id) |
| Soft delete pada TP/LM merusak riwayat nilai | Nilai sebelumnya ter-hapus jika TP/LM dihapus | Terapkan soft delete pada TP/LM dan jaga FK integrity |
| Publikasi nilai tidak terkontrol | Siswa mengakses nilai belum final | Tambahkan flag is_published dan middleware yang membatasi akses |

---

## 12. Ringkasan Perubahan yang Diperlukan pada DATABASE_SCHEMA.md

1. Tambahkan tabel `learningobjectives` (TP)
2. Tambahkan tabel `curriculum_modules` (LM)
3. Tambahkan tabel `grades_dashboard` (nilai akhir final)
4. Revis `grading_components` — tambahkan FK ke `curriculum_modules` dan field `assessment_type` (formatif/sumatif)
5. Revis `grades` — tambahkan FK ke `learningobjectives` untuk formatif dan FK ke `curriculum_modules` untuk sumatif; tambahkan field `is_published`
6. Revis `lesson_plans` — opsional tambahkan FK ke `learningobjectives` untuk kaitan agenda dengan TP
7. Perbarui ERD diagram
8. Perbarui indeks

## 13. Ringkasan Perubahan yang Diperlukan pada ROUTES.md

1. Tambahkan route TP CRUD: `/api/v1/tp`
2. Tambahkan route LM CRUD: `/api/v1/curriculum-modules`
3. Tambahkan route grades formatif: `/api/v1/leger/formatif`
4. Tambahkan route grades sumatif: `/api/v1/leger/sumatif`
5. Tambahkan route publikasi nilai: `/api/v1/leger/publish`
6. Tambahkan route rekap nilai per TP: `/api/v1/leger/rekap/tp`
7. Tambahkan route rekap nilai per LM: `/api/v1/leger/rekap/lm`

## 14. Ringkasan Perubahan yang Diperlukan pada MODULES.md

1. Perbarui Modul 6 (Leger Penilaian):
   - Tambahkan struktur TP dan LM
   - Tambahkan penilaian formatif per TP
   - Tambahkan penilaian sumatif per LM
   - Tambahkan nilai akhir dan perhitungan
   - Tambahkan publikasi nilai
2. Perbarui modul terkait di ROUTES.md pada MODULES.md
3. Tambahkan komponen "TP" dan "LM" pada modul Guru dan Wali Kelas

## 15. Ringkasan Perubahan yang Diperlukan pada PRD.md

1. Tambahkan ke Lingkup MVP: dukungan TP dan LM per Kurikulum Merdeka
2. Tambahkan User Story untuk Guru input nilai per TP dan per LM
3. Tambahkan User Story untuk Wali Kelas melihat rekap nilai per TP dan per LM
4. Tambahkan User Story untuk Siswa dan Orang Tua melihat nilai TP dan LM yang telah dipublikasikan
5. Tambahkan asumsi model penilaian Kurikulum Merdeka pada "Batasan dan Asumsi"