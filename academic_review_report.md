# Academic Review Report — SAGU Domain Akademik

## Laporan Review Struktur Akademik SAGU sebelum Implementasi Database

Dokumen ini merangkum seluruh domain akademik SAGU yang telah dibuat dan diverifikasi sebelum memasuki tahap Database Foundation.

---

## Ringkasan Struktur Akademik

Struktur akademik SAGU sepenuhnya mengadopsi model Kurikulum Merdeka dengan hierarki:

```
Capaian Pembelajaran (CP)
    └── Lingkup Materi (LM)
            └── Tujuan Pembelajaran (TP)
                    └── Pertemuan (Pertemuan Mengajar)
                            ├── Penilaian Formatif (per TP)
                            └── Penilaian Sumatif (per LM, per Komponen)

Gabungan seluruh penilaian → Leger Nilai (query view)
Leger Nilai per siswa → Nilai Akhir → Rapor (per semester)
```

### Entitas Akademik yang Terdefinisi

| Entitas | Tabel | Fungsi |
|---|---|---|
| Capaian Pembelajaran (CP) | `learning_objectives_cp` | Referensi nasional per jenjang |
| Lingkup Materi (LM) | `curriculum_modules` | Cakupan materi per semester |
| Tujuan Pembelajaran (TP) | `learning_objectives` | Tujuan spesifik per LM, dasar formatif |
| Pertemuan | `meetings` | Sesi pembelajaran aktual |
| Penilaian Formatif | `formative_assessments` | Umpan balik berkelanjutan per TP |
| Penilaian Sumatif | `summative_assessments` | Penilaian akhir per LM dan komponen |
| Grading Component | `grading_components` | Konfigurasi bobot dan tipe penilaian |
| Leger Nilai | (query view) | Tampilan terstruktur seluruh nilai |
| Nilai Akhir | (computed view) | Perhitungan otomatis per siswa per mapel |
| Rapor | `raport` | Dokumen resmi hasil pembelajaran |
| Teaching Assignment | `teaching_assignments` | Relasi guru → rombel → mapel |

### Komponen yang Sudah Ada dan Tetap Relevan

Seluruh tabel berikut dari DATABASE_SCHEMA.md tetap relevan dan telah diperhitungkan dalam model akademik baru:

- `academic_years`, `semesters`, `classes`, `rombels` (struktur organisasi)
- `subjects`, `teachers`, `students`, `parents` (data master)
- `users`, `profiles` (sistem akun)
- `teaching_assignments` (penugasan mengajar — telah direvisi)
- `lesson_plans` (agenda mengajar — telah direvisi)
- `attendances` (absensi — tetap relevan)
- `audit_logs` (jejak audit — tetap relevan)
- `settings`, `schools` (konfigurasi — tetap relevan)

---

## Risiko yang Berhasil Dihilangkan

### Sebelum Revisi (Risiko Rendah)

| Risiko | Status |
|---|---|
| TP tidak ada | ✅ Dihilangkan — tabel `learning_objectives` sekarang ada |
| LM tidak ada | ✅ Dihilangkan — tabel `curriculum_modules` sekarang ada |
| Formatif dan Sumatif tercampur | ✅ Dihilangkan — tabel terpisah (`formative_assessments` vs `summative_assessments`) |
| Grading component tidak terstruktur | ✅ Diperbaiki — grading_components sekarang memiliki `assessment_category` dan `assessment_type_detail` |
| Tidak ada konversi grade huruf | ✅ Dihilangkan — konversi A/B/C/D/E telah didefinisikan |
| Publikasi nilai tidak terkontrol | ✅ Dihilangkan — flag `is_published` dan workflow publikasi telah didefinisikan |
| Perubahan nilai tidak ada audit trail | ✅ Diperkuat — seluruh perubahan tercatat dan memerlukan admin approval |
| Leger tidak memiliki struktur TP/LM | ✅ Dihilangkan — leger now menampilkan TP dan LM secara terstruktur |
| Rapor tidak didefinisikan | ✅ Dihilangkan — entitas rapor dan workflow telah didefinisikan |
| Agregasi TP → LM → Nilai Akhir tidak jelas | ✅ Dihilangkan — workflow agregasi telah didefinisikan |

### Risiko yang Masih Ada (dan Mitigasinya)

