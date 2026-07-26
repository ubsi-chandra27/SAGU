# Audit Dashboard SAGU

Audit ini memeriksa implementasi aktual Dashboard Admin dan Dashboard Guru sebelum pembangunan Data Master Akademik. Audit dilakukan terhadap kode, route runtime, query database pembanding, screenshot, RBAC, responsivitas, dan quality gate teknis.

## 1. Ringkasan Eksekutif

Status: NOT READY

Dashboard Admin dan Dashboard Guru sudah tersedia sebagai fondasi awal dan dapat diakses sesuai role. Namun dashboard belum siap sebagai dashboard operasional karena data masih hard-coded di komponen halaman, belum ada query/service/API dashboard, sebagian besar menu masih dead link `#`, tidak ada topbar, breadcrumb, collapse sidebar, drawer mobile, chart, tabel, aktivitas terbaru, loading state, empty state, atau error state.

Temuan utama:

| Severity | Ringkasan |
|---|---|
| HIGH | Statistik Dashboard Admin dan Guru masih hard-coded, bukan hasil query database atau API. |
| HIGH | Menu Data Guru, Data Siswa, Rombel, Agenda Mengajar, Absensi, dan Penilaian masih `href="#"`. |
| HIGH | Dashboard Guru belum mendukung alur jadwal hari ini -> mulai pertemuan -> absensi -> jurnal mengajar -> selesai pertemuan. |
| MEDIUM | Tidak ada topbar/profile menu, breadcrumb, collapse sidebar, atau drawer mobile. |
| MEDIUM | Tidak ada loading, empty, dan error state pada dashboard. |
| LOW | Visual responsif tidak overflow, tetapi dashboard masih terlalu sederhana dan belum memiliki hierarchy operasional. |

## 2. Arsitektur Dashboard Aktual

Route dashboard yang tersedia di build:

| Route | Status Build | Sumber |
|---|---|---|
| `/dashboard/admin` | Ada, static page | `src/app/dashboard/admin/page.tsx` |
| `/dashboard/guru` | Ada, static page | `src/app/dashboard/guru/page.tsx` |
| `/dashboard/admin/pengaturan/branding-login` | Ada, admin setting page | `src/app/dashboard/admin/pengaturan/branding-login/page.tsx` |

Arsitektur aktual:

| Komponen | Kondisi Aktual | Bukti |
|---|---|---|
| Dashboard page | Server component statis yang membuat array `stats` lokal. | `src/app/dashboard/admin/page.tsx:5-11`, `src/app/dashboard/guru/page.tsx:5-11` |
| Layout | Client component `DashboardLayout` menerima prop `role`. | `src/components/dashboard/dashboard-layout.tsx:8-14` |
| Sidebar | Menu ditentukan dari object lokal `menuItems`. | `src/components/dashboard/dashboard-layout.tsx:26-40` |
| Logout | Tombol memanggil `/api/v1/auth/logout`, lalu redirect ke `/login`. | `src/components/dashboard/dashboard-layout.tsx:17-23` |
| RBAC awal | Middleware membaca role route `/dashboard/admin` dan `/dashboard/guru`. | `src/middleware.ts:24-29`, `src/middleware.ts:100-107` |
| Proteksi token | Middleware memverifikasi token via helper Edge JWT. | `src/middleware.ts:92-98`, `src/lib/auth/edge-jwt.ts:81-119` |
| Sumber data dashboard | Tidak ada Prisma/API/service dashboard yang dipakai halaman. | Import halaman hanya layout, Badge, Card, tokens: `src/app/dashboard/admin/page.tsx:1-3`, `src/app/dashboard/guru/page.tsx:1-3` |

## 3. Audit Dashboard Admin

Inventarisasi elemen aktual:

