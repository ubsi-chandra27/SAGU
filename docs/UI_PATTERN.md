# UI Patterns for SAGU Dashboards

## Pola Layout dan UI untuk Setiap Dashboard Role SAGU

Dokumen ini menjelaskan pola layout, komponen yang ditampilkan, prioritas informasi, statistik card, quick action card, dan tabel untuk setiap dashboard role dalam aplikasi SAGU.

---

## 1. Dashboard Admin

### Struktur Layout

Layout utama menggunakan sidebar navigation + topbar + main content area. Halaman dashboard Admin terdiri dari satu halaman dengan dua baris komponen.

```
┌──────────────────────────────────────────────────────┐
│ Topbar (Nama Aplikasi, Notifikasi, Avatar, Logout) │
├─────────────┬──────────────────────────────────────┤
│ Sidebar     │  Row 1: Statistik Cards (4 kolom)  │
│ Navigation  │  - Total Guru                         │
│             │  - Total Siswa                        │
│             │  - Total Rombel                       │
│             │  - Absensi Hari Ini                   │
│             │──────────────────────────────────────│
│             │  Row 2: Quick Action Cards            │
│  Dashboard  │  Data Guru | Data Siswa | Rombel     │
│  Guru       │  Absensi | Leger | Laporan           │
│  Wali Kelas │  Siswa | Pengaturan | Laporan        │
│  Siswa      │──────────────────────────────────────│
│  Orang Tua  │  Row 3: Content Area                  │
│             │  - Link cepat ke modul yang sering    │
│             │    digunakan                          │
│             │  - Notifikasi sistem terbaru          │
└─────────────┴──────────────────────────────────────┘
```

### Komponen yang Tampil

- Statistik Card (4 kartu ringkasan di baris pertama)
- Quick Action Card (card aksi cepat di baris kedua)
- Content Area (link navigasi, notifikasi, activity feed)
- Breadcrumb: Beranda > Dashboard Admin

### Prioritas Informasi

1. **Statistik ringkasan** — jumlah guru, siswa, rombel, absensi hari ini (paling utama dan langsung terlihat).
2. **Aksi cepat** — navigasi ke modul data master yang paling sering digunakan.
3. **Notifikasi dan activity** — pengumuman sistem, update terbaru.

### Card yang Digunakan

| Card | Isi | Prioritas |
|---|---|---|
| Total Guru (StatCard) | Jumlah guru aktif + ikon orang (biru) | Tinggi |
| Total Siswa (StatCard) | Jumlah siswa aktif + ikon siswa (hijau) | Tinggi |
| Total Rombel (StatCard) | Jumlah rombel aktif + ikon kelas (kuning) | Tinggi |
| Absensi Hari Ini (StatCard) | Jumlah hadir + izin + sakit + alpa (merah) | Tinggi |
| Data Guru (QuickActionCard) | Navigasi ke Data Guru | Sedang |
| Data Siswa (QuickActionCard) | Navigasi ke Data Siswa | Sedang |
| Rombel (QuickActionCard) | Navigasi ke Rombel | Sedang |
| Absensi (QuickActionCard) | Navigasi ke Absensi | Sedang |
| Leger (QuickActionCard) | Navigasi ke Leger | Sedang |
| Laporan (QuickActionCard) | Navigasi ke Laporan | Sedang |
| Pengaturan (QuickActionCard) | Navigasi ke Pengaturan | Rendah |

### Tabel yang Digunakan

Tidak ada tabel langsung di halaman dashboard Admin. Tabel terlihat ketika admin masuk ke modul Data Guru atau Data Siswa. Di dashboard, statistik card menggantikan tabel.

### Quick Action yang Digunakan

1. Data Guru → `/data/guru`
2. Data Siswa → `/data/siswa`
3. Rombel → `/rombel`
4. Absensi → `/absensi`
5. Leger → `/leger`
6. Laporan → `/laporan/guru`
7. Pengaturan → `/pengaturan`

---

## 2. Dashboard Guru

### Struktur Layout

