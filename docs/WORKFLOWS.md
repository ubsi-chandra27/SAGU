# Workflows for SAGU Academic Operations

## Alur Kerja Akademik SAGU untuk Setiap Role

Dokumen ini menjelaskan seluruh alur kerja akademik SAGU berdasarkan model Kurikulum Merdeka. Setiap workflow dideskripsikan secara berurutan dari login hingga penyelesaian tugas akademik utama.

---

## 1. Workflow Login Guru

1. Guru membuka halaman login aplikasi SAGU.
2. Guru memasukkan username dan password.
3. Sistem memverifikasi kredensial terhadap tabel `users`.
4. Sistem memverifikasi bahwa akun guru aktif (`is_active = true`).
5. Sistem memverifikasi password yang telah di-hash.
6. Jika valid, sistem menghasilkan JWT access token dan refresh token.
7. Guru diarahkan ke Dashboard Guru.
8. Sidebar menampilkan menu relevan: Agenda Mengajar, Absensi, Leger, Profil.
9. Dashboard Guru menampilkan statistik ringkasan (jumlah siswa di kelas, agenda hari ini, rekap absensi).

---

## 2. Workflow Mulai Pertemuan

1. Guru login dan diarahkan ke Dashboard Guru.
2. Guru membuka menu Agenda Mengajar.
3. Guru memilih mata pelajaran, rombel, dan tanggal pertemuan.
4. Sistem menampilkan jurnal mengajar yang telah direncanakan (teaching_journals).
5. Guru memulai pertemuan dan mengisi topik pembahasan.
6. Guru mencatat TP yang sedang dicapai pada pertemuan ini.
7. Guru memilih LM yang relevan dengan topik hari ini.
8. Guru mencatat durasi mulai dan selesai pertemuan.
9. Guru menyimpan jurnal pertemuan (`meeting_number` bertambah otomatis, `meeting_date` = tanggal saat ini).
10. Sistem menyimpan pertemuan ke tabel `meetings`.
11. Pertemuan siap untuk pencatatan absensi dan penilaian.

---

## 3. Workflow Absensi

1. Guru membuka menu Absensi dari sidebar.
2. Guru memilih rombel yang sedang ditugaskan.
3. Guru memilih tanggal pertemuan (biasanya = tanggal pertemuan yang baru dibuat).
4. Sistem menampilkan daftar siswa dalam rombel tersebut.
5. Guru mencentang status kehadiran setiap siswa:
   - **Hadir** (default jika siswa hadir).
   - **Izin** (siswa izin dengan keterangan).
   - **Sakit** (siswa sakit, perlu keterangan).
   - **Terlambat** (siswa datang setelah waktu mulai).
   - **Alpha** (siswa tidak hadir tanpa keterangan).
6. Guru menambahkan catatan khusus untuk siswa yang izin/sakit (opsional).
7. Guru mencentang seluruh siswa sudah terisi.
8. Guru mengklik tombol "Simpan Absensi".
9. Sistem menyimpan setiap absensi ke tabel `attendances` dengan `recorded_by` = guru yang mencatat.
10. Sistem menampilkan pesan sukses.
11. Guru dapat mengedit absensi untuk pertemuan yang sama (sebelum rekap harian di-lock).

---

## 4. Workflow Jurnal Mengajar

1. Guru membuka menu Agenda Mengajar dari sidebar.
2. Guru memilih pertemuan yang telah dilakukan.
3. Guru melihat detail pertemuan (topik, TP tercapai, LM yang dibahas).
4. Guru memperbarui jurnal dengan:
   - Metode pembelajaran yang digunakan.
   - Media yang digunakan.
   - Refleksi guru setelah pertemuan.
   - Rencana tindak lanjut untuk pertemuan berikutnya.
5. Guru mengklik tombol "Simpan Jurnal".
6. Sistem memperbarui data pertemuan di tabel `meetings`.
7. Jurnal yang sudah melewati batas waktu hari sekolah tidak dapat diedit tanpa intervensi Admin.

---

## 5. Workflow Penilaian Formatif

