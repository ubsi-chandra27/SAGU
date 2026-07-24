# Pre-Auth Audit Report — SAGU

## 1. Ringkasan Audit

Audit konsistensi dokumentasi SAGU dilakukan terhadap 8 dokumen utama setelah revisi database foundation. Audit memeriksa:
- Referensi tabel yang sudah dihapus (`lesson_plans`)
- Konsistensi `grades_dashboard` sebagai Materialized Grade Record
- Kesesuaian route-modul-role
- Kontradiksi antar dokumen
- Field database yang tidak memiliki tujuan bisnis

**Dokumen yang diaudit:**
- `docs/DATABASE_SCHEMA.md`
- `docs/ACADEMIC_STRUCTURE.md`
- `docs/BUSINESS_RULES.md`
- `docs/WORKFLOWS.md`
- `docs/MODULES.md`
- `docs/ROUTES.md`
- `docs/API_SPEC.md`
- `docs/AUTH_RBAC.md`
- `prisma/schema.prisma` (referensi aktual)

---

## 2. Temuan

### Temuan 1: `ACADEMIC_STRUCTURE.md` Masih Mereferensikan `lesson_plan`

**Lokasi:** Baris 142  
**Konteks:** Bagian "Relasi Pertemuan"  
**Teks:** "1 pertemuan terhubung ke 1 lesson_plan (agenda mengajar)."

**Masalah:** Setelah migrasi ke `teaching_journals`, referensi `lesson_plan` seharusnya diganti `teaching_journal`.  
**Dampak:** Kontradiksi dengan `prisma/schema.prisma` dan `docs/DATABASE_SCHEMA.md` yang sudah menggunakan `teaching_journals`.

---

### Temuan 2: `DATABASE_SCHEMA.md` Tidak Sesuai dengan `prisma/schema.prisma` (CRITICAL)

**Lokasi:** Seluruh dokumen  
**Konteks:** Tabel dan ERD yang terdokumentasi

**Masalah:** `DATABASE_SCHEMA.md` mendokumentasikan schema lama yang tidak sesuai dengan `prisma/schema.prisma` aktual.

**Tabel yang ADA di schema.prisma TAPI TIDAK didokumentasikan di DATABASE_SCHEMA.md:**
- `formative_assessments` (Penilaian Formatif)
- `summative_assessments` (Penilaian Sumatif)
- `grades_dashboard` (Materialized Grade Record)
- `meetings` (Pertemuan)
- `curriculum_modules` (LM)
- `learning_objectives` (TP)
- `learning_objectives_cp` (CP)
- `raports` (Rapor)

**Tabel yang didokumentasikan di DATABASE_SCHEMA.md TAPI TIDAK ada di schema.prisma:**
- `grades` (Nilai) — tabel ini sudah diganti `formative_assessments` dan `summative_assessments`

**Dampak:** Dokumentasi database tidak dapat dipercaya. Developer yang membaca `DATABASE_SCHEMA.md` akan mendapatkan gambaran yang salah tentang struktur database aktual.

---

### Temuan 3: ERD di `DATABASE_SCHEMA.md` Masih Mereferensikan Tabel yang Tidak Ada

**Lokasi:** Bagian "Diagram ERD Konseptual"  
**Konteks:** Relasi tabel

**Masalah:** ERD diagram masih mereferensikan:
- `grades` (tidak ada di schema.prisma)
- Tidak ada `grades_dashboard`, `formative_assessments`, `summative_assessments`, `meetings`, `curriculum_modules`, `learning_objectives`, `learning_objectives_cp`, `raports`

**Dampak:** Diagram ERD tidak mencerminkan struktur database aktual.

---

### Temuan 4: `MODULES.md` Mereferensikan Tabel yang Tidak Ada

**Lokasi:** Baris 23  
**Konteks:** "Struktur Data Terkait" untuk Modul Dashboard  
**Teks:** "`users`, `teachers`, `students`, `rombels`, `attendances`, `grades` (read-only akses terbatas)."