| Elemen | Kondisi Aktual | Sumber Data | Route/Tindakan | Loading/Empty/Error | Relevansi Admin |
|---|---|---|---|---|---|
| Header | Badge `Admin`, H1 `Dashboard Admin`, deskripsi ringkasan. | Statis di JSX. | Tidak ada tindakan. | Tidak ada. | Relevan sebagai identitas halaman. |
| Welcome banner | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Perlu ditambahkan untuk konteks sekolah/user. |
| Statistik | 4 card: Total Pengguna 5, Total Siswa 1, Total Guru 1, Rombel Aktif 1. | Hard-coded array `stats`. | Tidak clickable. | Tidak ada. | Relevan, tetapi belum terhubung database. |
| Card | 4 `Card` dari komponen UI. | Hard-coded. | Tidak ada. | Tidak ada. | Struktur dasar cukup dipertahankan. |
| Chart | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Belum mendukung analisis Admin. |
| Tabel | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Belum ada daftar data prioritas. |
| Menu cepat | Tidak tersedia di konten utama. | Tidak ada. | Tidak ada. | Tidak ada. | Perlu untuk Data Guru/Siswa/Rombel. |
| Aktivitas terbaru | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Perlu model/service audit log/aktivitas. |
| Notifikasi | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Perlu untuk data belum lengkap. |
| Tombol | Hanya `Keluar` di sidebar. | Client fetch logout. | POST `/api/v1/auth/logout`. | Tidak ada loading state logout. | Relevan. |
| Tautan | Dashboard dan Branding Login valid; Data Guru/Siswa/Rombel `#`. | Static menu. | Dead link untuk 3 menu. | Tidak ada. | Harus dibuat sebelum Data Master selesai. |
| Sidebar | Ada. | Static menu berdasarkan role prop. | Sebagian valid. | Tidak ada active state berbasis route nyata. | Perlu icons/active state/collapse. |
| Topbar | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Perlu untuk profil, sekolah, breadcrumb. |

Bukti utama:

- `src/app/dashboard/admin/page.tsx:6-11` mendefinisikan statistik langsung di array.
- `src/app/dashboard/admin/page.tsx:47-62` melakukan render card dari array lokal.
- `src/components/dashboard/dashboard-layout.tsx:27-33` mendefinisikan menu Admin, dengan `Data Guru`, `Data Siswa`, dan `Rombel` masih `href="#"`.

## 4. Audit Dashboard Guru

Inventarisasi elemen aktual:

| Elemen | Kondisi Aktual | Sumber Data | Route/Tindakan | Loading/Empty/Error | Relevansi Guru |
|---|---|---|---|---|---|
| Header | Badge `Guru`, H1 `Dashboard Guru`, deskripsi ringkasan. | Statis di JSX. | Tidak ada tindakan. | Tidak ada. | Relevan sebagai identitas halaman. |
| Jadwal hari ini | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Wajib untuk alur mengajar. |
| Jadwal berikutnya | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Wajib untuk perencanaan guru. |
| Aktivitas mengajar | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Belum mendukung operasional. |
| Absensi | Hanya menu sidebar `Absensi` dengan `href="#"`. | Static menu. | Dead link. | Tidak ada. | Belum dapat dipakai. |
| Jurnal | Tidak tersedia di UI dashboard. | Tidak ada. | Tidak ada. | Tidak ada. | Belum dapat dipakai. |
| Penilaian | Hanya menu sidebar `Penilaian` dengan `href="#"`. | Static menu. | Dead link. | Tidak ada. | Belum dapat dipakai. |
| Statistik | 4 card: Mata Pelajaran 1, Rombel 1, Pertemuan 2, Siswa 1. | Hard-coded array `stats`. | Tidak clickable. | Tidak ada. | Relevan, tetapi belum terhubung penugasan guru. |
| Chart | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Belum ada ringkasan mingguan. |
| Menu cepat | Tidak tersedia di konten utama. | Tidak ada. | Tidak ada. | Tidak ada. | Perlu untuk mulai pertemuan/absensi/jurnal. |
| Tombol tindakan | Hanya logout. | Client fetch logout. | POST `/api/v1/auth/logout`. | Tidak ada loading state logout. | Perlu tombol mengajar. |
| Sidebar | Ada menu role Guru. | Static role prop. | Dashboard valid, lainnya `#`. | Tidak ada active state nyata. | Perlu route operasional. |
| Topbar | Tidak tersedia. | Tidak ada. | Tidak ada. | Tidak ada. | Perlu profil dan konteks jadwal. |

Evaluasi alur Guru:

