# Design System SAGU

## Standar Desain Konsisten untuk Seluruh Aplikasi SAGU

Dokumen ini mendefinisikan standar desain visual dan interaksi untuk aplikasi SAGU (Sistem Administrasi Guru). Seluruh komponen UI, warna, tipografi, spacing, dan pola layout harus mengikuti standar ini agar menghasilkan pengalaman pengguna yang konsisten, profesional, dan mudah dipakai di seluruh dashboard role.

---

## 1. Filosofi Desain

SAGU adalah aplikasi administrasi sekolah untuk pengguna non-teknis (guru, wali kelas, operator sekolah). Filosofi desain didasarkan pada tiga prinsip utama:

- **Kesederhanaan**: Antarmuka harus bebas dari kebingungan. Setiap halaman memiliki tujuan tunggal yang jelas. Operator sekolah tidak memiliki waktu untuk mempelajari navigasi yang rumit.
- **Keterbacaan**: Teks harus mudah dibaca pada ukuran layar desktop dan tablet. Kontras warna harus memenuhi standar aksesibilitas. Istilah teknis diminimalkan dan diganti dengan Bahasa Indonesia yang sederhana.
- **Konsistensi**: Setiap komponen, warna, tipografi, dan pola layout harus identik di seluruh role dan modul. Pengguna tidak boleh perlu mempelajari ulang antarmuka saat berpindah modul atau role.

---

## 2. Prinsip UI/UX

- **Progressive Disclosure**: Tampilkan informasi yang paling relevan terlebih dahulu. Detail dapat diakses melalui ekspansi atau navigasi ke halaman sub-modul.
- **Feedback Sesaat**: Setiap aksi pengguna (tombol diklik, form disimpan, data dimuat) harus memberikan respons visual yang jelas (toast success, loading state, error message).
- **Consistency**: Tombol, tabel, formulir, dan modal harus tampil dan berperilaku identik di setiap halaman.
- **Mobile-First Navigation**: Sidebar collapse pada tablet dan menjadi hamburger menu pada mobile. Tabel scroll horizontal pada layar kecil.
- **Accessibility**: Semua elemen interaktif harus dapat diakses melalui keyboard. Label ARIA tersedia untuk elemen formulir. Kontras warna memenuhi standar WCAG AA.

---

## 3. Warna Utama (Color Palette)

### Primary Colors

| Nama | Kode Hex | Penggunaan |
|---|---|---|
| Primary Dark | `#1e40af` | Navigasi sidebar, header, tombol utama |
| Primary Base | `#2563eb` | Link, aksi utama, highlight aktif |
| Primary Light | `#dbeafe` | Background hover sidebar, highlight baris tabel |

### Neutral Colors

| Nama | Kode Hex | Penggunaan |
|---|---|---|
| Gray 900 | `#111827` | Heading utama, teks penting |
| Gray 700 | `#374151` | Teks body, label formulir |
| Gray 500 | `#6b7280` | Teks sekunder, placeholder |
| Gray 300 | `#d1d5db` | Border, separator |
| Gray 100 | `#f3f4f6` | Background card, area konten |
| White | `#ffffff` | Background halaman, modal |

### Semantic Colors

| Nama | Kode Hex | Penggunaan |
|---|---|---|
| Success | `#16a34a` | Konfirmasi, status aktif, badge hijau |
| Warning | `#d97706` | Peringatan, status menunggu |
| Danger | `#dc2626` | Penghapusan, error, tidak aktif |
| Info | `#0891b2` | Informasi, badge info |

---

## 4. Warna Status

| Status | Warna Badge | Teks |
|---|---|---|
| Aktif / Hadir | Hijau (`bg-green-100 text-green-800`) | Hijau gelap |
| Belum Aktif / Absen | Abu-abu (`bg-gray-100 text-gray-800`) | Abu-abu gelap |
| Peringatan / Izin | Kuning (`bg-yellow-100 text-yellow-800`) | Kuning gelap |
| Error / Alpa / Sakit | Merah (`bg-red-100 text-red-800`) | Merah gelap |
| Info / Sedang Proses | Biru (`bg-blue-100 text-blue-800`) | Biru gelap |

---

## 5. Typography

### Font Family

- **Font Utama**: Inter atau Sans-serif system default (untuk body text dan UI).
- **Font Monospace**: JetBrains Mono atau monospace system default (untuk kode, NIS, NIP, angka).

### Font Sizes

