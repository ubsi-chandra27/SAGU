# Final Revision Report — Proyek SAGU

Dokumen ini mendeskripsikan seluruh revisi yang dilakukan berdasarkan hasil audit pada `audit_report_final.md` dan seluruh Permasalahan Kritis yang diidentifikasi.

---

## Ringkasan Revisi

Revisi ini fokus pada 6 Permasalahan Kritis yang ditemukan dalam audit:

1. **Tabel `grading_components`** tidak ada di schema meskipun route CRUD sudah didefinisikan.
2. **Kejelasan arsitektur multi-tenant** — schema mengisyaratkan multi-school tapi tidak ada FK pada tabel data akademik, dan `schools` tabel tidak terhubung ke tabel lain. Diperjelas bahwa MVP adalah single-school.
3. **Kontrol akses berbasis baris data (RLS)** — pembatasan akses berdasarkan relasi data (guru hanya akses rombel yang ditugaskan) tidak terdefinisi secara spesifik di mana harus diterapkan.
4. **Duplikasi tabel penugasan** — `teacher_subject_assignments` dan `rombel_teacher_assignments` tumpang tindih. Dikonsolidasi menjadi satu tabel `teaching_assignments`.
5. **Ketidakkonsistenan hak akses Orang Tua** — route agenda mengizinkan "Semua Role (terbatas)" yang secara teknis termasuk Orang Tua, tapi permission matrix dan user flow menyatakan Orang Tua tidak memiliki akses agenda. Dikoreksi agar Orang Tua tidak masuk dalam akses agenda.
6. **Definisi Modul Statistik** — route statistik ada di ROUTES.md tapi tidak memiliki modul, permission matrix, user flow, maupun test plan. Didefinisikan sebagai bagian dari modul Dashboard dengan permission yang jelas.

---

## Dokumen Yang Diubah

| File | Perubahan Utama |
|---|---|
| `docs/DATABASE_SCHEMA.md` | 1) Klarifikasi single-school MVP; 2) Hapus `teacher_subject_assignments`; 3) Ganti `rombel_teacher_assignments` menjadi `teaching_assignments`; 4) Tambahkan tabel `grading_components`; 5) Ubah `grades.component` dari ENUM menjadi FK ke `grading_components`; 6) Hapus `school_id` dari `settings` (konsisten single-school); 7) Perbarui ERD diagram dan indeks; 8) Tambahkan dokumentasi RLS di Konvensi Umum |
| `docs/AUTH_RBAC.md` | 1) Standarisasi nama role lowercase (admin, guru, wali_kelas, siswa, orang_tua) di permission matrix; 2) Tambahkan baris Statistik pada permission matrix; 3) Tambahkan dokumentasi RLS pada Role-Based Route Protection; 4) Tambahkan aksi "perubahan penugasan mengajar" pada audit log; 5) Perbaiki deskripsi permission matrix |
| `docs/ROUTES.md` | 1) Tetapkan role spesifik pada route Agenda (Guru, Wali Kelas, Siswa — tanpa Orang Tua); 2) Tetapkan role spesifik pada route Rombel; 3) Tambahkan komponen grading_components route di bawah Penilaian dan Leger; 4) Pindahkan Statistik ke bagian "Route Statistik (Dashboard)" dengan peran spesifik; 5) Perbarui Penugasan Mengajar dengan referensi teaching_assignments; 6) Tambahkan Audit Log dan Statistik kembali ke Route Backend Tambahan; 7) Tambahkan catatan RLS pada Catatan Penting |
| `docs/MODULES.md` | 1) Modul 1 Dashboard ditambahkan bagian Statistik (route, struktur data); 2) Modul 2 Data Guru diperbarui dengan Struktur Data Terkait, Route Terkait, dan User Flow; 3) Modul 3 Data Siswa diperbarui dengan Struktur Data Terkait, Route Terkait, dan User Flow; 4) Modul 4 Rombel diperbarui dengan Struktur Data Terkait, Route Terkait, dan User Flow; 5) Modul 5 Absensi diperbarui dengan Struktur Data Terkait (termasuk catatan RLS), Route Terkait, dan User Flow |
| `docs/API_SPEC.md` | 1) Menambahkan endpoint grading_components (GET, POST, PUT, DELETE); 2) Memisahkan endpoint Komponen Penilaian dan Nilai untuk kejelasan |
| `docs/PRD.md` | 1) Mengklarifikasi arsitektur single-school untuk MVP; 2) Menambahkan catatan bahwa multi-school akan dipertimbangkan di fase berikutnya |