| Alur | Status Aktual | Bukti |
|---|---|---|
| Jadwal hari ini | Belum ada. | Tidak ada kode jadwal di `src/app/dashboard/guru/page.tsx:1-67`. |
| Mulai pertemuan | Belum ada tombol/state. | Hanya render stat card di `src/app/dashboard/guru/page.tsx:40-63`. |
| Absensi | Belum ada halaman/tombol aktif. | Menu `Absensi` masih `href="#"` di `src/components/dashboard/dashboard-layout.tsx:37`. |
| Jurnal mengajar | Belum ada UI. | Model `TeachingJournal` ada di `prisma/schema.prisma:502`, tetapi dashboard tidak memakainya. |
| Selesaikan pertemuan | Belum ada. | Tidak ada action/route terkait di dashboard Guru. |

## 5. Data Dummy dan Placeholder

| Lokasi | Elemen | Data Aktual | Sumber Data | Status | Rekomendasi |
|---|---|---|---|---|---|
| `src/app/dashboard/admin/page.tsx:6-11` | Statistik Admin | `5`, `1`, `1`, `1` | Array hard-coded | Dummy/statis | Ganti dengan query/service dashboard Admin. |
| `src/app/dashboard/guru/page.tsx:6-11` | Statistik Guru | `1`, `1`, `2`, `1` | Array hard-coded | Dummy/statis | Ganti dengan query berdasarkan user Guru dan teaching assignment. |
| `src/components/dashboard/dashboard-layout.tsx:29` | Menu Data Guru | `href="#"` | Static menu | Placeholder/dead link | Arahkan ke route Data Guru setelah modul dibuat. |
| `src/components/dashboard/dashboard-layout.tsx:30` | Menu Data Siswa | `href="#"` | Static menu | Placeholder/dead link | Arahkan ke route Data Siswa setelah modul dibuat. |
| `src/components/dashboard/dashboard-layout.tsx:31` | Menu Rombel | `href="#"` | Static menu | Placeholder/dead link | Arahkan ke route Rombel setelah modul dibuat. |
| `src/components/dashboard/dashboard-layout.tsx:36` | Menu Agenda Mengajar | `href="#"` | Static menu | Placeholder/dead link | Buat route agenda mengajar Guru. |
| `src/components/dashboard/dashboard-layout.tsx:37` | Menu Absensi | `href="#"` | Static menu | Placeholder/dead link | Buat route absensi per pertemuan. |
| `src/components/dashboard/dashboard-layout.tsx:38` | Menu Penilaian | `href="#"` | Static menu | Placeholder/dead link | Buat route input/rekap nilai. |
| Dashboard Admin | Chart/tabel/aktivitas/notifikasi | Tidak ada | Tidak ada | Belum tersedia | Tambahkan setelah service data master tersedia. |
| Dashboard Guru | Jadwal/pertemuan aktif/jurnal | Tidak ada | Tidak ada | Belum tersedia | Bangun alur Guru setelah modul penugasan dan meeting siap. |

## 6. Navigasi dan Route

| Area | Kondisi Aktual | Bukti | Risiko |
|---|---|---|---|
| Menu Admin | Dashboard dan Branding Login valid; Data Guru/Siswa/Rombel `#`. | `src/components/dashboard/dashboard-layout.tsx:27-33` | User menemukan menu mati saat mulai Data Master. |
| Menu Guru | Dashboard valid; Agenda, Absensi, Penilaian `#`. | `src/components/dashboard/dashboard-layout.tsx:34-39` | Alur Guru belum dapat dijalankan. |
| Active state | Semua link valid diberi background biru; tidak mengecek current pathname. | `src/components/dashboard/dashboard-layout.tsx:60-63` | `Branding Login` dan `Dashboard` bisa terlihat sama aktif jika href bukan `#`. |
| Collapse sidebar | Tidak tersedia. | CSS hanya flex/block responsive: `src/components/dashboard/dashboard-layout.module.css:1-76` | Desktop kecil tidak punya mode compact. |
| Drawer mobile | Tidak tersedia. | Tidak ada button/drawer state di `dashboard-layout.tsx:1-84`. | Mobile menampilkan nav di atas, bukan drawer. |
| Topbar | Tidak tersedia. | Browser audit `hasTopbar=false` di semua viewport. | Tidak ada profil user, sekolah aktif, quick action. |
| Breadcrumb | Tidak tersedia. | Browser audit `hasBreadcrumb=false` di semua viewport. | Admin tidak punya konteks navigasi. |
| Profile menu | Tidak tersedia. | Hanya tombol `Keluar`: `dashboard-layout.tsx:69-76`. | Logout tersedia, tetapi profil/settings belum ada. |
| Logout | Ada dan berhasil secara regression. | `dashboard-layout.tsx:17-23`; RBAC/runtime test logout sebelumnya PASS. | Perlu loading/error state minor. |
| Menu berdasarkan role | Admin tidak melihat menu Guru; Guru tidak melihat Branding Login. | `dashboard-layout.tsx:26-40` | Baik sebagai pemisahan UI awal. |
| Proteksi route | Middleware tetap memblokir akses URL langsung lintas role. | `src/middleware.ts:100-107` | Baik, tidak hanya hide menu. |