| Ukuran | Ukuran Font | Line Height | Penggunaan |
|---|---|---|---|
| Heading 1 (H1) | 1.75rem (28px) | 1.2 | Judul halaman utama |
| Heading 2 (H2) | 1.375rem (22px) | 1.3 | Judul section/modul |
| Heading 3 (H3) | 1.125rem (18px) | 1.4 | Judul sub-section (card) |
| Heading 4 (H4) | 1rem (16px) | 1.5 | Label kolom tabel, judul form |
| Body | 0.875rem (14px) | 1.5 | Teks utama, deskripsi |
| Small | 0.75rem (12px) | 1.4 | Teks sekunder, timestamp, metadata |
| Caption | 0.6875rem (11px) | 1.4 | Label badge, helper text |

### Font Weight

| Weight | Penggunaan |
|---|---|
| Bold (700) | Heading, label penting |
| Medium (500) | Sub-heading, tombol |
| Regular (400) | Body text |
| Light (300) | Placeholder, metadata |

---

## 6. Spacing System

Spasi menggunakan skala 4px berbasis:

| Token | Nilai | Penggunaan |
|---|---|---|
| `spacing-xs` | 4px | Gap antar elemen kecil dalam satu grup |
| `spacing-sm` | 8px | Padding internal komponen kecil |
| `spacing-md` | 12px | Margin antar elemen dalam card |
| `spacing-lg` | 16px | Padding internal card, gap antar card |
| `spacing-xl` | 24px | Margin antar section |
| `spacing-2xl` | 32px | Padding halaman utama (halaman content area) |
| `spacing-3xl` | 48px | Margin atas untuk section pertama di halaman |

---

## 7. Border Radius

| Token | Nilai | Penggunaan |
|---|---|---|
| `radius-sm` | 4px | Tombol, input kecil |
| `radius-md` | 8px | Card, modal, dropdown |
| `radius-lg` | 12px | Stat card, statistik widget |
| `radius-full` | 9999px | Badge, avatar, tombol bulat |

---

## 8. Shadow System

| Token | Nilai | Penggunaan |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Card, baris tabel |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Stat card, modal |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.10)` | Dropdown, tooltip |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.10)` | Overlay untuk modal (backdrop) |

---

## 9. Layout Dashboard

### Struktur Layout Utama

Layout halaman utama menggunakan struktur three-column:

```
┌─────────────────────────────────────────────────┐
│  Topbar (height: 56px, fixed)                   │
├────────────┬────────────────────────────────────┤
│            │                                      │
│  Sidebar   │  Main Content Area                 │
│  (width:   │  (padding: spacing-2xl)            │
│  260px)    │                                      │
│            │  - Breadcrumb                       │
│  fixed     │  - Card/Widget row                 │
│  scrollable│  - Data table atau form            │
│            │  - Section content                  │
│            │                                      │
├────────────┴────────────────────────────────────┤
│  Footer (height: 32px, fixed, minimal)          │
└─────────────────────────────────────────────────┘
```

### Breakpoints

- **Desktop (> 1024px)**: Sidebar tetap, konten full width.
- **Tablet (768px - 1024px)**: Sidebar collapse, konten full width.
- **Mobile (< 768px)**: Sidebar sebagai overlay, konten scroll, tabel scroll horizontal.

---

## 10. Sidebar Rules

- Lebar tetap: 260px pada desktop.
- Background: Primary Dark (`#1e40af`) dengan hover efek Primary Light.
- Position: Fixed di sisi kiri, height 100vh.
- Scrollable: Jika menu lebih panjang dari viewport.
- Collapsed state (tablet): Sidebar collapse menjadi icon-only (48px), label ditampilkan sebagai tooltip pada hover.
- Mobile state: Sidebar menyembunyikan diri, toggle via hamburger menu di topbar.
- Setiap item menu memiliki ikon (24px) dan label teks.
- Item menu aktif ditandai dengan Primary Base background dan text putih.
- Item menu non-aktif: text Gray 700 pada Primary Dark background.
- Section divider memisahkan modul utama dari modul pendukung (pengaturan, profil).

---

## 11. Topbar Rules

- Height tetap: 56px.
- Position: Fixed di atas, width 100% (sisi kanan setelah sidebar).
- Background: White dengan border-bottom Gray 200.
- Isi kiri: Nama aplikasi atau breadcrumb halaman saat ini.
- Isi kanan: Avatar pengguna (32px, circle), nama pengguna (truncate jika panjang), dropdown menu (Profil, Ubah Password, Logout).
- Notifikasi: Ikon bell (24px) dengan badge angka merah jika ada notifikasi.
- Hamburger menu: Tersedia pada tablet dan mobile untuk toggle sidebar.

---

## 12. Card Rules

- Background: White.
- Border: 1px solid Gray 200.
- Border Radius: `radius-md` (8px).
- Padding: `spacing-lg` (16px) untuk card body.
- Shadow: `shadow-sm` pada card biasa.
- Header card: `spacing-sm` padding atas dan bawah, Border-bottom Gray 200.
- Footer card: `spacing-sm` padding, Border-top Gray 200.
- Card tanpa header dan footer: Padding `spacing-lg` pada semua sisi.
- Grid layout: Card dapat disusun dalam grid 2-4 kolom untuk ringkasan data.

