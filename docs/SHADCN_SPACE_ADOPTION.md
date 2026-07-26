# Adopsi Shadcn Space untuk SAGU

## Repository Sumber

- Repository: `https://github.com/shadcnspace/shadcnspace`
- Referensi utama: pola `dashboard-shell-01`, sidebar, card, breadcrumb, collapsible, drawer/sheet, badge, button, table, skeleton, dan toast.
- Lisensi sumber: MIT.

## Strategi Adopsi

Shadcn Space dipakai sebagai referensi pola visual dan hierarki, bukan sebagai template penuh.

Yang diadaptasi:

- Shell dashboard ringan dengan sidebar, topbar sticky, breadcrumb, profil pengguna, dan drawer mobile.
- Sidebar putih dengan border tipis, menu aktif biru lembut, collapse desktop, dan grup Data Master collapsible.
- Card dashboard yang lebih rendah, border halus, radius 8px, dan spacing lebih tenang.
- Kesiapan operasional sebagai panel utama dibanding banyak card simetris.
- Toast global dengan posisi top-right desktop dan top-center mobile.

Yang tidak digunakan:

- Template penuh `dashboard-shell-01`.
- Data demo penjualan, grafik finansial, avatar/gambar remote demo, dan link `href="#"`.
- Chart dekoratif tanpa sumber data aktual.
- Command search global karena SAGU belum memiliki pencarian global.
- Dependency baru seperti Tailwind CSS, shadcn/ui, Sonner, Radix UI, Base UI, Motion, Recharts, atau Lucide Icons.

## Kompatibilitas Stack

| Dependency | Sudah Ada | Diperlukan | Keputusan |
|---|---|---|---|
| Next.js 14 | Ya | Ya | Dipertahankan |
| React 18 | Ya | Ya | Dipertahankan |
| Tailwind CSS | Tidak | Tidak | Tidak ditambahkan |
| shadcn/ui | Tidak | Tidak | Tidak ditambahkan |
| Sonner | Tidak | Tidak wajib | Tidak ditambahkan; memakai toast internal |
| Radix UI / Base UI | Tidak | Tidak wajib | Tidak ditambahkan |
| Motion / Framer Motion | Tidak | Tidak wajib | Tidak ditambahkan; CSS cukup |
| Lucide Icons | Tidak | Tidak wajib | Tidak ditambahkan; memakai `DashboardIcon` internal |

## Penyesuaian untuk SAGU

- Warna tetap mengikuti token SAGU dan Ruang Pintar UI Kit.
- Data dashboard hanya memakai query PostgreSQL melalui Prisma.
- Empty state dipakai ketika absensi, jadwal, atau siswa tidak hadir belum memiliki data aktual.
- Topbar periode aktif tetap memakai endpoint `/api/v1/tahun-ajaran/active`.
- Login toast memakai flag non-sensitif `sessionStorage` `sagu:login-success`, lalu flag dihapus setelah toast tampil.
- Tidak ada perubahan pada JWT, cookie auth, middleware, RBAC, Prisma schema, atau route.

## Lisensi dan Provenance

Tidak ada source komponen Shadcn Space yang disalin substansial ke SAGU. Implementasi menggunakan komponen internal SAGU dan CSS Modules yang ditulis ulang sesuai kebutuhan proyek.

Karena tidak ada kode pihak ketiga yang disalin, `THIRD_PARTY_NOTICES.md` tidak dibuat pada tahap ini. Jika pada tahap berikutnya source komponen Shadcn Space disalin langsung, notice MIT wajib ditambahkan.