## 7. RBAC

Hasil uji runtime:

| Test | Expected | Actual | Status |
|---|---|---|---|
| ADMIN login | 200 role ADMIN | `200 role=ADMIN` | PASS |
| GURU login | 200 role GURU | `200 role=GURU` | PASS |
| ADMIN membuka Dashboard Admin | 200 | `200` | PASS |
| GURU membuka Dashboard Guru | 200 | `200` | PASS |
| GURU membuka Dashboard Admin | Redirect ke `/dashboard/guru` | `307 /dashboard/guru` | PASS |
| ADMIN membuka Dashboard Guru | Redirect ke `/dashboard/admin` | `307 /dashboard/admin` | PASS |
| Tanpa login membuka Dashboard Admin | Redirect ke `/login` | `307 /login` | PASS |
| User valid membuka `/login` | Redirect ke dashboard role | `307 /dashboard/admin` | PASS |
| Redirect loop | Target redirect 200 | Admin target 200, unauth target 200 | PASS |

Catatan:

- Proteksi tidak hanya dilakukan dengan menyembunyikan menu. Middleware memeriksa route role di `src/middleware.ts:24-29` dan menolak role salah di `src/middleware.ts:100-107`.
- Signature JWT diverifikasi sebelum role dipakai di `src/middleware.ts:92-98`.

## 8. Responsivitas dan Visual

Screenshot dibuat di `docs/screenshots/dashboard-audit/`.

| Role | Viewport | Screenshot | Horizontal Overflow | Sidebar | Card | Topbar/Breadcrumb | Status |
|---|---|---|---|---|---|---|---|
| Admin | 1440x900 | `admin-1440.png` | Tidak | Desktop 260px | 4 card satu baris | Tidak ada | PASS WITH NOTES |
| Admin | 1024x768 | `admin-1024.png` | Tidak | Desktop 260px | Card wrap 3+1 | Tidak ada | PASS WITH NOTES |
| Admin | 768x1024 | `admin-768.png` | Tidak | Desktop 260px masih dipakai | Card 2+2 | Tidak ada | PASS WITH NOTES |
| Admin | 360x800 | `admin-360.png` | Tidak | Nav ditumpuk di atas | Card 1 kolom | Tidak ada | PASS WITH NOTES |
| Guru | 1440x900 | `guru-1440.png` | Tidak | Desktop 260px | 4 card satu baris | Tidak ada | PASS WITH NOTES |
| Guru | 1024x768 | `guru-1024.png` | Tidak | Desktop 260px | Card wrap 3+1 | Tidak ada | PASS WITH NOTES |
| Guru | 768x1024 | `guru-768.png` | Tidak | Desktop 260px masih dipakai | Card 2+2 | Tidak ada | PASS WITH NOTES |
| Guru | 360x800 | `guru-360.png` | Tidak | Nav ditumpuk di atas | Card 1 kolom | Tidak ada | PASS WITH NOTES |

Catatan visual:

- Tidak ada horizontal overflow pada semua viewport.
- Card menggunakan radius, border, dan shadow dari komponen `Card`.
- Sidebar tidak memiliki icon, collapse, atau drawer mobile.
- Pada 768px, sidebar desktop 260px masih aktif karena breakpoint mobile baru di `max-width: 720px`; ini masih tidak overflow tetapi area konten menyempit.
- Tidak ada chart/tabel, sehingga tidak ada risiko chart/tabel terpotong saat ini.