```
┌──────────────────────────────────────────────────────────┐
│ Topbar (Nama Aplikasi, Notifikasi, Avatar, Logout)      │
├─────────────┬───────────────────────────────────────────┤
│ Sidebar     │  Row 1: Statistik Cards (3 kolom)       │
│ Navigation  │  - Jumlah Siswa di Kelas Saya            │
│             │  - Absensi Hari Ini                       │
│             │  - Agenda Hari Ini                        │
│             │───────────────────────────────────────────│
│             │  Row 2: Quick Action Cards               │
│ Guru Menu   │  Absensi | Agenda | Leger | Profil       │
│             │───────────────────────────────────────────│
│             │  Row 3: Content Area                     │
│             │  - Agenda mengajar hari ini (list)       │
│             │  - Rekap absensi kelas terakhir           │
│             │  - Notifikasi dari wali kelas/Admin       │
└─────────────┴───────────────────────────────────────────┘
```

### Komponen yang Tampil

- Statistik Card (3 kartu ringkasan)
- Quick Action Card (card navigasi modul)
- Agenda Hari Ini (list agenda mengajar untuk hari ini)
- Rekap Absensi Terakhir (tabel ringkas absensi kelas)

### Prioritas Informasi

1. **Agenda mengajar hari ini** — guru perlu melihat topik dan jadwal pelajaran mereka untuk hari berjalan.
2. **Rekap absensi kelas** — guru memantau kehadiran siswa yang baru saja diabsensi.
3. **Statistik ringkasan** — gambaran cepat jumlah siswa, absensi, dan agenda.
4. **Aksi cepat** — navigasi ke modul absensi, agenda, dan leger.

### Card yang Digunakan

| Card | Isi | Prioritas |
|---|---|---|
| Jumlah Siswa di Kelas (StatCard) | Jumlah siswa + ikon orang (biru) | Tinggi |
| Absensi Hari Ini (StatCard) | Status ringkas (hadir, izin, sakit, alpa) + ikon status (kuning) | Tinggi |
| Agenda Hari Ini (StatCard) | Jumlah agenda mengajar hari ini + ikon kalender (hijau) | Tinggi |
| Absensi (QuickActionCard) | Navigasi ke Absensi | Sedang |
| Agenda Mengajar (QuickActionCard) | Navigasi ke Agenda | Sedang |
| Leger Penilaian (QuickActionCard) | Navigasi ke Leger | Sedang |
| Profil (QuickActionCard) | Navigasi ke Profil Guru | Rendah |

### Tabel yang Digunakan

Tabel ringkas di content area menampilkan daftar agenda mengajar hari ini:

| Kolom | Keterangan |
|---|---|
| Waktu | Jam mulai - jam selesai |
| Mata Pelajaran | Nama mata pelajaran |
| Rombel | Nama rombel |
| Topik | Topik pembelajaran hari ini |
| Status | Badge (sukses jika sudah diisi, info jika belum) |

### Quick Action yang Digunakan

1. Absensi → `/absensi`
2. Agenda Mengajar → `/agenda`
3. Leger Penilaian → `/leger`
4. Profil → `/profil`

---

## 3. Dashboard Wali Kelas

