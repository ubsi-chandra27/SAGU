# Business Rules for Academic Operations

## Seluruh Aturan Bisnis Akademik SAGU Sesuai Kurikulum Merdeka

Dokumen ini mendefinisikan aturan bisnis akademik untuk SAGU. Aturan ini mengatur hak akses, publikasi nilai, perubahan nilai, absensi, jurnal mengajar, leger, dan rapor.

---

## 1. Hak Akses Berdasarkan Role

### Admin

- Mengelola seluruh data master (guru, siswa, rombel, mata pelajaran).
- Mengelola CP, LM, dan TP (konfigurasi tingkat sekolah).
- Mengelola grading components (konfigurasi bobot penilaian).
- Mengelola tahun ajaran dan semester.
- Mengelola pengguna dan role.
- Mengakses semua laporan global.
- Melihat dan mempublikasikan nilai untuk seluruh sekolah.
- Melihat seluruh leger dan rapor.

### Guru

- Mengakses data siswa, rombel, dan mata pelajaran yang ditugaskan melalui teaching_assignment.
- Menginput penilaian formatif per TP pada pertemuan yang diajarkan.
- Menginput penilaian sumatif per LM pada komponen yang ditugaskan.
- Melihat leger nilai untuk mata pelajaran yang diajar.
- Mengedit dan menghapus input nilai sendiri (sebelum dipublikasikan).
- Memublikasikan nilai siswa setelah final.
- Mengelola jurnal mengajar (teaching_journals).
- Mencatat absensi siswa pada kelas yang diajar.
- Melihat data pribadi dan profil sendiri.

### Wali Kelas

- Mengakses daftar siswa dalam rombel yang ditugaskan.
- Melihat seluruh leger nilai rombel (semua mata pelajaran).
- Memverifikasi kelengkapan nilai sebelum publikasi.
- Menghasilkan laporan kelas untuk rapor.
- Melihat rekap absensi rombel.
- Tidak dapat menginput atau mengubah nilai (hanya melihat dan memverifikasi).

### Siswa

- Melihat data pribadi, jadwal, absensi.
- Melihat nilai yang sudah dipublikasikan per TP dan per LM.
- Melihat umpan balik formatif (feedback) dari guru.
- Tidak dapat mengubah atau mengakses nilai yang belum dipublikasikan.
- Tidak dapat mengakses nilai mata pelajaran yang bukan bagian dari rombelnya.

### Orang Tua

- Melihat ringkasan absensi anaknya.
- Melihat nilai anak yang sudah dipublikasikan (per TP dan per LM).
- Melihat umpan balik formatif (feedback).
- Mengakses informasi terbatas yang terkait dengan anaknya saja.
- Tidak dapat mengubah atau mengakses data siswa lain.

---

## 2. Aturan Publikasi Nilai

### Proses Publikasi

1. Guru menginput seluruh nilai sumatif dan formatif.
2. Guru mengklik tombol "Finalisasi" untuk mengunci input nilai.
3. Sistem menghitung otomatis nilai akhir per siswa per mata pelajaran.
4. Wali kelas melakukan verifikasi kelengkapan dan keakuratan nilai.
5. Wali kelas mengklik "Verifikasi Selesai" (opsional, tergantung konfigurasi sekolah).
6. Guru mengklik "Publikasikan" untuk membuat nilai terlihat oleh siswa dan orang tua.
7. Siswa dan orang tua menerima notifikasi (jika fitur notifikasi diaktifkan di fase lanjutan) bahwa nilai telah dipublikasikan.

### Aturan Publikasi

- **Publish sekali per semester**: Nilai yang telah dipublikasikan tidak dapat dibuka ulang tanpa intervensi Admin.
- **Sebelum publish**: Hanya Guru dan Admin yang dapat melihat nilai detail.
- **Setelah publish**: Siswa dan Orang Tua dapat melihat nilai yang terpublikasi.
- **Perubahan setelah publish**: Memerlukan Admin approval. Guru tidak dapat langsung mengubah nilai yang sudah dipublikasikan.
- **Perubahan setelah publish dengan approval**: Admin dapat membuka kembali publikasi, guru mengubah, kemudian mempublikasikan ulang. Semua perubahan tercatat di audit log.
- **Flag is_published**: Setiap entri penilaian sumatif memiliki flag `is_published`. Setiap entri formatif memiliki flag `is_published` yang tersirat (formatif tidak dipublikasikan terpisah; siswa melihat umpan balik formatif melalui leger yang telah dipublikasikan).

### Urutan Publikasi Berdasarkan Komponen

1. Harian (0.20) → Dapat diubah hingga akhir semester.
2. UTS/Tengah Semester (0.25) → Harus final sebelum UAS.
3. Proyek (0.25 opsional) → Harus final sebelum UAS.
4. UAS/Akhir Semester (0.50) → Harus final pada akhir semester.

---

## 3. Aturan Perubahan Nilai

### Aturan Pembatasan Perubahan