**Masalah:** Tabel `grades` tidak ada di schema.prisma. Seharusnya merujuk ke tabel yang relevan seperti `grades_dashboard`, `formative_assessments`, atau `summative_assessments`.

**Dampak:** Developer mungkin akan mencari tabel `grades` yang tidak ada.

---

### Temuan 5: `grades_dashboard` Tidak Didokumentasikan di `DATABASE_SCHEMA.md`

**Lokasi:** Seluruh dokumen  
**Konteks:** Tabel Materialized Grade Record

**Masalah:** `grades_dashboard` adalah tabel penting yang menyimpan nilai akhir siswa, tetapi tidak ada di `DATABASE_SCHEMA.md`. Padahal `docs/ACADEMIC_STRUCTURE.md` sudah mendokumentasikan sebagai "Materialized Grade Record".

**Dampak:** Inkonsistensi antara `ACADEMIC_STRUCTURE.md` dan `DATABASE_SCHEMA.md`.

---

### Temuan 6: `DATABASE_SCHEMA.md` Indeks yang Disarankan Tidak Sesuai

**Lokasi:** Bagian "Indeks yang Disarankan"  
**Konteks:** Daftar indeks komposit

**Masalah:** Indeks yang tercantum sebagian besar untuk tabel `grades` (yang tidak ada) dan `lesson_plans` (yang sudah diganti). Indeks untuk tabel baru seperti `formative_assessments`, `summative_assessments`, `grades_dashboard`, `teaching_journals`, `meetings`, `curriculum_modules`, `learning_objectives` tidak tercantum.

**Dampak:** Rekomendasi indeks untuk query optimization tidak akurat.

---

## 3. Perbaikan yang Direkomendasikan

### Prioritas TINGGI (Wajib sebelum Auth Foundation)

| No | Dokumen | Perbaikan |
|---|---|---|
| 1 | `docs/DATABASE_SCHEMA.md` | Revisi total: tambahkan 8 tabel yang kurang (`formative_assessments`, `summative_assessments`, `grades_dashboard`, `meetings`, `curriculum_modules`, `learning_objectives`, `learning_objectives_cp`, `raports`), hapus section `grades` lama, update ERD diagram, update indeks |
| 2 | `docs/ACADEMIC_STRUCTURE.md` | Baris 142: ganti "lesson_plan" menjadi "teaching_journal" |

### Prioritas MEDIUM

| No | Dokumen | Perbaikan |
|---|---|---|
| 3 | `docs/MODULES.md` | Baris 23: ganti `grades` menjadi referensi tabel yang benar |
| 4 | `docs/DATABASE_SCHEMA.md` | Tambahkan dokumentasi `grades_dashboard` sebagai Materialized Grade Record |

### Prioritas RENDAH

| No | Dokumen | Perbaikan |
|---|---|---|
| 5 | Semua dokumen | Pastikan semua referensi tabel menggunakan nama yang konsisten dengan `prisma/schema.prisma` |

---

## 4. Status Akhir

### PERLU REVISI

Terdapat ketidaksesuaian kritis antara dokumentasi dan implementasi database aktual. `DATABASE_SCHEMA.md` mendokumentasikan schema lama yang tidak sesuai dengan `prisma/schema.prisma`. `ACADEMIC_STRUCTURE.md` masih memiliki referensi `lesson_plan` yang seharusnya sudah diganti `teaching_journal`.

**Dampak ke Auth Foundation:** Auth Foundation tidak dapat dimulai dengan aman jika dokumentasi database tidak konsisten, karena Auth Foundation bergantung pada pemahaman yang benar tentang struktur tabel `users`, `profiles`, dan relasinya.

**Rekomendasi:** Lakukan perbaikan Prioritas TINGGI terlebih dahulu sebelum masuk ke Auth Foundation.