### Struktur Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Topbar (Nama Aplikasi, Notifikasi, Avatar, Logout)          │
├─────────────┬───────────────────────────────────────────────┤
│ Sidebar     │  Row 1: Statistik Cards (3 kolom)           │
│ Navigation  │  - Jumlah Siswa di Rombel Saya               │
│             │  - Rekap Absensi Pekan Ini                    │
│             │  - Rekap Nilai Tengah Semester                │
│             │───────────────────────────────────────────────│
│             │  Row 2: Quick Action Cards                    │
│ Wali Kelas  │  Data Siswa | Absensi | Leger | Laporan      │
│ Menu        │───────────────────────────────────────────────│
│             │  Row 3: Content Area                          │
│             │  - Daftar siswa (tabel ringkas 5 siswa)      │
│             │  - 3 siswa dengan absensi tidak lengkap       │
│             │  - Notifikasi dari guru/walikelas            │
└─────────────┴───────────────────────────────────────────────┘
```

### Komponen yang Tampil

- Statistik Card (3 kartu ringkasan)
- Quick Action Card (card navigasi modul)
- Tabel ringkas daftar siswa (5 siswa terakhir)
- Alert untuk siswa dengan absensi tidak lengkap
- Notifikasi sistem

### Prioritas Informasi

1. **Daftar siswa di rombel** — wali kelas perlu memantau siswa yang ada di rombelnya.
2. **Rekap absensi pekan ini** — wali kelas memantau kehadiran siswa secara berkala untuk dilaporkan ke orang tua.
3. **Rekap nilai** — wali kelas memverifikasi kelengkapan nilai di leger.
4. **Alert absensi tidak lengkap** — notifikasi jika ada siswa dengan catatan absensi yang belum lengkap.

### Card yang Digunakan

| Card | Isi | Prioritas |
|---|---|---|
| Jumlah Siswa di Rombel (StatCard) | Jumlah siswa + ikon orang (biru) | Tinggi |
| Rekap Absensi Pekan Ini (StatCard) | Hadir / Izin / Sakit / Alpa + ikon status (hijau) | Tinggi |
| Rekap Nilai Tengah Semester (StatCard) | Rata-rata nilai kelas + ikon nilai (hijau) | Sedang |
| Data Siswa (QuickActionCard) | Navigasi ke Data Siswa | Sedang |
| Absensi (QuickActionCard) | Navigasi ke Absensi | Sedang |
| Leger Penilaian (QuickActionCard) | Navigasi ke Leger | Sedang |
| Laporan Kelas (QuickActionCard) | Navigasi ke Laporan | Sedang |

### Tabel yang Digunakan

Tabel daftar siswa di content area menampilkan:

| Kolom | Keterangan |
|---|---|
| No | Nomor urut |
| NIS | Nomor Induk Siswa |
| Nama Siswa | Nama lengkap siswa |
| Absensi Pekan Ini | Badge warna (hijau = lengkap, kuning = belum lengkap) |
| Nilai Rata-Rata | Nilai numerik |
|status | Badge (Aktif, Cuti, dll.) |

### Quick Action yang Digunakan

1. Data Siswa → `/data/siswa`
2. Absensi → `/absensi`
3. Leger → `/leger`
4. Laporan → `/laporan/absensi` dan `/laporan/leger`

---

## 4. Dashboard Siswa

### Struktur Layout

```
┌─────────────────────────────────────────────────────────┐
│ Topbar (Nama Aplikasi, Profil, Logout)                  │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │  Row 1: Info Pribadi Card                   │
│ Navigasi │  - Foto profil                               │
│ (terbatas)│  - Nama, kelas, rombel                      │
│          │──────────────────────────────────────────────│
│          │  Row 2: Quick Action Cards (4 kolom)        │
│ Siswa    │  Jadwal | Absensi | Nilai | Profil           │
│ Menu     │──────────────────────────────────────────────│
│          │  Row 3: Informasi Terbaru                    │
│          │  - Jadwal mengajar terdekat (hari ini)       │
│          │  - Rekap absensi bulan ini                  │
│          │  - Nilai terbaru yang sudah dipublikasikan   │
└──────────┴──────────────────────────────────────────────┘
```

### Komponen yang Tampil

- Info Pribadi Card (profil ringkas)
- Quick Action Card (4 kartu navigasi)
- Jadwal mengajar terdekat (list)
- Rekap absensi bulan ini (statistik mini)
- Nilai terbaru yang dipublikasikan (tabel ringkas)

### Prioritas Informasi

1. **Jadwal mengajar terdekat** — siswa perlu tahu kelas berikutnya.
2. **Rekap absensi bulan ini** — siswa memantau kehadiran pribadinya.
3. **Nilai terbaru** — siswa melihat perkembangan akademik.
4. **Info pribadi** — profil dasar.

### Card yang Digunakan

| Card | Isi | Prioritas |
|---|---|---|
| Info Pribadi | Foto, nama, kelas, rombel, NIS | Tinggi |
| Jadwal (QuickActionCard) | Navigasi ke Jadwal | Tinggi |
| Absensi (QuickActionCard) | Navigasi ke Absensi | Tinggi |
| Nilai (QuickActionCard) | Navigasi ke Nilai | Tinggi |
| Profil (QuickActionCard) | Navigasi ke Profil | Sedang |

### Tabel yang Digunakan

Tabel nilai ringkas di content area menampilkan:

| Kolom | Keterangan |
|---|---|
| Mata Pelajaran | Nama mata pelajaran |
| Komponen | Harian / Tengah Semester / Akhir Semester (badge warna) |
| Nilai | Nilai siswa |
| Nilai Akhir | Nilai akhir per mata pelajaran |

### Quick Action yang Digunakan

1. Jadwal → `/siswa/jadwal`
2. Absensi → `/siswa/absensi`
3. Nilai → `/siswa/nilai`
4. Profil → `/profil`

---

## 5. Dashboard Orang Tua

### Struktur Layout

```
┌─────────────────────────────────────────────────────────┐
│ Topbar (Nama Aplikasi, Notifikasi, Avatar, Logout)      │
├─────────────┬───────────────────────────────────────────┤
│ Sidebar     │  Row 1: Info Anak Card                   │
│ Navigation  │  - Nama anak                              │
│ (terbatas)  │  - Kelas & rombel                         │
│             │  - Wali kelas                              │
│             │───────────────────────────────────────────│
│             │  Row 2: Quick Action Cards (3 kolom)      │
│ Orang Tua   │  Absensi Anak | Nilai Anak | Profil Anak  │
│ Menu        │───────────────────────────────────────────│
│             │  Row 3: Content Area                      │
│             │  - Ringkasan absensi anak (badge)         │
│             │  - Nilai terbaru anak per mata pelajaran  │
│             │  - Pengumuman sekolah (terbatas)          │
└─────────────┴───────────────────────────────────────────┘
```

### Komponen yang Tampil

- Info Anak Card (profil ringkas anak yang terhubung)
- Quick Action Card (3 kartu navigasi)
- Ringkasan absensi anak (badge warna: hijau = baik, kuning = perlu perhatian)
- Nilai terbaru anak (tabel ringkas)
- Pengumuman sekolah (terbatas, hanya pengumuman umum)

### Prioritas Informasi

1. **Ringkasan absensi anak** — orang tua memantau disiplin kehadiran anak.
2. **Nilai terbaru anak** — orang tua melihat perkembangan akademik anak.
3. **Informasi anak** — profil, kelas, rombel, wali kelas.
4. **Pengumuman sekolah** — informasi umum yang relevan untuk anak.

### Card yang Digunakan

| Card | Isi | Prioritas |
|---|---|---|
| Info Anak | Nama anak, kelas, rombel, wali kelas | Tinggi |
| Absensi Anak (QuickActionCard) | Navigasi ke Rekap Absensi Anak | Tinggi |
| Nilai Anak (QuickActionCard) | Navigasi ke Rekap Nilai Anak | Tinggi |
| Profil Anak (QuickActionCard) | Navigasi ke Profil Anak | Sedang |
| Pengumuman | List pengumuman umum | Rendah |

### Tabel yang Digunakan

Tabel nilai ringkas di content area menampilkan anak:

| Kolom | Keterangan |
|---|---|
| Mata Pelajaran | Nama mata pelajaran |
| Semester | Semester berjalan (badge) |
| Nilai Akhir | Nilai akhir anak |
| Status | Badge (Bagus / Perlu Perhatian / Kurang) |

### Quick Action yang Digunakan

1. Rekap Absensi Anak → `/orang-tua/anak/:id/absensi`
2. Nilai Anak → `/orang-tua/anak/:id/nilai`
3. Profil Anak → `/orang-tua/anak/:id`

---

## Catatan Penggunaan Pola

- Tidak ada dashboard role yang identik secara persis. Setiap pola disesuaikan dengan kebutuhan informasi role masing-masing.
- Semua pola mengikuti struktur layout yang sama: StatCard → QuickActionCard → Content Area.
- Jumlah StatCard bervariasi berdasarkan jumlah informasi paling penting untuk setiap role (Admin: 4, Guru: 3, Wali Kelas: 3, Siswa: tidak ada stat card di dashboard utama, Orang Tua: tidak ada stat card di dashboard utama).
- Quick Action Card menampilkan navigasi ke modul yang paling sering digunakan oleh role tersebut.
- Content Area menampilkan informasi kontekstual (agenda guru, daftar siswa wali kelas, jadwal siswa, ringkasan orang tua).