| Skenario | Diperbolehkan? | Kondisi |
|---|---|---|
| Guru mengubah nilai sebelum publish | Ya | Tanpa batasan |
| Guru mengubah nilai setelah publish | Tidak | Harus melalui Admin |
| Admin membuka kembali nilai yang dipublish | Ya | Dengan alasan dan audit log |
| Wali Kelas mengubah nilai | Tidak | Wali Kelas hanya viewer |
| Siswa mengubah nilai | Tidak | Siswa hanya viewer |
| Orang Tua mengubah nilai | Tidak | Orang Tua hanya viewer |
| Admin mengubah nilai langsung | Ya | Dengan audit log lengkap |

### Audit Trail Perubahan Nilai

Setiap perubahan nilai (create, update, delete) harus tercatat di tabel `audit_logs` dengan informasi:

- User ID yang melakukan perubahan.
- Timestamp perubahan.
- Record ID yang diubah.
- Old values (sebelum perubahan).
- New values (sesudah perubahan).
- Alamat IP pengguna.

### Khusus Perubahan Setelah Publish

1. Admin membuka kembali publikasi untuk semester/tahun ajaran tertentu.
2. Guru mengubah nilai.
3. Guru mempublikasikan ulang.
4. Sistem mencatat di audit log: "nilai_dibuka_kembali", "nilai_diubah", "nilai_dipublikasikan_ulang".
5. Siswa dan Orang Tua menerima notifikasi bahwa nilai telah diperbarui.

---

## 4. Aturan Absensi

### Status Kehadiran

| Status | Kode | Keterangan |
|---|---|---|
| Hadir | H | Siswa hadir pada pertemuan |
| Izin | I | Siswa izin dengan keterangan |
| Sakit | S | Siswa sakit dengan surat keterangan |
| Alpha | A | Siswa tidak hadir tanpa keterangan |
| Terlambat | T | Siswa datang setelah waktu mulai |

### Aturan Absensi untuk Guru

1. Guru mencatat absensi setiap pertemuan yang diampu (per teaching_assignment).
2. Absensi dicatat per tanggal pertemuan (`meeting_date`).
3. Setiap siswa dalam rombel harus memiliki status absensi.
4. Guru dapat mengedit absensi untuk pertemuan yang sama (sebelum absensi di-rekap).
5. Setelah rekap harian, absensi tidak dapat diubah tanpa intervensi wali kelas atau admin.
6. Status "Alpha" hanya boleh diberikan jika siswa tidak memberikan keterangan izin atau sakit pada hari yang sama.

### Aturan Absensi untuk Siswa

1. Siswa tidak dapat mengubah absensi sendiri.
2. Siswa hanya dapat melihat riwayat absensi sendiri.
3. Siswa dapat melaporkan ketidakhadiran melalui portal siswa (jika fitur diaktifkan).

### Aturan Absensi untuk Orang Tua

1. Orang Tua hanya dapat melihat absensi anaknya.
2. Orang Tua tidak dapat mengubah absensi anaknya.
3. Orang Tua menerima ringkasan kehadiran (jumlah hadir, izin, sakit, alpa) per periode.

### Aturan Absensi untuk Wali Kelas

1. Wali Kelas dapat melihat rekap absensi seluruh siswa dalam rombelnya.
2. Wali Kelas tidak dapat mengubah absensi yang dicatat oleh guru (hanya viewer).
3. Wali Kelas dapat mencetak laporan rekap absensi.
4. Wali Kelas dapat menandai absensi sebagai "perlu diperhatikan" jika ada pola alfa berulang.

---

## 5. Aturan Jurnal Mengajar

### Struktur Jurnal Mengajar

Setiap pertemuan mengajar harus memiliki jurnal yang mencatat:

| Field | Keterangan |
|---|---|
| Tanggal Pertemuan | Tanggal pelaksanaan |
| Jam Mulai dan Selesai | Durasi mengajar |
| Mata Pelajaran | Nama mata pelajaran |
| Rombel | Nama rombel |
| Topik Pembahasan | Topik yang diajarkan |
| TP yang Dicapai | TP yang tercapai pada pertemuan ini |
| LM yang Dibahas | LM yang mencakup topik |
| Metode Pembelajaran | Ceramah, diskusi, praktik, dll. |
| Media yang Digunakan | Whiteboard, PPT, perangkat lunak, dll. |
| Refleksi Guru | Catatan refleksi guru setelah pertemuan |
| Tindak Lanjut | Rencana pertemuan berikutnya |

### Aturan Jurnal Mengajar

1. Guru wajib mengisi jurnal mengajar setelah setiap pertemuan (melalui teaching_journals).
2. Jurnal mengajar dapat diedit hingga akhir hari sekolah berjalan.
3. Jurnal mengajar yang sudah melewati batas waktu hari sekolah tidak dapat diedit tanpa intervensi Admin.
4. Jurnal mengajar yang sudah dipublikasikan (terkait publikasi nilai semester) tidak dapat diedit.
5. Wali Kelas dapat melihat jurnal mengajar seluruh guru di rombelnya (untuk monitoring).
6. Admin dapat melihat dan mencetak seluruh jurnal mengajar untuk audit.
7. Jurnal yang kosong atau belum diisi akan ditandai dengan peringatan di dashboard guru.