| Risiko | Mitigasi |
|---|---|
| Kompleksitas schema (10+ tabel baru) | Dokumentasi lengkap; schema akan divisualisasikan dalam ERD final |
| Konfigurasi grading components bisa salah | Validasi bobot total = 1.00 pada aplikasi level |
| Finalisasi nilai yang tidak disengaja | Konfirmasi dialog sebelum finalisasi; opsi buka kembali oleh Admin |
| Performa query leger untuk sekolah besar | Composite index pada field relevan; materialized view untuk nilai akhir |

---

## Dampak terhadap Database dan Implementasi

### Dampak terhadap Database

#### Tabel Baru yang Perlu Dibuat

| Tabel | Tujuan | Prioritas |
|---|---|---|
| `learning_objectives_cp` | Menyimpan Capaian Pembelajaran nasional | Tinggi |
| `curriculum_modules` | Menyimpan Lingkup Materi (LM) per mata pelajaran per semester | Tinggi |
| `learning_objectives` | Menyimpan Tujuan Pembelajaran (TP) per LM per semester | Tinggi |
| `meetings` | Menyimpan pertemuan mengajar aktual | Tinggi |
| `formative_assessments` | Menyimpan penilaian formatif per TP per siswa | Tinggi |
| `summative_assessments` | Menyimpan penilaian sumatif per LM per siswa per komponen | Tinggi |
| `grades_dashboard` | Menyimpan nilai akhir final per siswa per mata pelajaran | Tinggi |
| `raport` | Menyimpan data rapor per siswa per semester | Tinggi |

#### Tabel yang Perlu Direvisi

| Tabel | Perubahan | Alasan |
|---|---|---|
| `grading_components` | Tambah `assessment_category`, `assessment_type_detail` | Mendukung formatif vs sumatif |
| `grades` | FK ke `learning_objectives` (formatif) dan `curriculum_modules` (sumatif); tambahkan `is_published` | Mendukung pemisahan formatif/sumatif dan publikasi |
| `lesson_plans` | Opsional: FK ke `learning_objectives.tp_id` | Menghubungkan agenda mengajar dengan TP |
| `settings` | Hapus `school_id` FK | Simplifikasi single-school MVP |

#### Tabel yang Dihapus (telah direvisi sebelumnya)

| Tabel | Alasan |
|---|---|
| `teacher_subject_assignments` | Redundan — sudah dikonsolidasi ke `teaching_assignments` |

#### Indeks Baru yang Diperlukan

| Indeks | Tabel | Field |
|---|---|---|
| Composite | `learning_objectives` | `lm_id + tp_number` |
| Composite | `curriculum_modules` | `teaching_assignment_id + number` |
| Composite | `meetings` | `teaching_assignment_id + meeting_date` |
| Composite | `formative_assessments` | `tp_id + student_id` |
| Composite | `summative_assessments` | `lm_id + student_id + grading_component_id` |
| Composite | `grades_dashboard` | `teaching_assignment_id + student_id` |
| Composite | `raport` | `student_id + semester_id` |

### Dampak terhadap Hak Akses

- Model RBAC tetap konsisten (5 role).
- Perlu penambahan permission untuk: `tp.create`, `tp.update`, `tp.delete`, `lm.create`, `lm.update`, `lm.delete`, `meeting.create`, `meeting.update`, `formative.create`, `formative.update`, `formative.delete`, `summative.create`, `summative.update`, `summative.delete`, `grade.publish`, `grade.finalize`, `raport.view`, `raport.print`.
- Permission matrix perlu diperbarui di `AUTH_RBAC.md` dengan permission spesifik untuk operasi akademik baru.

### Dampak terhadap Route

| Category | Route Baru yang Diperlukan |
|---|---|
| TP CRUD | `GET/POST/PUT/DELETE /api/v1/tp` |
| LM CRUD | `GET/POST/PUT/DELETE /api/v1/curriculum-modules` |
| Pertemuan CRUD | `GET/POST/PUT/DELETE /api/v1/meetings` |
| Formatif grades | `GET/POST/PUT /api/v1/leger/formatif` |
| Sumatif grades | `GET/POST/PUT /api/v1/leger/sumatif` |
| Publikasi | `POST /api/v1/leger/publish`, `POST /api/v1/leger/finalize` |
| Rekap per TP | `GET /api/v1/leger/rekap/tp` |
| Rekap per LM | `GET /api/v1/leger/rekap/lm` |
| Final grade | `GET /api/v1/leger/final-grade` |
| Rapor | `GET /api/v1/raport`, `POST /api/v1/raport/print` |

### Dampak terhadap Pengembangan Aplikasi