1. Guru membuka menu Leger Penilaian.
2. Guru memilih mata pelajaran yang diajar.
3. Guru memilih rombel yang ditugaskan.
4. Guru memilih semester dan tahun ajaran aktif.
5. Sistem menampilkan daftar TP berdasarkan teaching_assignment guru tersebut.
6. Guru memilih TP tertentu (contoh: TP1 - Memahami Variabel).
7. Sistem menampilkan daftar siswa dalam rombel.
8. Untuk setiap siswa, guru menginput:
   - **Skor** (nilai 0 hingga max_score).
   - **Umpan balik** (komentar deskriptif kepada siswa).
9. Guru memilih jenis penilaian formatif: observasi, tugas harian, kuis singkat, refleksi, atau diskusi.
10. Guru menetapkan tanggal penilaian (biasanya = tanggal pertemuan).
11. Guru mengklik tombol "Simpan Penilaian Formatif".
12. Sistem menyimpan ke tabel `formative_assessments`.
13. Guru dapat mengulangi langkah 6-12 untuk TP berikutnya atau pertemuan lain.
14. Nilai formatif tidak berkontribusi langsung ke nilai akhir (bersifat umpan balik).
15. Siswa dan Orang Tua dapat melihat umpan balik formatif setelah leger dipublikasikan.

---

## 6. Workflow Penilaian Sumatif

1. Guru membuka menu Leger Penilaian.
2. Guru memilih mata pelajaran yang diajar.
3. Guru memilih rombel yang ditugaskan.
4. Guru memilih semester dan tahun ajaran aktif.
5. Sistem menampilkan daftar LM berdasarkan teaching_assignment guru tersebut.
6. Guru memilih LM tertentu (contoh: LM1 - Dasar Pemrograman).
7. Sistem menampilkan komponen penilaian sumatif yang telah dikonfigurasi (Harian, UTS, UAS, dll.) berdasarkan grading_components.
8. Guru memilih komponen penilaian tertentu (contoh: Harian).
9. Sistem menampilkan daftar siswa dalam rombel.
10. Guru menginput skor untuk setiap siswa:
    - **Skor** (nilai 0 hingga max_score yang ditentukan).
    - **Catatan** tambahan (opsional).
11. Guru mengklik tombol "Simpan Nilai Sumatif".
12. Sistem menyimpan ke tabel `summative_assessments`.
13. Guru mengulangi langkah 7-12 untuk setiap komponen penilaian (UTS, UAS, Proyek).
14. Sistem menghitung otomatis nilai tertimbang per komponen.
15. Setelah seluruh komponen sumatif diinput, sistem menghitung nilai akhir otomatis dan menyimpan ke `grades_dashboard`.

---

## 7. Workflow Publikasi Nilai

1. Guru menyelesaikan seluruh input nilai sumatif dan formatif untuk semester berjalan.
2. Guru membuka menu Leger Penilaian.
3. Guru memilih "Finalisasi Nilai" untuk semester dan mata pelajaran tertentu.
4. Sistem menampilkan konfirmasi: seluruh nilai telah terinput?
5. Guru mengonfirmasi finalisasi.
6. Sistem mengunci input nilai semester tersebut (guru tidak dapat lagi mengubah kecuali melalui Admin).
7. Sistem menghitung otomatis nilai akhir per siswa per mata pelajaran berdasarkan bobot grading_components.
8. Sistem mengkonversi nilai numerik ke huruf (A/B/C/D/E) dan predikat.
9. Guru mengklik "Publikasikan Nilai".
10. Sistem mengatur flag `is_published = true` untuk seluruh entri nilai semester tersebut.
11. Siswa dan Orang Tua kini dapat melihat nilai yang terpublikasi.
12. Wali Kelas dapat memverifikasi kelengkapan nilai seluruh siswa di rombelnya.
13. Semua perubahan status publikasi tercatat di audit log.

---

## 8. Workflow Leger