---

## 6. Aturan Leger Nilai

### Struktur Leger

Leger menampilkan nilai siswa dalam format tabel yang terstruktur per TP dan per LM. Leger bersifat rahasia dan hanya dapat diakses oleh role yang berwenang.

### Aturan Akses Leger

| Aksi | Admin | Guru | Wali Kelas | Siswa | Orang Tua |
|---|---|---|---|---|---|
| Lihat leger lengkap | Ya | Ya (mapelnya) | Ya (rombelnya) | Tidak | Tidak |
| Lihat leger siswa (terbatas) | Ya | Ya (data siswa di mapelnya) | Ya (siswa di rombelnya) | Ya (data sendiri) | Ya (anaknya) |
| Cetak leger | Ya | Ya (cetak mapelnya) | Ya (cetak rombelnya) | Tidak | Tidak |
| Ekspor leger | Ya | Ya (terbatas) | Ya (rombelnya) | Tidak | Tidak |

### Aturan Penghitungan Leger

1. Leger menampilkan nilai formatif per TP secara terpisah (tanpa bobot).
2. Leger menampilkan nilai sumatif per LM dengan bobot komponen yang terlihat.
3. Nilai akhir dihitung otomatis berdasarkan bobot grading_components.
4. Guru tidak dapat mengubah nilai yang sudah dipublikasikan (lihat Aturan Publikasi Nilai).
5. Semua nilai yang terlihat di leger harus dapat ditelusuri kembali ke sumber data (audit trail).

---

## 7. Aturan Rapor

### Aturan Pembuatan Rapor

1. Rapor dibuat secara otomatis setelah seluruh nilai dipublikasikan untuk semester tertentu.
2. Rapor mencakup nilai akhir per mata pelajaran (dalam skala huruf A-E).
3. Rapor mencakup ringkasan absensi siswa per semester.
4. Rapor mencakup catatan guru untuk setiap mata pelajaran.
5. Rapor dicetak dalam format PDF.
6. Rapor ditandatangani oleh guru dan wali kelas.
7. Orang tua menandatangani (konfirmasi penerimaan) rapor yang sudah dicetak.

### Aturan Akses Rapor

| Aksi | Admin | Guru | Wali Kelas | Siswa | Orang Tua |
|---|---|---|---|---|---|
| Lihat rapor | Ya | Ya (muridnya) | Ya (rombelnya) | Ya (data sendiri) | Ya (anaknya) |
| Cetak rapor | Ya | Ya (muridnya) | Ya (rombelnya) | Tidak | Tidak |
| Edit catatan rapor | Tidak | Ya (muridnya) | Ya (rombelnya) | Tidak | Tidak |
| Hapus rapor | Ya | Tidak | Tidak | Tidak | Tidak |

### Konversi Nilai ke Huruf

| Rentang Nilai | Huruf | Predikat |
|---|---|---|
| 90 - 100 | A | Sangat Baik |
| 80 - 89 | B | Baik |
| 70 - 79 | C | Cukup |
| 60 - 69 | D | Kurang |
| < 60 | E | Tidak Memenuhi |

### Aturan Khusus Rapor

1. Rapor hanya dapat dilihat setelah nilai seluruh mata pelajaran dipublikasikan.
2. Rapor tidak dapat diedit setelah dicetak (kecuali oleh Admin dengan alasan dan audit log).
3. Orang tua menerima salinan rapor (digital PDF untuk format digital, cetak fisik untuk format cetak).
4. Rapor disimpan dengan soft delete (riwayat rapor tidak pernah dihapus secara permanen).
5. Setiap siswa hanya memiliki satu rapor per semester per tahun ajaran.

---

## 8. Aturan Umum Operasional Akademik

### Tahun Ajaran dan Semester

1. Tahun ajaran harus dikonfigurasi terlebih dahulu sebelum siswa dapat ditempatkan di rombel.
2. Semester dalam tahun ajaran aktif harus dikonfigurasi sebelum penilaian dimulai.
3. Penilaian formatif tidak terikat semester tertentu tetapi terikat periode ajaran aktif.
4. Penilaian sumatif terikat semester tertentu.
5. Nilai akhir mata pelajaran dihitung berdasarkan semester aktif.
6. Rapor dihasilkan per semester.

### Soft Delete dan Data Akademik

1. Semua data akademik utama menggunakan soft delete (`deleted_at`).
2. Data yang dihapus secara lunak tetap dapat diakses oleh Admin.
3. Penghapusan soft pada TP, LM, atau grading components yang sudah memiliki data nilai tetap mempertahankan catatan historis.
4. Perubahan struktur grading components setelah nilai diinput dapat menyebabkan perhitungan ulang nilai akhir — harus dengan persetujuan Admin dan dicatat di audit log.

### Multi-School (Fase Lanjutan)

1. Pada fase saat ini (MVP), SAGU menggunakan mode single-school.
2. Semua data akademik diasumsikan berada dalam satu konteks sekolah.
3. Skema multi-school akan ditambahkan pada fase berikutnya dengan menambahkan `school_id` ke semua tabel data akademik.