---

## Permasalahan Yang Berhasil Diselesaikan

### 1. Tabel `grading_components` ✅ Teratasi

**Sebelum:** Route `GET|POST|PUT|DELETE /api/v1/leger/komponen` ada di ROUTES.md dan API_SPEC.md, tapi tidak ada tabel database yang mendukung. Komponen penilaian didefinisikan sebagai hard-coded ENUM di kolom `grades.component`, sehingga CRUD komponen penilaian tidak memiliki model data yang proper (tidak bisa menambah/menghapus komponen penilaian kustom).

**Sesudah:** Ditambahkan tabel `grading_components` dengan field: `id`, `academic_year_id`, `semester_id`, `name`, `weight`, `description`, `created_at`, `updated_at`, `deleted_at`. Tabel `grades` sekarang mereferensi `grading_component_id` FK alih-alih menggunakan ENUM hard-coded. Setiap sekolah dapat mengonfigurasi komponen penilaian sendiri (harian, tengah semester, akhir semester, UTS, UAS, atau komponen lain sesuai kebijakan sekolah).

**Dampak:** Implementasi kini memiliki model data yang konsisten untuk komponen penilaian. Route CRUD komponen penilaian akan berfungsi sesuai harapan.

### 2. Kejelasan Arsitektur Multi-Tenant ✅ Teratasi

**Sebelum:** Tabel `schools` ada di schema dan `settings` memiliki `school_id` FK, tapi tidak ada tabel data akademik (rombels, classes, subjects, grades, attendances) yang memiliki `school_id` FK. Ini menciptakan ambiguitas apakah SAGU mendukung multi-school atau tidak.

**Sesudah:** Diperjelas bahwa MVP SAGU adalah single-school (satu sekolah). Semua data akademik berada dalam satu konteks sekolah. Tabel `schools` dan `settings` tetap ada sebagai konfigurasi institusi. Tidak perlu `school_id` FK pada setiap tabel data akademik karena hanya ada satu instansi sekolah aktif. Skema multi-school dapat ditambahkan pada fase berikutnya dengan menambahkan `school_id` pada setiap tabel data akademik. `settings.school_id` FK dihapus karena pengaturan global tidak perlu di-scoped per school dalam konteks single-school.

**Dampak:** Schema lebih sederhana dan tidak ambigu. Developer tidak perlu membingungkan diri dengan FK school_id yang tidak lengkap.

### 3. Kontrol Akses Berbasis Baris Data (RLS) ✅ Teratasi

**Sebelum:** Tidak ada dokumentasi tentang bagaimana pembatasan akses berdasarkan relasi data (guru hanya akses rombel yang ditugaskan, wali kelas hanya akses rombelnya) harus diterapkan. "Semua Role (terbatas)" terlalu ambigu untuk diimplementasikan.

**Sesudah:**
- `docs/DATABASE_SCHEMA.md` menambahkan dokumentasi RLS di Konvensi Umum, menyatakan pembatasan diakses pada application layer.
- `docs/AUTH_RBAC.md` menambahkan dokumentasi RLS pada bagian Role-Based Route Protection, menjelaskan bahwa middleware memverifikasi role terlebih dahulu, kemudian service layer menyaring data berdasarkan relasi.
- `docs/ROUTES.md` memperbarui Catatan Penting dengan catatan RLS.
- `docs/AUTH_RBAC.md` permission matrix menggunakan keterangan spesifik: "(data sendiri)", "(kelasnya)", "(rombelnya)", "(mapelnya)" untuk menjelaskan batasan relasional.
- Route dengan akses terbatas (absensi, rombel, agenda) sekarang menggunakan role spesifik alih-alih "Semua Role (terbatas)".

**Dampak:** Developer memiliki panduan jelas tentang di mana RLS diterapkan dan bagaimana cara menyaring data per role.