## 9. Kesiapan Data Prisma

Query pembanding database aktual:

| Data | Hasil Query Aktual | Model | Status Integrasi Dashboard |
|---|---:|---|---|
| Users | 5 | `User` | Dashboard Admin menampilkan `5`, tetapi hard-coded. |
| Active users | 5 | `User.isActive` | Belum dipakai. |
| Active Guru users | 1 | `User.role=GURU` | Dashboard Admin menampilkan `1`, tetapi hard-coded. |
| Active Siswa users | 1 | `User.role=SISWA` | Dashboard Admin menampilkan `1`, tetapi hard-coded. |
| Teacher records | 1 | `Teacher` | Belum dipakai. |
| Student records | 1 | `Student` | Belum dipakai. |
| Classes | 1 | `Class` | Belum dipakai. |
| Rombels | 1 | `Rombel` | Dashboard Admin menampilkan `1`, tetapi hard-coded. |
| Subjects | 1 | `Subject` | Dashboard Guru menampilkan `1`, tetapi hard-coded. |
| Teaching assignments | 1 | `TeachingAssignment` | Belum dipakai untuk scope Guru. |
| Meetings | 2 | `Meeting` | Dashboard Guru menampilkan `2`, tetapi hard-coded. |
| Attendances | 2 | `Attendance` | Belum dipakai. |
| Teaching journals | 0 | `TeachingJournal` | Belum dipakai dan data belum tersedia. |
| Formative assessments | 2 | `FormativeAssessment` | Belum dipakai. |
| Summative assessments | 3 | `SummativeAssessment` | Belum dipakai. |
| Students without rombel | 1 | `Student.rombelId` | Belum ditampilkan sebagai notifikasi Admin. |

### Sudah tersedia di database

- User, role, status aktif: `User`.
- Guru: `Teacher`, `User.role=GURU`.
- Siswa: `Student`, `User.role=SISWA`.
- Kelas dan rombel: `Class`, `Rombel`.
- Mata pelajaran: `Subject`.
- Penugasan mengajar: `TeachingAssignment`.
- Pertemuan: `Meeting`.
- Absensi: `Attendance`.
- Penilaian formatif/sumatif: `FormativeAssessment`, `SummativeAssessment`.

### Model tersedia tetapi modul CRUD belum tersedia

- Data Guru, Data Siswa, Rombel, Kelas, Mata Pelajaran.
- Penugasan Mengajar.
- Meeting/Agenda Mengajar.
- Absensi.
- Penilaian.

### Membutuhkan model atau struktur tambahan

- Aktivitas terbaru dashboard jika ingin lebih dari audit log teknis: perlu definisi event dashboard.
- Notifikasi operasional seperti "penugasan belum lengkap" perlu query aturan bisnis atau materialized service.
- Jadwal hari ini membutuhkan sumber jadwal/time slot yang eksplisit; saat ini `Meeting` punya tanggal dan waktu, tetapi belum ada modul jadwal rutin.

### Belum dapat dihitung karena fitur sumber belum dibangun

- Pertemuan aktif.
- Absensi belum selesai per pertemuan.
- Jurnal belum selesai.
- Nilai belum lengkap per kelas/mapel.
- Ringkasan mingguan Guru.
- Aktivitas terbaru berbasis aksi user.

## 10. Ketergantungan Modul

| Kebutuhan Dashboard | Modul/Data Prasyarat | Status |
|---|---|---|
| Guru aktif | User/Guru CRUD, status aktif | Model ada, CRUD belum ada. |
| Siswa aktif | User/Siswa CRUD, status aktif | Model ada, CRUD belum ada. |
| Rombel aktif | Rombel CRUD, tahun ajaran/semester aktif | Model ada, konsep aktif rombel belum eksplisit. |
| Mata pelajaran | Subject CRUD | Model ada, CRUD belum ada. |
| Penugasan belum lengkap | TeachingAssignment + validasi kurikulum | Model ada, service belum ada. |
| Siswa belum masuk rombel | Student.rombelId | Model ada, dashboard belum query. |
| Aktivitas terbaru | AuditLog/event feed | Model AuditLog ada, belum dipakai. |
| Jadwal hari ini | Meeting atau jadwal rutin | Meeting ada, jadwal rutin belum jelas. |
| Mulai pertemuan | Meeting state/active session | Belum ada state pertemuan aktif. |
| Absensi belum selesai | Attendance per meeting/rombel | Attendance ada, service belum ada. |
| Jurnal belum selesai | TeachingJournal | Model ada, belum ada data/service. |
| Nilai belum lengkap | Assessment + grading rules | Model ada, service belum ada. |