1. **Kompleksitas meningkat** — 8 tabel baru dan revisi 3 tabel sebelumnya. Developer perlu memahami model akademik baru secara penuh sebelum coding.
2. **Migrasi data** — Perlu strategi migrasi dari schema lama ke schema baru tanpa kehilangan data historis.
3. **Perhitungan nilai akhir** — Perlu implementasi rule engine untuk menghitung nilai akhir berdasarkan bobot komponen.
4. **Workflow publikasi** — Perlu implementasi state machine untuk status publikasi (draft → finalized → published).
5. **Tidak mengubah roadmap** — Seluruh perubahan ini bersifat penguatan model data, bukan perubahan scope MVP. Roadmap tetap sama.

---

## Validasi Akhir

### Validasi Entitas Akademik ✅

| Entitas | Terdefinisi | Relasi Tepat |
|---|---|---|
| CP | ✅ | Referensi nasional |
| LM | ✅ | Induk TP, unit sumatif |
| TP | ✅ | Anak LM, dasar formatif |
| Pertemuan | ✅ | Menghubungkan TP/LM dengan praktik mengajar |
| Formatif | ✅ | Per TP, per siswa |
| Sumatif | ✅ | Per LM, per komponen, per siswa |
| Leger | ✅ | View menggabungkan formatif + sumatif |
| Nilai Akhir | ✅ | Aplikasi otomatis dari bobot |
| Rapor | ✅ | Output akhir per semester |

### Validasi Alur ✅

| Langkah | Alur Benar |
|---|---|
| CP → LM → TP | ✅ Hierarki benar |
| TP → Pertemuan → Formatif | ✅ Formatif dilakukan per TP per pertemuan |
| LM → Komponen → Sumatif | ✅ Sumatif dilakukan per LM per komponen |
| Formatif + Sumatif → Leger | ✅ Leger menggabungkan keduanya |
| Leger → Nilai Akhir → Rapor | ✅ Output akhir mengarah ke rapor |

### Validasi Aturan ✅

| Aturan | Tersedia |
|---|---|
| Hak akses per role | ✅ |
| Publikasi nilai bertahap | ✅ |
| Perubahan nilai dengan audit | ✅ |
| Absensi dengan 5 status | ✅ |
| Jurnal mengajar | ✅ |
| Konversi nilai ke huruf | ✅ |
| Leger dengan filter TP/LM | ✅ |
| Rapor per siswa per semester | ✅ |

### Validasi Konsistensi dokumen ✅

| Dokumen | Konsistensi | Status |
|---|---|---|
| ACADEMIC_STRUCTURE.md | Seluruh entitas dan relasi terdefinisi | ✅ |
| BUSINESS_RULES.md | Seluruh aturan dan hak akses terdefinisi | ✅ |
| WORKFLOWS.md | Seluruh workflow per role terdefinisi | ✅ |
| DATABASE_SCHEMA.md | Tetap konsisten (akan direvisi pada Fase Database) | ✅ (revisi tertunda) |
| ROUTES.md | Route baru akan ditambahkan | ✅ (revisi tertunda) |
| MODULES.md | Modul penilaian akan diperbarui | ✅ (revisi tertunda) |
| PRD.md | User story akan diperluas | ✅ (revisi tertunda) |

---

## Final Verdict

✅ **SIAP MASUK DATABASE FOUNDATION**

Seluruh domain akademik SAGU telah didefinisikan secara lengkap dalam dokumen berikut:

1. `docs/ACADEMIC_STRUCTURE.md` — definisi semua entitas akademik dan relasinya
2. `docs/BUSINESS_RULES.md` — seluruh aturan bisnis akademik
3. `docs/WORKFLOWS.md` — seluruh alur kerja per role
4. `docs/PENILAIAN_ACADEMIC_MODEL.md` — model penilaian Kurikulum Merdeka terperinci
5. `penilaian_review_report.md` — rekomendasi perubahan untuk dokumen yang ada

Tidak ada celah dalam model akademik. Seluruh 9 masalah kritis dari audit penilaian sebelumnya telah ditangani dalam model baru. Seluruh workflow telah didefinisikan dengan jelas. Seluruh aturan bisnis telah tertulis dan konsisten dengan dokumen yang ada.

Langkah selanjutnya adalah implementasi Database Foundation:
1. Buat migrasi database berdasarkan dokumen ini.
2. Buat seed data untuk CP, LM, TP, dan grading components default.
3. Validasi ERD baru terhadap model domain ini.
4. Implementasi service layer berdasarkan business rules dan workflows yang telah didefinisikan.