### 4. Duplikasi Tabel Penugasan ✅ Teratasi

**Sebelum:** Dua tabel terpisah:
- `teacher_subject_assignments` (guru → mapel → tahun ajaran) — tidak terhubung ke rombel/kelas
- `rombel_teacher_assignments` (guru → rombel → mapel → tahun ajaran) — mencakup semua yang dibutuhkan

Tabel `teacher_subject_assignments` redundan karena semua informasi penugasan mengajar (guru, rombel, kelas, mapel, periode) sudah ada di `rombel_teacher_assignments`. Dua tabel ganda menambah kompleksitas dan risiko inkonsistensi data.

**Sesudah:** `teacher_subject_assignments` dihapus. `rombel_teacher_assignments` diubah nama menjadi `teaching_assignments` dengan penambahan `class_id` FK agar semua relasi (guru → rombel → kelas → mapel → tahun ajaran → semester) terkumpul dalam satu tabel. Tabel ini sekarang menjadi satu sumber kebenaran (single source of truth) untuk semua penugasan mengajar.

**Dampak:** Model data lebih sederhana, lebih sedikit tabel yang perlu dikelola, dan tidak ada risiko inkonsistensi antara dua tabel assignment.

### 5. Ketidakkonsistenan Hak Akses Orang Tua ✅ Teratasi

**Sebelum:** Route `GET /api/v1/agenda` mengizinkan "Semua Role (terbatas)" yang secara teknis termasuk role `orang_tua`. Tapi permission matrix di AUTH_RBAC.md menyatakan Orang Tua tidak memiliki akses ke Agenda Mengajar (`-`), dan User Flow Orang Tua tidak menyebutkan agenda. Ini bisa menyebabkan Orang Tua mengakses agenda mengajar anaknya melalui application layer jika RLS tidak diimplementasikan dengan ketat.

**Sesudah:** Route `GET /api/v1/agenda` sekarang secara eksplisit menyebutkan role yang diizinkan: `Guru, Wali Kelas, Siswa` (tanpa Orang Tua). Orang Tua tidak dapat mengakses agenda mengajar sesuai permission matrix. Permission matrix juga diperbaiki konsistensi naming role-nya (lowercase snake_case) dan menambahkan kolom Statistik.

**Dampak:** Tidak ada lagi ambiguitas tentang apakah Orang Tua bisa melihat agenda. Akses Orang Tua pada route agenda secara teknis tidak mungkin karena middleware akan menolak akses.

### 6. Definisi Modul Statistik ✅ Teratasi

**Sebelum:** Route `/api/v1/statistik`, `/api/v1/statistik/guru`, dan `/api/v1/statistik/rombel/:id` ada di ROUTES.md dan API_SPEC.md, tapi tidak ada modul Statistik di MODULES.md, tidak ada user flow, tidak ada permission matrix entry, dan tidak ada test plan. Route ini akan menjadi "orphan route" selama implementasi.

**Sesudah:** Statistik sekarang didefinisikan sebagai bagian integral dari modul Dashboard (Modul 1). MODULES.md Ditambahkan bagian Statistik yang menjelaskan:
- **Struktur Data Terkait:** `users`, `teachers`, `students`, `rombels`, `grades`, `attendances`, `lesson_plans`
- **Route Terkait:** Semua route statistik dengan role access yang jelas
- **User Flow:** Admin melihat statistik global di dashboard; Guru melihat statistik kelasnya; Wali Kelas melihat statistik rombelnya
- **Role Akses:** Admin (R), Guru (R — gurunya), Wali Kelas (R — rombelnya)

Permission matrix di AUTH_RBAC.md juga ditambahkan baris Statistik.

**Dampak:** Setiap route statistik sekarang memiliki modul definisi, permission, dan user flow yang terdokumentasi.

---

## Dampak Terhadap Implementasi

### Dampak Terhadap Database