## 11. Daftar Temuan

| ID | Severity | Role | Lokasi | Temuan | Bukti | Rekomendasi |
|---|---|---|---|---|---|---|
| DSH-001 | HIGH | Admin | `src/app/dashboard/admin/page.tsx:6-11` | Statistik Admin hard-coded. | Array `stats` berisi string angka. | Buat service/query dashboard Admin dari Prisma. |
| DSH-002 | HIGH | Guru | `src/app/dashboard/guru/page.tsx:6-11` | Statistik Guru hard-coded. | Array `stats` lokal. | Query berdasarkan user Guru, assignment, meeting, siswa. |
| DSH-003 | HIGH | Admin | `src/components/dashboard/dashboard-layout.tsx:29-31` | Menu Data Guru/Siswa/Rombel dead link. | `href="#"`. | Implement route Data Master atau disable dengan label "segera". |
| DSH-004 | HIGH | Guru | `src/components/dashboard/dashboard-layout.tsx:36-38` | Menu Agenda/Absensi/Penilaian dead link. | `href="#"`. | Implement route operasional Guru. |
| DSH-005 | HIGH | Guru | `src/app/dashboard/guru/page.tsx:1-67` | Alur jadwal -> mulai pertemuan -> absensi -> jurnal belum ada. | Halaman hanya render header dan stat card. | Bangun flow pertemuan setelah modul meeting/attendance/journal siap. |
| DSH-006 | MEDIUM | Semua | `src/components/dashboard/dashboard-layout.tsx:50-82` | Tidak ada topbar/profile menu/breadcrumb. | Layout hanya aside dan main. | Tambahkan dashboard shell lengkap. |
| DSH-007 | MEDIUM | Semua | `src/components/dashboard/dashboard-layout.module.css:1-76` | Tidak ada collapse sidebar/drawer mobile. | CSS hanya flex desktop dan block mobile. | Tambahkan collapse desktop dan drawer/hamburger mobile. |
| DSH-008 | MEDIUM | Semua | `src/app/dashboard/admin/page.tsx:13-66`, `src/app/dashboard/guru/page.tsx:13-66` | Tidak ada loading, empty, error state. | Halaman statis tanpa fetch/data boundary. | Tambahkan state setelah data async diterapkan. |
| DSH-009 | MEDIUM | Admin | Dashboard Admin | Tidak ada aktivitas terbaru/notifikasi data belum lengkap. | DB query menemukan `studentsWithoutRombel=1`, tetapi UI tidak menampilkan. | Tambahkan insight operasional Admin. |
| DSH-010 | LOW | Semua | Sidebar | Tidak ada icon menu. | Link hanya teks di `dashboard-layout.tsx:55-66`. | Tambahkan icon setelah menu final. |
| DSH-011 | LOW | Semua | Responsive 768px | Sidebar desktop masih aktif pada 768px. | Screenshot `admin-768.png`, `guru-768.png`; breakpoint `max-width:720px`. | Pertimbangkan breakpoint tablet atau compact sidebar. |
| DSH-012 | LOW | Semua | Active state | Active state tidak berbasis pathname. | Background ditentukan oleh `href !== "#"` di `dashboard-layout.tsx:61-63`. | Gunakan `usePathname()` untuk active state aktual. |

## 12. Komponen yang Dipertahankan

- `DashboardLayout` sebagai shell awal berbasis role.
- Komponen `Card`, `Badge`, dan `Button` karena sudah memakai token desain.
- Middleware RBAC dashboard karena runtime test menunjukkan proteksi role bekerja.
- Grid stat card `repeat(auto-fit, minmax(180px, 1fr))` karena responsif dan tidak overflow.
- Logout di sidebar karena berfungsi dan sederhana.