1. Guru (atau peran yang berwenang) membuka menu Leger Penilaian.
2. Guru memilih mata pelajaran.
3. Guru memilih rombel.
4. Guru memilih semester dan tahun ajaran.
5. Sistem menampilkan leger lengkap dengan struktur:

   **Bagian A: Penilaian Formatif per TP**
   | TP | Pertemuan | Tanggal | Skor | Umpan Balik |
   |---|---|---|---|---|
   | TP1 | Pertemuan 1 | 2025-08-15 | 85 | Bagus |

   **Bagian B: Penilaian Sumatif per LM**
   | LM | Komponen | Skor | Bobot | Nilai Tertimbang |
   |---|---|---|---|---|
   | LM1 | Harian (0.30) | 85 | 0.30 | 25.5 |
   | LM1 | UTS (0.25) | 80 | 0.25 | 20.0 |

   **Bagian C: Nilai Akhir**
   | Komponen | Bobot | Nilai Tertimbang |
   |---|---|---|
   | Harian | 0.30 | 25.5 |
   | UTS | 0.25 | 20.0 |
   | UAS | 0.30 | 23.4 |
   | Proyek | 0.15 | 11.7 |
   | **Total** | **1.00** | **80.5 (B - Baik)** |

6. Guru mengklik "Ekspor" untuk mencetak leger dalam format PDF atau spreadsheet.
7. Leger dapat difilter berdasarkan TP tertentu, LM tertentu, atau komponen penilaian.
8. Wali Kelas dapat mengakses leger rombelnya untuk memverifikasi kelengkapan.
9. Admin dapat mengakses leger seluruh sekolah untuk monitoring.

---

## 9. Workflow Rapor

1. Setelah seluruh nilai dipublikasikan untuk semester tertentu, sistem menampilkan notifikasi ke Guru dan Wali Kelas.
2. Wali Kelas membuka menu Laporan.
3. Wali Kelas memilih "Rapor Siswa".
4. Wali Kelas memilih rombel dan semester.
5. Sistem menampilkan daftar siswa dalam rombel.
6. Wali Kelas memilih siswa tertentu.
7. Sistem menampilkan rapor siswa yang berisi:

   **Bagian 1: Identitas Siswa**
   - Nama, NIS, NISN
   - Kelas, Rombel
   - Semester, Tahun Ajaran

   **Bagian 2: Ringkasan Absensi**
   | Status | Jumlah |
   |---|---|
   | Hadir | 32 |
   | Izin | 3 |
   | Sakit | 1 |
   | Alpha | 0 |

   **Bagian 3: Nilai Akhir per Mata Pelajaran**
   | Mata Pelajaran | Nilai Akhir | Huruf | Predikat |
   |---|---|---|---|
   | Matematika | 80.5 | B | Baik |
   | Informatika | 78.0 | C | Cukup |
   | PPKn | 92.0 | A | Sangat Baik |

   **Bagian 4: Catatan Guru**
   - Untuk setiap mata pelajaran, guru memberikan catatan deskriptif.

   **Bagian 5: Catatan Wali Kelas**
   - Ringkasan perkembangan dan perilaku siswa.

8. Wali Kelas menambahkan atau mengedit catatan rapor.
9. Wali Kelas mengklik "Cetak Rapor".
10. Sistem menghasilkan PDF rapor per siswa.
11. Rapor ditandatangani oleh guru, wali kelas, dan orang tua.
12. Rapor disimpan dengan soft delete (riwayat tidak pernah dihapus permanen).
13. Siswa dan Orang Tua dapat mengakses rapor digital melalui dashboard masing-masing.

---

## Urutan Prioritas Workflow untuk Guru

Urutan yang direkomendasikan setiap minggu oleh guru:

1. **Mulai Pertemuan** (Minggu 1-16 setiap semester)
2. **Absensi** (setiap pertemuan)
3. **Jurnal Mengajar** (setiap pertemuan)
4. **Penilaian Formatif** (setiap pertemuan, per TP)
5. **Penilaian Sumatif** (per LM, setiap akhir sub-fase)
6. **Finalisasi Nilai** (end semester)
7. **Publikasi Nilai** (end semester, sebelum rapor)
8. **Leger** (keseluruhan semester, bila diperlukan)
9. **Rapor** (end semester, setelah semua nilai dipublikasikan)