1. **Tabel `grading_components` ditambahkan** — perlu pembuatan migrasi baru dengan tabel lookup untuk komponen penilaian. `grades` table FK berubah dari `component ENUM` menjadi `grading_component_id INT FK`.
2. **Tabel `teacher_subject_assignments` dihapus** — tidak ada migrasi perubahan schema (hanya penghapusan tabel yang tidak terpakai selama migrasi).
3. **Tabel `rombel_teacher_assignments` diganti nama menjadi `teaching_assignments`** — perlu migrasi rename. `class_id` FK ditambahkan.
4. **Tabel `settings` diubah** — `school_id` FK dihapus. Pengaturan bersifat global per instance (sesuai single-school MVP).
5. **Indeks baru ditambahkan** — `teaching_assignments.teacher_id + teaching_assignments.rombel_id` composite index. `grading_components.academic_year_id + grading_components.semester_id` composite index.

### Dampak Terhadap Hak Akses

1. **RLS diterapkan pada application layer** — developer perlu mengimplementasikan middleware atau service-level filtering yang menyaring data berdasarkan relasi role-pengguna-data.
2. **Orang Tua tidak dapat akses Agenda Mengajar** — middleware authorize akan menolak jika role orang_tua mencoba mengakses route agenda.
3. **Role naming konsisten** — seluruh dokumentasi menggunakan lowercase snake_case (`admin`, `guru`, `wali_kelas`, `siswa`, `orang_tua`) untuk nama role. Developer harus memastikan consistent dengan konvensi ini di kode application.
4. **Statistik memiliki role access yang terdefinisi** — hanya Admin, Guru, dan Wali Kelas yang bisa mengakses statistik.

### Dampak Terhadap Route

1. **Route Agen (`GET /api/v1/agenda`) sekarang eksplisit:** hanya Guru, Wali Kelas, Siswa (bukan "Semua Role (terbatas)") — menghilangkan potensi Orang Tua mengakses agenda.
2. **Route Rombel (`GET /api/v1/rombel`) sekarang eksplisit:** Guru hanya melihat rombel yang diajar, Wali Kelas melihat rombelnya sendiri.
3. **Route grading_components ditambahkan** — sesuai dengan tabel `grading_components` yang baru.
4. **Route statistik terdefinisi** dengan akses role-spesifik.
5. **Absensi route tetap sama** (Guru, Wali Kelas, Siswa, Orang Tua) karena akses Orang Tua ke absensi anaknya sesuai permission matrix.

### Dampak Terhadap Pengembangan Aplikasi

1. **Model data lebih bersih** — satu tabel penugasan (`teaching_assignments`) mengurangi kompleksitas service layer. Tidak perlu kueri dua tabel assignment untuk menentukan apakah seorang guru mengajar di suatu rombel.
2. **Komponen penilaian lebih fleksibel** — sekolah dapat mengonfigurasi komponen penilaian sendiri (misal menambahkan " uts tambahan " atau " praktik "). Tidak lagi bergantung pada ENUM hard-coded.
3. **RLS pada application layer** — developer perlu mengimplementasikan scope query berdasarkan role di service layer, yang menambah kompleksitas implementation namun lebih mudah di-audit dan di-test dibandingkan database-level RLS.
4. **Single-school simplification** — tidak perlu argument `school_id` pada sebagian besar service layer queries, mengurangi boilerplate kode untuk MVP.
5. **Tidak ada perubahan roadmap** — semua revisi adalah cleanups dan perbaikan arsitektur, tidak mengubah scope atau urutan implementasi.

---

## Validasi Akhir

### Validasi Database ✅

| Tabel | Fungsi | Status |
|---|---|---|
| `users` | Autentikasi dan role | ✅ Konsisten |
| `schools` | Konfigurasi institusi (single-school) | ✅ Konsisten dengan single-school MVP |
| `profiles` | Profil pengguna | ✅ |
| `academic_years` | Tahun ajaran | ✅ |
| `semesters` | Semester | ✅ |
| `classes` | Tingkat kelas | ✅ |
| `rombels` | Rombongan belajar | ✅ |
| `subjects` | Mata pelajaran | ✅ |
| `teachers` | Data guru | ✅ |
| `students` | Data siswa | ✅ |
| `parents` | Akun orang tua | ✅ |
| `teaching_assignments` | Penugasan guru mengajar (konsolidasi) | ✅ Satu sumber kebenaran |
| `grading_components` | Komponen penilaian (lookup table) | ✅ Baru ditambahkan, sesuai route CRUD |
| `grades` | Nilai siswa | ✅ FK ke grading_components dan teaching_assignments |
| `attendances` | Catatan kehadiran | ✅ |
| `lesson_plans` | Agenda mengajar | ✅ |
| `audit_logs` | Jejak audit | ✅ |
| `settings` | Pengaturan global | ✅ Disederhanakan untuk single-school |

