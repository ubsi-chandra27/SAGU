# MEMORY.md

Catatan memori proyek SAGU. Dokumen ini menyimpan keputusan penting agar konteks tidak hilang antar sesi kerja.

## Keputusan Awal

- Nama aplikasi: SAGU.
- Kepanjangan: Sistem Administrasi Guru.
- Target fase saat ini: MVP administrasi sekolah.
- Fitur AI Generator tidak dibuat pada fase MVP.
- Dokumentasi ditulis dalam Bahasa Indonesia.
- Aplikasi diarahkan sebagai SaaS profesional untuk sekolah.

## Scope MVP

MVP mencakup:

- Dashboard berbasis role.
- Data guru.
- Data siswa.
- Rombel.
- Absensi.
- Leger penilaian.
- Agenda mengajar.
- Laporan.
- Pengaturan.

MVP tidak mencakup:

- AI Generator.
- Pembayaran sekolah.
- LMS lengkap.
- Ujian online kompleks.
- Integrasi eksternal real-time.

## Role Final Fase MVP

- Admin
- Guru
- Wali Kelas
- Siswa
- Orang Tua

## Asumsi Produk

- Satu sekolah dapat memiliki banyak tahun ajaran.
- Satu siswa berada dalam satu rombel aktif pada satu tahun ajaran.
- Satu guru dapat mengajar banyak mata pelajaran dan rombel.
- Wali kelas adalah guru yang ditugaskan ke satu rombel pada tahun ajaran tertentu.
- Orang tua dapat melihat data anak yang terhubung ke akun mereka.

## Keputusan Teknis Awal

- Struktur database dirancang relasional.
- Sistem otorisasi menggunakan RBAC.
- API dirancang RESTful untuk MVP.
- Audit log disarankan untuk aktivitas sensitif.
- Soft delete disarankan untuk data utama.

## Status Dokumentasi

- Seluruh 14 file dokumentasi di `docs/` telah dibuat dan selesai.
- File root (AGENTS.md, README.md, dll.) telah diperbarui.
- File `kilo.json` dibuat untuk konfigurasi proyek.
- Direktori `.kilo/command/` dan `.kilo/agent/` dibuat.
- Audit report final (`audit_report_final.md`) telah dibuat.

## Fase Saat Ini

Tahap 0 fase dokumentasi selesai. Final Architecture Review telah dilakukan (lihat `audit_report_final.md`). Tiga belas (13) Permasalahan Kritis telah diidentifikasi. Enam (6) Permasalahan Kritis telah direvisi dan diselesaikan (lihat `final_revision_report.md`). Proyek berada dalam status SIAP DIIMPLEMENTASIKAN.

