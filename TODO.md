# TODO.md

Daftar pekerjaan bertahap untuk membangun SAGU.

## Tahap 0 - Fondasi Dokumentasi

- [x] Membuat struktur dokumentasi proyek.
- [x] Menentukan role pengguna.
- [x] Menentukan modul MVP.
- [x] Menyusun workflow awal.
- [x] Menyusun ERD konseptual.
- [x] Menyusun struktur database awal.
- [x] Menyusun roadmap dan milestone.
- [x] Membuat seluruh file dokumentasi (14 file di docs/).
- [x] Membuat dokumentasi domain akademik (ACADEMIC_STRUCTURE.md, BUSINESS_RULES.md, WORKFLOWS.md).
- [x] Melakukan audit penilaian Kurikulum Merdeka (PENILAIAN_ACADEMIC_MODEL.md).
- [x] Membuat laporan review penilaian (penilaian_review_report.md).
- [x] Membuat laporan review akademik (academic_review_report.md).

## Tahap 1 - Validasi Produk

- [ ] Review PRD bersama calon pengguna sekolah.
- [ ] Validasi istilah akademik lokal yang digunakan sekolah.
- [ ] Tentukan format NIS, NISN, NIP, dan kode kelas.
- [ ] Tentukan struktur tahun ajaran dan semester.
- [ ] Tentukan format laporan yang wajib ada.

## Tahap 2 - Desain Teknis

- [ ] Pilih stack backend.
- [ ] Pilih stack frontend.
- [ ] Pilih database.
- [ ] Finalisasi model data.
- [ ] Finalisasi endpoint API.
- [ ] Finalisasi strategi autentikasi.
- [ ] Finalisasi mekanisme audit log.

## Tahap 3 - Implementasi Fondasi

- [x] Setup repository aplikasi.
- [x] Setup konfigurasi environment.
- [x] Implementasi autentikasi.
- [x] Implementasi RBAC.
- [x] Implementasi layout dasar dashboard.
- [x] Pertahankan `auth_implementation_plan.md` di root sebagai referensi aktif karena rencana auth foundation sudah dieksekusi, belum menjadi arsip.
- [x] Implementasi migrasi database awal.

## Tahap 4 - Implementasi Modul MVP

- [ ] Data guru.
- [ ] Data siswa.
- [ ] Tahun ajaran dan semester.
- [ ] Kelas dan rombel.
- [ ] Mata pelajaran.
- [ ] Penugasan mengajar.
- [ ] Absensi.
- [ ] Penilaian.
- [ ] Agenda mengajar.
- [ ] Laporan.
- [ ] Pengaturan.

## Tahap 5 - QA dan Rilis

- [ ] Unit test untuk service inti.
- [ ] Integration test API utama.
- [ ] Uji role dan permission.
- [ ] Uji import/export data jika tersedia.
- [ ] Uji laporan.
- [ ] Uji backup dan restore.
- [ ] Rilis beta internal.