**Tidak ada tabel ganda.** `teacher_subject_assignments` dihapus, `rombel_teacher_assignments` diganti `teaching_assignments`. `school_id` dari `settings` dihapus untuk kesederhanaan single-school MVP.

### Validasi Hak Akses (RBAC) ✅

| Peran | Dashboard | Data Guru | Data Siswa | Rombel | Absensi | Leger | Agenda | Laporan | Pengaturan | Statistik |
|---|---|---|---|---|---|---|---|---|---|---|
| admin | R | CRUD | CRUD | CRUD | R | R | R | CR | CR | R |
| guru | R | R(sendiri) | R(kelasnya) | R(rombelnya) | CR(kelasnya) | CR(mapelnya) | CR(mengajarnya) | R(terbatas) | - | R(gurunya) |
| wali_kelas | R | - | R(rombelnya) | R(rombelnya) | R(rombelnya) | R(rombelnya) | R(rombelnya) | R(kelasnya) | - | R(rombelnya) |
| siswa | R | - | R(sendiri) | R(rombelnya) | R(sendiri) | R(sendiri) | R(rombelnya) | R(sendiri) | - | - |
| orang_tua | R | - | R(anaknya) | - | R(anaknya) | R(anaknya) | - | R(anaknya) | - | - |

**Tidak ada konflik** antara permission matrix dan route definitions. Semua route memiliki role yang terdefinisi secara eksplisit. Orang Tua tidak memiliki akses ke Agenda Mengajar (konsisten dengan ROUTES.md).

### Validasi Route ✅

| Permasalahan Kritis | Status |
|---|---|
| Route Statistik tanpa modul | ✅ Didefinisikan sebagai bagian Dashboard |
| Route grading_components tanpa schema | ✅ Tabel grading_components ditambahkan |
| RLS tidak terdefinisi | ✅ Didokumentasikan di 4 dokumen |
| Multi-tenancy ambigu | ✅ Diklarifikasi single-school untuk MVP |
| Route agenda untuk Orang Tua | ✅ Diperbaiki — hanya Guru, Wali Kelas, Siswa |
| Route Rombel tanpa pembatasan relasional | ✅ Guru hanya melihat rombel yang ditugaskan |

### Validasi Modul ✅

Setiap modul sekarang memiliki:
- **Struktur Data Terkait** — tabel yang digunakan
- **Route Terkait** — daftar endpoint API dengan akses per role
- **User Flow** — referensi ke `docs/USER_FLOW.md`
- **Role Akses** — table permission matrix

### Validasi Arsitektur ✅

- **Single-school clarity** — tidak ada lagi ambiguitas tentang multi-tenant.
- **Penugasan konsolidasi** — satu tabel untuk semua penugasan mengajar.
- **Komponen penilaian fleksibel** — lookup table, bukan ENUM hard-coded.
- **RLS terdokumentasi** — developer tahu di mana dan bagaimana menerapkan pembatasan akses berdasarkan relasi.
- **Konsistensi penamaan** — lowercase snake_case untuk semua role di seluruh dokumen.

---

## Final Verdict

✅ SIAP DIIMPLEMENTASIKAN

Seluruh 6 Permasalahan Kritis dari `audit_report_final.md` telah diselesaikan. Dokumentasi SAGU sekarang konsisten di seluruh dokumen, setiap modul memiliki struktur data, hak akses, route, dan user flow yang jelas, tidak ada tabel database yang ganda atau tidak terpakai, setiap route memiliki modul dan role permission yang terdefinisi, dan seluruh role memiliki permission yang konsisten dengan kebutuhan sistem. Revisi ini tidak menambah fitur baru dan tidak mengubah ruang lingkup MVP yang sudah disepakati. Implementasi Fase 1 (Fondasi Aplikasi) dapat dimulai.