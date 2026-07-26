# Design System SAGU

Dokumen ini menjadi satu sumber kebenaran desain SAGU setelah referensi desain lama digabungkan. Dasar visual mengikuti **Ruang Pintar UI Kit v1.0**: card-based, mobile-first, warna soft, dan komponen minimum 44px untuk touch target.

## 1. Prinsip Desain

- **Sederhana**: halaman administrasi menampilkan tugas utama terlebih dahulu.
- **Terbaca**: kontras teks jelas, ukuran body minimum 14px, dan label formulir eksplisit.
- **Konsisten**: warna, spacing, radius, shadow, badge, form, dan card harus memakai token di `src/styles/tokens.ts`.
- **Mobile-first**: layout harus tetap terbaca pada layar kecil sebelum diperluas ke desktop.
- **Aksesibel**: kontrol punya label, state error terlihat jelas, dan informasi tidak hanya bergantung pada warna.

## 2. Warna

| Token | Hex | Penggunaan |
|---|---|---|
| Primary | `#2563EB` | Aksi utama, highlight aktif, logo |
| Primary Hover | `#1D4ED8` | Hover aksi utama |
| Primary Soft | `#DBEAFE` | Latar aksen biru lembut |
| Secondary | `#14B8A6` | Aksi sekunder positif |
| Secondary Soft | `#CCFBF1` | Latar aksen teal lembut |
| Accent | `#FBBF24` | Penekanan pelengkap |
| Accent Soft | `#FEF3C7` | Latar aksen kuning lembut |
| Background | `#F8FAFC` | Latar halaman |
| Surface | `#FFFFFF` | Card, modal, input |
| Surface Muted | `#F1F5F9` | Area kosong, disabled, neutral badge |
| Text Primary | `#0F172A` | Heading dan teks utama |
| Text Secondary | `#64748B` | Deskripsi, label sekunder |
| Text Muted | `#94A3B8` | Helper text dan metadata |
| Border | `#E2E8F0` | Border card dan input |
| Divider | `#E5E7EB` | Pemisah section |
| Success | `#22C55E` | Status berhasil/aktif |
| Warning | `#F59E0B` | Status perlu perhatian |
| Danger | `#EF4444` | Error dan aksi berisiko |
| Info | `#3B82F6` | Informasi |

## 3. Tipografi

Font utama: **Plus Jakarta Sans**, fallback ke Inter dan system sans-serif.

| Token | Font Size | Line Height | Penggunaan |
|---|---:|---:|---|
| Display | 32px | 40px | Angka/statistik besar |
| Heading 1 | 28px | 36px | Judul halaman |
| Heading 2 | 24px | 32px | Judul section |
| Heading 3 | 20px | 28px | Judul card besar |
| Body | 14px | 22px | Teks utama |
| Small | 12px | 18px | Metadata dan teks bantu |
| Caption | 11px | 16px | Badge dan helper ringkas |

Bobot standar: Regular 400, Medium 500, Semibold 600, Bold 700.

## 4. Spacing

| Token | Nilai |
|---|---:|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| 2xl | 24px |
| 3xl | 32px |
| 4xl | 40px |
| 5xl | 48px |

## 5. Radius dan Shadow

| Token Radius | Nilai |
|---|---:|
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| 2xl | 24px |
| full | 9999px |

| Token Shadow | Nilai Implementasi | Catatan |
|---|---|---|
| soft | `0 12px 32px rgba(15, 23, 42, 0.08)` | PDF menampilkan nama `soft`; nilai CSS adalah interpretasi implementasi |
| card | `0 10px 24px rgba(15, 23, 42, 0.06)` | PDF menampilkan nama `card`; nilai CSS adalah interpretasi implementasi |

## 6. Komponen Dasar

Komponen dasar berada di `src/components/ui/` dan wajib memakai `src/styles/tokens.ts`.

| Komponen | Varian/State |
|---|---|
| Button | Primary, Secondary, Outline, Ghost, Danger |
| Input | Label, required marker, helper text, error state |
| Badge | Success, Warning, Danger, Info, Neutral |
| Card | Body, header opsional, footer opsional |

## 7. Pola Form

- Label menggunakan Body/Small dengan warna Text Primary.
- Input minimal 44px, border Border, radius sm.
- State error memakai Danger dan helper text ringkas.
- Tombol submit utama memakai Button Primary.
- Pesan feedback pendek memakai Badge atau pola feedback sejenis dari UI Kit.

## 8. Pola Dashboard

- Dashboard memakai layout card-based dengan gap 16px-24px.
- Statistik memakai Card, Badge status, dan angka Display.
- Konten placeholder boleh sederhana selama role dan permission tetap dipertimbangkan.
- Sidebar/topbar mengikuti pola navigasi konsisten per role.
- Dashboard Admin terbaru mengadopsi pola Shadcn Space secara selektif: sidebar putih dengan border tipis, Data Master collapsible, topbar sticky ringkas, card rendah dengan border halus, grid asimetris, dan empty state tanpa data dummy.
- Toast login memakai provider global internal, posisi top-right desktop dan top-center mobile, durasi sekitar 3-4 detik, serta `aria-live="polite"`.
- Jangan menampilkan pencarian global, chart, notifikasi, aktivitas sistem, atau data demo bila sumber data aktual belum tersedia.

## 9. Konvensi UX dari Referensi Lama

- Navigasi desktop memakai sidebar; mobile dapat memakai drawer/hamburger pada fase berikutnya.
- Route menggunakan nama kecil yang stabil, contoh `/dashboard/admin`, `/dashboard/guru`, `/data/guru`.
- Tabel data wajib punya header jelas, pagination untuk dataset besar, dan empty/loading state.
- Aksi berisiko seperti hapus wajib punya konfirmasi.
- Error message harus spesifik dan membantu pengguna memperbaiki input.

## 10. Referensi Lanjutan

- Komponen UI rinci: `docs/UI_COMPONENTS.md`
- Pola layout: `docs/UI_PATTERN.md`
- Flow pengguna: `docs/USER_FLOW.md`
- Implementasi token: `src/styles/tokens.ts`