---

## 13. Statistik Card Rules

Khusus card untuk ringkasan statistik di dashboard:

- Background: White dengan `shadow-sm`.
- Border Radius: `radius-lg` (12px).
- Padding: `spacing-lg` (16px).
- Layout: Ikon kiri (48px, circle, warna tematik), angka besar di tengah kanan (28px, Bold), label deskriptif di bawah angka (14px, Gray 500).
- Warna ikon tematik berdasarkan jenis data: Biru (data), Hijau (keberhasilan), Kuning (peringatan), Merah (bahaya).
- Tidak boleh lebih dari 4 stat card dalam satu baris pada desktop.
- Pada tablet, stat card menyesuaikan menjadi 2 kolom.
- Pada mobile, stat card menyesuaikan menjadi 1 kolom full width.

---

## 14. Quick Action Card Rules

- Background: White dengan `shadow-sm`.
- Border Radius: `radius-lg` (12px).
- Padding: `spacing-lg` (16px).
- Layout: Ikon besar di tengah (40px), label deskriptif di bawah (14px, Medium), jumlah data di bawah label (18px, Bold), warna ikon konsisten dengan modulnya.
- Navigasi: Klik pada quick action card mengarahkan ke halaman modul terkait.
- Shadow meningkat (`shadow-md`) pada state hover.
- Dapat disusun dalam grid 3-5 kolom pada dashboard admin.

---

## 15. Data Table Rules

- Background: White, border 1px solid Gray 200.
- Border Radius: `radius-md` (8px).
- Overflow-x: auto pada tablet dan mobile.
- Header tabel: Background Gray 50, text Gray 700, font weight Medium, padding `spacing-sm` `spacing-md`.
- Body tabel: Zebra striping (baris ganjil White, baris genap Gray 50), padding `spacing-sm` `spacing-md`.
- Baris hover: Background Primary Light (`#dbeafe`).
- Paginasi: Di bawah tabel, info "Menampilkan 1-20 dari 100 data" di kiri, tombol prev/next dan nomor halaman di kanan.
- Pencarian: Input di atas tabel, width 250px, placeholder "Cari...".
- Filter: Dropdown filter per kolom di atas tabel.
- Sorting: Ikon arrow (asc/desc) pada header kolom yang dapat di-sort.
- Aksi per baris: Ikon edit, hapus, dan lihat di kolom aksi paling kanan, dengan tooltip teks.
- Empty state: Tampilan ikon + teks "Belum ada data" + tombol "Tambah" jika relevan.
- Loading state: Skeleton placeholder untuk baris tabel saat data dimuat.

---

## 16. Form Rules

- Label: Font weight Medium, warna Gray 700, ukuran 14px.
- Field wajib: Ditandai asterisk (*) dengan warna Danger merah.
- Input field: Border 1px Gray 300, border-radius `radius-sm` (4px), padding 8px 12px, font ukuran 14px, width penuh (100% container).
- Input focus: Border berubah ke Primary Base (`#2563eb`), outline none, box-shadow `0 0 0 3px rgba(37, 99, 235, 0.1)`.
- Input error: Border berubah ke Danger merah, pesan error di bawah field dalam ukuran 12px (Caption), warna Danger merah.
- Textarea: Sama dengan input field, height minimum 80px, resize vertikal.
- Select: Sama dengan input field, arrow dropdown di kanan.
- Checkbox/Radio: Ukuran 18px x 18px, label di samping kanan (14px).
- Tombol submit: Primary Base (`#2563eb`), text putih, padding 8px 16px, border-radius `radius-sm`.
- Tombol sekunder (Batal): Border 1px Gray 300, background White, text Gray 700.
- Tombol bahaya (Hapus): Border 1px Danger merah, background transparan, text Danger merah.
- Loading state: Tombol submit menampilkan spinner dan teks "Menyimpan..." pada state submit.

---

## 17. Modal Rules

- Overlay: Background hitam 50% opacity (`rgba(0,0,0,0.50)`), z-index tinggi.
- Modal container: White background, border-radius `radius-md` (8px), shadow `shadow-xl`, max-width 560px (default), width 90% viewport.
- Header modal: Padding `spacing-lg` (16px), border-bottom Gray 200, judul modal 16px Bold.
- Body modal: Padding `spacing-lg` (16px), max-height 60vh, overflow-y auto jika konten panjang.
- Footer modal: Padding `spacing-lg` (16px), border-top Gray 200, tombol kanan (Simpan/Submit Primary, Batal Secondary).
- Tombol tutup (X): Pojok kanan atas, 24px x 24px, icon X, hover Background Gray 100.
- Escape key menutup modal (kecuali aksi kritis seperti hapus).

