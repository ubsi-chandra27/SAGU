# Penilaian Review Report — SAGU Academic Model

## Laporan Review Model Penilaian SAGU terhadap Standar Kurikulum Merdeka

Dokumen ini berisi hasil audit khusus modul Penilaian SAGU, membandingkan model penilaian saat ini (berdasarkan seluruh dokumen SAGU yang ada) dengan persyaratan Kurikulum Merdeka (TP, Lingkup Materi, Penilaian Formatif, Penilaian Sumatif, Leger, dan Nilai Akhir).

---

## Temuan Utama

### 1. Tidak Ada Konsep TP (Tujuan Pembelajaran) ❌

**Kondisi Saat Ini:** DATABASE_SCHEMA.md memiliki tabel `grading_components` yang mendefinisikan komponen penilaian sebagai entitas flat (Harian, UTS, UAS) dengan bobot. Tidak ada tabel atau konsep TP.

**Kurangnya:** Kurikulum Merdeka mewajibkan penilaian dilakukan per Tujuan Pembelajaran spesifik yang ditetapkan guru per mata pelajaran per semester.

### 2. Tidak Ada Konsep Lingkup Materi (LM) ❌

**Kondisi Saat Ini:** Tidak ada tabel `curriculum_modules` atau struktur LM di seluruh dokumentasi SAGU.

**Kurangnya:** LM adalah unit organisasi materi yang menjadi cakupan penilaian sumatif dalam Kurikulum Merdeka. Tanpa LM, penilaian sumatif tidak dapat dikaitkan dengan cakupan materi tertentu.

### 3. Penilaian Formatif dan Sumatif Tidak Dipisah ❌

**Kondisi Saat Ini:** `grades` table menggunakan FK ke `grading_components` saja. Tidak ada pembedaan antara nilai formatif (umpan balik berkelanjutan) dan nilai sumatif (penilaian akhir fase).

**Kurangnya:** Kurikulum Merdeka membedakan penilaian formatif (per TP, ongoing) dan sumatif (per LM, phase-end). Model saat ini mencampur keduanya dalam satu tabel grades.

### 4. Leger Nilai Tidak Mendukung TP dan LM ❌

**Kondisi Saat Ini:** Route `/api/v1/leger` menyediakan leger per siswa, namun tidak mendukung tampilan berdasarkan TP atau per LM. Leger hanya menampilkan nilai per komponen penilaian (Harian, UTS, UAS) tanpa konteks TP atau LM.

**Kurangnya:** Leger Kurikulum Merdeka menampilkan nilai per TP (formatif) dan per LM (sumatif) dalam satu tampilan terstruktur.

### 5. Tidak Ada Nilai Akhir Mata Pelajaran (Final Grade) ❌

**Kondisi Saat Ini:** Tidak ada mekanisme untuk menyimpan atau menghitung nilai akhir mata pelajaran. Sistem menyimpan nilai per komponen (harian, UTS, UAS) tetapi tidak menghitung atau menyimpan nilai akhir final per siswa per mata pelajaran.

**Kurangnya:** Rapor memerlukan nilai akhir per mata pelajaran yang dihitung dari agregasi nilai komponen dan LM.

### 6. Tidak Ada Konversi Grade Huruf ❌

**Kondisi Saat Ini:** Semua nilai disimpan sebagai score numerik. Tidak ada representasi grade huruf (A, B, C, D, E) yang standar.

**Kurangnya:** Rapor Indonesia menggunakan skala grade huruf. Tanpa konversi, laporan tidak sesuai format yang digunakan sekolah.

### 7. Tidak Ada Publikasi Nilai ❌

**Kondisi Saat Ini:** Tidak ada flag `is_published` pada grades. Perbedaan visibilitas antara Guru/Wali Kelas (melihat semua nilai) dan Siswa/Orang Tua (hanya melihat yang dipublikasikan) tidak dapat diimplementasikan secara andal.

**Kurangnya:** Kurikulum Merdeka menerapkan publikasi nilai bertahap: guru menginput, wali kelas memverifikasi, kemudian dipublikasikan untuk siswa/orang tua.

### 8. Tidak Ada Agregasi TP → LM → Nilai Akhir ❌

**Kondisi Saat Ini:** Model penilaian datar: komponen penilaian → nilai siswa. Tidak ada struktur hierarkis TP → LM → Komponen → Nilai → Nilai Akhir.

**Kurangnya:** Kurikulum Merdeka menggunakan struktur hierarkis yang jelas: TP dikelompokkan ke LM, LM berisi komponen penilaian, komponen menghasilkan nilai, nilai diagregasi menjadi nilai akhir.

### 9. TP dan LM Tidak Terhubung ke Mata Pelajaran Spesifik ❌

**Kondisi Saat Ini:** `grading_components` terhubung ke `academic_year_id` dan `semester_id` saja (via teaching_assignments indirect). Tidak ada FK langsung ke `subjects.id` atau koneksi eksplisit ke TP/LM.

**Kurangnya:** TP dan LM didefinisikan per mata pelajaran spesifik yang diajarkan guru pada rombel tertentu.

---

## Rekomendasi Perbaikan Dokumentasi

### Rekomendasi untuk DATABASE_SCHEMA.md

