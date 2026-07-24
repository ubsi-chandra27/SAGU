# Design Reference

## Panduan Desain Proyek SAGU

Dokumen ini berisi pedoman dan referensi desain untuk pengembangan SAGU, mencakup gaya visual, prinsip UX, dan konvensi teknis yang harus diikuti oleh tim desain dan pengembang.

## Prinsip Desain Visual

### Warna Utama

- Warna utama: Biru gelap (untuk navigasi, header, elemen brand).
- Warga sekunder: Hijau (untuk keberhasilan, konfirmasi, aktivitas positif).
- Warna peringatan: Kuning/orange (untuk peringatan, perhatian).
- Warna bahaya: Merah (untuk penghapusan, kesalahan, tindakan berbahaya).
- Warna netral: Abu-abu (untuk latar belakang, border, teks sekunder).

### Tipografi

- Font utama menggunakan sans-serif yang mudah dibaca.
- Ukuran font harus konsisten di seluruh aplikasi.
- Heading hierarkis harus jelas (H1, H2, H3, H4).
- Body text harus mudah dibaca pada ukuran layar desktop dan tablet.

### Layout

- Layout berbasis sidebar navigasi utama di sisi kiri.
- Area konten utama di sebelah kanan sidebar.
- Header atas berisi informasi profil pengguna, notifikasi, dan logout.
- Setiap halaman dashboard role memiliki layout card-based untuk ringkasan data.

### Ikon dan Visual

- Gunakan ikon untuk navigasi utama dan aksi umum.
- Ikon harus konsisten dalam gaya (outlined atau filled).
- Status menggunakan badge atau label warna.

## Prinsip UX

### Navigasi

- Navigasi sidebar harus selalu terlihat pada layar desktop.
- Navigasi mobile menggunakan hamburger menu collapse.
- Breadcrumb harus tersedia di setiap halaman sub-modul.
- Setiap menu sidebar harus memiliki label teks dan ikon.

### Formulir

- Label harus jelas dan menggunakan Bahasa Indonesia.
- Field wajib harus ditandai dengan asterisk (*).
- Validasi input harus dilakukan di sisi client dan server.
- Pesan kesalahan harus spesifik dan membantu pengguna memperbaiki input.
- Tombol aksi utama (simpan, submit) harus menonjol.
- Tombol bahaya (hapus) harus memiliki konfirmasi dialog.

### Tabel dan Data

- Tabel harus memiliki header yang jelas.
- Paginasi harus tersedia untuk dataset lebih dari 20 baris.
- Pencarian dan filter harus tersedia pada daftar data master.
- Aksi per baris (edit, hapus, lihat) harus konsisten di seluruh tabel.

### Feedback Pengguna

- Loading state harus ditampilkan selama operasi berlangsung.
- Success message muncul setelah aksi berhasil.
- Error message muncul ketika aksi gagal dengan penjelasan yang membantu.
- Toast notifications untuk informasi singkat.

## Konvensi Teknis Desain

### Route Naming

Gunakan kebiasaan kecil kata (kebanyakan) untuk URL route. Contoh:

- `/dashboard/admin`
- `/dashboard/guru`
- `/data/guru`
- `/data/siswa`
- `/rombel`
- `/absensi`
- `/leger`
- `/agenda`
- `/laporan`
- `/pengaturan`

### Komponen Utama

- `Sidebar` — navigasi utama berdasarkan role.
- `Header` — header atas dengan profil dan notifikasi.
- `DataTable` — tabel data generik dengan paginasi, search, dan sort.
- `ModalForm` — formulir dalam modal untuk CRUD.
- `StatCard` — kartu ringkasan statistik untuk dashboard.
- `Layout` — layout wrapper berdasarkan role.

### Responsive Design

- Desktop: layout sidebar tetap.
- Tablet: sidebar collapse, konten penuh lebar.
- Mobile: sidebar sebagai overlay, tabel scroll horizontal.

## Aksesibilitas

- Kontras warna harus memenuhi standar WCAG AA.
- Navigasi harus dapat digunakan dengan keyboard.
- Label ARIA harus tersedia untuk elemen interaktif.
- Teks alternatif untuk gambar dan ikon dekoratif.

## Referensi Desain Lanjutan

- Spesifikasi komponen UI akan didokumentasikan setelah komponen diimplementasikan.
- Mockup halaman akan dibuat setelah PRD disetujui.
- Prototipe interaktif akan dibuat sebelum implementasi fase 1.