---

## 18. Badge Rules

- Font size: 11px (Caption), padding 2px 8px, border-radius `radius-full` (9999px).
- Badge aktif/sukses: Background hijau muda, text hijau gelap.
- Badge peringatan: Background kuning muda, text kuning gelap.
- Badge bahaya/tidak aktif: Background merah muda, text merah gelap.
- Badge info: Background biru muda, text biru gelap.
- Badge angka: Background Primary Base, text putih, padding 2px 6px.

---

## 19. Empty State Rules

- Layout: Ikon ilustratif 64px di tengah, teks deskriptif 14px Gray 500 di bawah, tombol aksi (Primary Base) jika relevan.
- Teks deskriptif contoh: "Belum ada data guru", "Tidak ada siswa di rombel ini".
- Tidak menampilkan tombol jika tidak ada aksi yang relevan untuk halaman saat ini.
- Background: White atau Gray 50 untuk kontras.

---

## 20. Loading State Rules

- Skeleton loading: Placeholder rectangular dengan background animation pulse (Gray 200) untuk menggantikan konten yang belum dimuat.
- Spinner: Circular loading indicator 24px, warna Primary Base, di tengah area konten saat proses berlangsung.
- Button loading: Tombol menampilkan spinner 16px dan teks "Menyimpan..." atau "Memuat..." pada state loading.
- Page loading: Full-screen semi-transparent overlay dengan spinner besar saat halaman pertama kali dimuat.

---

## 21. Chart Rules

- Chart untuk dashboard statistik menggunakan library chart yang konsisten (contoh: Chart.js atau Recharts).
- Warna chart konsisten dengan color palette SAGU.
- Legenda chart ditampilkan di bawah chart.
- Tooltip pada hover menampilkan nilai detail.
- Ukuran chart responsive: height 250px untuk dashboard statistik ringkas.
- Chart tidak boleh menampilkan angka yang rumit, cukup ringkasan visual.

---

## 22. Responsive Rules

### Desktop (>= 1280px)

- Sidebar tetap (260px).
- Konten penuh dengan max-width 1400px, center-aligned.
- Stat card: 4 kolom.
- Quick action card: 5 kolom.
- Data tabel: Full width tanpa scroll.

### Tablet (768px - 1279px)

- Sidebar collapse menjadi icon-only (48px).
- Konten penuh lebar.
- Stat card: 2-4 kolom (berdasarkan jumlah widget).
- Quick action card: 3 kolom.
- Data tabel: Scroll horizontal.

### Mobile (< 768px)

- Sidebar sebagai overlay menu.
- Hamburger toggle di topbar kiri.
- Stat card: 1 kolom penuh.
- Quick action card: 2 kolom.
- Data tabel: Scroll horizontal, kolom kurang penting bisa disembunyikan.
- Modal: Full screen (90% viewport width).

---

## 23. Mobile Rules

- Touch target minimum 44px x 44px untuk semua elemen interaktif.
- Font body minimum 14px untuk keterbacaan pada layar kecil.
- Tomol aksi utama (Simpan, Buat) harus selalu terlihat dan mudah dijangkau.
- Navigation drawer slide-in dari kiri untuk sidebar mobile.
- Tabel data dengan horizontal scroll indicator.
- Toast notification muncul dari bawah viewport.
- Breadcrumb disederhanakan menjadi teks "Beranda > Halaman Saat Ini".

---

## 24. Accessibility Rules

- Kontras warna minimal WCAG AA (4.5:1 untuk text, 3:1 untuk large text).
- Navigasi keyboard: Tab untuk berpindah antar elemen, Enter untuk mengaktifkan, Escape untuk menutup modal.
- Label ARIA (`aria-label`, `aria-describedby`) untuk semua elemen formulir dan tombol tanpa teks visual.
- Teks alternatif (`alt`) untuk semua gambar dan ikon dekoratif.
- Focus indicator: Outline 2px Primary Base pada elemen yang difokuskan.
- Skip link: tautan "Skip to main content" di awal halaman untuk navigasi keyboard.
- Tidak ada informasi yang hanya disampaikan melalui warna (warning state juga menggunakan icon).
- Heading hierarchy harus konsisten (H1 > H2 > H3) untuk screen reader.

---

## Referensi Desain Lanjutan

- Spesifikasi komponen UI terperinci: `docs/UI_COMPONENTS.md`.
- Pola layout per dashboard role: `docs/UI_PATTERN.md`.
- Mockup halaman akan dibuat setelah PRD disetujui.
- Prototipe interaktif akan dibuat sebelum implementasi fase 1.