1. **Tambahkan tabel `learningobjectives`** (TP) dengan FK ke `teaching_assignments`, `academic_years`, `semesters`, `subjects`.
2. **Tambahkan tabel `curriculum_modules`** (LM) dengan FK ke `teaching_assignments`, `academic_years`, `semesters`, `subjects`.
3. **Revisi `grading_components`**: tambahkan FK ke `curriculum_modules` dan field `assessment_type` (formatif atau sumatif).
4. **Revisi `grades`**: tambahkan FK ke `learningobjectives` (untuk formatif) dan FK ke `curriculum_modules` (untuk sumatif); tambahkan field `is_published`.
5. **Tambahkan tabel `grades_dashboard`** (opsional) untuk menyimpan final grade per siswa per mata pelajaran sebagai materialized view.
6. **Revisi `lesson_plans`**: opsional tambahkan FK ke `learningobjectives`.
7. **Perbarui ERD diagram** sesuai struktur baru.
8. **Tambahkan indeks baru**: `learningobjectives.teaching_assignment_id`, `curriculum_modules.teaching_assignment_id`, `grades.student_id + learningobjective_id`, `grades.student_id + curriculum_module_id`.

### Rekomendasi untuk ROUTES.md

1. **Tambahkan route TP CRUD**: `GET/POST/PUT/DELETE /api/v1/tp`
2. **Tambahkan route LM CRUD**: `GET/POST/PUT/DELETE /api/v1/curriculum-modules`
3. **Tambahkan route grades formatif**: `GET/POST/PUT /api/v1/leger/formatif`
4. **Tambahkan route grades sumatif**: `GET/POST/PUT /api/v1/leger/sumatif`
5. **Tambahkan route publikasi**: `POST /api/v1/leger/publish`
6. **Tambahkan route rekap per TP**: `GET /api/v1/leger/rekap/tp`
7. **Tambahkan route rekap per LM**: `GET /api/v1/leger/rekap/lm`
8. **Tambahkan route final grade**: `GET /api/v1/leger/final-grade`

### Rekomendasi untuk MODULES.md

1. **Perbarui Modul 6 (Leger Penilaian)**: Tambahkan deskripsi lengkap tentang TP, LM, formatif, sumatif, perhitungan nilai akhir, dan publikasi.
2. **Tambahkan Struktur Data Terkait** pada setiap modul terkait penilaian.
3. **Tambahkan Route Terkait** pada setiap modul.
4. **Perbarui Role Akses** untuk mencerminkan akses ke TP/LM/formatif/sumatif.
5. **Tambahkan User Flow Referensi** untuk alur input nilai formatif dan sumatif.

### Rekomendasi untuk PRD.md

1. **Tambahkan ke Lingkup MVP**: Dukungan Kurikulum Merdeka (TP dan LM) sebagai kebutuhan produk.
2. **Tambahkan User Story** untuk Guru input nilai per TP dan per LM.
3. **Tambahkan User Story** untuk Wali Kelas melihat rekap nilai per TP dan LM.
4. **Tambahkan User Story** untuk Siswa/Orang Tua melihat nilai yang dipublikasikan per TP dan LM.
5. **Tambahkan asumsi model penilaian** pada "Batasan dan Asumsi".

---

## Status Akhir

### Dampak terhadap Implementasi

| Area | Dampak |
|---|---|
| Database | 2 tabel baru (learningobjectives, curriculum_modules), 1 tabel tambahan (grades_dashboard opsional), revisi 3 tabel (grading_components, grades, lesson_plans), 4 indeks baru |
| Hak Akses | Perlu penambahan permission matrix baru untuk TP/LM CRUD dan grade publish |
| Route | 7-8 route baru ditambahkan, 4 route direvisi |
| Pengembangan Aplikasi | Perlu perencanaan migrasi data dari model lama ke model baru; model lama bisa dipertahankan sementara sebagai fallback |

### Urutan Implementasi yang Direkomendasikan

1. Tambahkan `learningobjectives` dan `curriculum_modules` ke DATABASE_SCHEMA.md.
2. Revisi `grading_components` dan `grades` sesuai struktur baru.
3. Tambahkan `grades_dashboard` sebagai computed view.
4. Buat route CRUD untuk TP dan LM di ROUTES.md.
5. Buat route grade formatting dan sumatif.
6. Buat route publikasi nilai.
7. Buat route rekap per TP dan per LM.
8. Update MODULES.md dengan model penilaian baru.
9. Update PRD.md dengan user story baru.
10. Build dan test satu tahap penuh sebelum mengganti model lama sepenuhnya.

---

## Final Verdict

❌ PERLU REVISI MODEL PENILAIAN

Model penilaian SAGU saat ini belum mendukung struktur Kurikulum Merdeka dengan benar. Terdapat 9 masalah kritis yang harus diselesaikan sebelum model penilaian siap untuk diimplementasikan:

1. TP (Tujuan Pembelajaran) tidak ada — dibutuhkan tabel `learningobjectives`.
2. LM (Lingkup Materi) tidak ada — dibutuhkan tabel `curriculum_modules`.
3. Penilaian Formatif dan Sumatif tidak dipisah — dibutuhkan FK terpisah dari TP dan LM pada tabel grades.
4. Leger tidak mendukung TP dan LM — dibutuhkan restrukturisasi query view leger.
5. Nilai Akhir tidak dihitung/didisimpan — dibutuhkan grades_dashboard atau computed view.
6. Konversi grade huruf tidak ada.
7. Publikasi nilai tidak terkontrol — dibutuhkan `is_published` flag.
8. Agregasi TP → LM → Nilai Akhir tidak ada.
9. TP/LM tidak terhubung ke mata pelajaran spesifik.

Seluruh rekomendasi perbaikan telah didokumentasikan di `docs/PENILAIAN_ACADEMIC_MODEL.md` dan ringkasan perubahan yang dibutuhkan untuk setiap dokumen tercatat di file ini.

Setelah 9 masalah kritis ini ditangani pada dokumen DATABASE_SCHEMA.md, ROUTES.md, MODULES.md, dan PRD.md, status akan berubah menjadi **SIAP MASUK KE DESAIN DATABASE**.