## 13. Komponen yang Perlu Diperbaiki

- Sidebar: tambah icon, active state berbasis route, collapse desktop, drawer mobile.
- Header dashboard: tambahkan konteks user/sekolah dan topbar.
- Stat card: ubah dari hard-coded ke data service.
- Dashboard Admin: tambah alert data belum lengkap, quick action, aktivitas terbaru.
- Dashboard Guru: tambah jadwal hari ini, pertemuan aktif, absensi, jurnal, dan tindakan utama.
- Loading/empty/error state untuk dashboard berbasis data.

## 14. Komponen yang Sebaiknya Dihapus atau Ditunda

- Menu `href="#"` sebaiknya tidak dipertahankan saat masuk fase Data Master; ubah menjadi route nyata atau state disabled yang jelas.
- Chart sebaiknya ditunda sampai data sumber stabil agar tidak menjadi chart dummy.
- Aktivitas terbaru sebaiknya ditunda sampai sumber event/audit disepakati.
- Topbar fitur lengkap dapat dilakukan setelah shell role stabil, tetapi minimal profile/logout context perlu dibuat lebih awal.

## 15. Rekomendasi Urutan Implementasi

1. Perbaikan dashboard shell

- Tambahkan icon sidebar.
- Tambahkan active state berbasis `usePathname()`.
- Tambahkan topbar sederhana berisi role/user dan logout/profile.
- Tambahkan drawer mobile atau compact nav.
- Ganti link `#` menjadi disabled state sementara atau route nyata.

2. Data Master yang wajib tersedia

- CRUD Data Guru.
- CRUD Data Siswa.
- CRUD Kelas/Rombel.
- CRUD Mata Pelajaran.
- Penugasan guru ke mapel/rombel.
- Penempatan siswa ke rombel.

3. Alur Guru yang wajib dibangun

- Jadwal hari ini.
- Detail pertemuan.
- Mulai pertemuan.
- Absensi per pertemuan.
- Jurnal mengajar.
- Selesaikan pertemuan.

4. Integrasi data dashboard

- Service Dashboard Admin: total user/guru/siswa/rombel/mapel, data belum lengkap, aktivitas.
- Service Dashboard Guru: assignment aktif, meeting hari ini, attendance progress, journal status, assessment status.
- Loading/empty/error state.

5. Finalisasi visual

- Konsistensi spacing/card height.
- Responsif tablet 768px.
- Empty state visual.
- Chart hanya jika data final tersedia.

## 16. Hasil Validasi Teknis

| Perintah | Hasil | Bukti Output |
|---|---|---|
| `npx prisma validate` | PASS | `The schema at prisma\\schema.prisma is valid` |
| `npx prisma generate` | PASS | `Generated Prisma Client (v5.22.0)` |
| `npx tsc --noEmit` | PASS | Exit code 0, tanpa error. |
| `npm run lint` | PASS | `No ESLint warnings or errors` |
| `npm run build` | PASS | `Compiled successfully`; route `/dashboard/admin` dan `/dashboard/guru` tercatat di build output. |

## 17. Status Akhir

Dashboard Admin dan Dashboard Guru siap sebagai skeleton/fondasi route dan RBAC, tetapi NOT READY sebagai dashboard operasional sebelum Data Master Akademik.

Yang sudah valid:

- Route dashboard Admin/Guru tersedia.
- Login role Admin/Guru dapat membuka dashboard masing-masing.
- Cross-role dashboard ditolak oleh middleware.
- Unauthenticated dashboard redirect ke `/login`.
- Tidak ada redirect loop pada skenario yang diuji.
- Tidak ada horizontal overflow pada viewport 1440x900, 1024x768, 768x1024, dan 360x800.
- Quality gate teknis PASS.

Yang belum siap:

- Data dashboard belum berasal dari database/service.
- Menu utama banyak yang masih dead link.
- Dashboard Guru belum memiliki alur mengajar.
- Dashboard Admin belum memiliki quick action, aktivitas, notifikasi, chart, atau tabel.
- Shell dashboard belum memiliki topbar, breadcrumb, collapse sidebar, drawer mobile, dan profile menu.

