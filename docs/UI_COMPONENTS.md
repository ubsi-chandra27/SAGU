# UI Components Reference

## Referensi Komponen UI SAGU

Dokumen ini mendefinisikan komponen-komponen antarmuka pengguna yang akan digunakan dalam aplikasi SAGU. Komponen-komponen ini dirancang untuk konsistensi visual dan perilaku di seluruh dashboard role.

## Komponen Tata Letak

### Sidebar

Navigasi utama aplikasi yang menampilkan menu berdasarkan role pengguna.

- Berada di sisi kiri pada layar desktop.
- Collapse menjadi ikon saja pada ukuran layar tertentu.
- Toggle hamburger menu pada layar mobile.
- Menampilkan ikon dan label untuk setiap item menu.
- Item menu aktif ditandai dengan highlight dan tooltip.
- Mendukung menu bersarang (sub-menu) untuk modul dengan banyak sub-halaman.
- Menampilkan nama modul dan ikon yang konsisten.
- Item menu yang tidak relevan untuk role pengguna disembunyikan.

### Header

Header atas yang konsisten di semua halaman.

- Menampilkan nama aplikasi (SAGU) di sisi kiri.
- Menampilkan profil pengguna (avatar, nama, role) di sisi kanan.
- Menu dropdown profil dengan opsi: Profil, Ubah Password, Logout.
- Notifikasi sistem dengan badge angka (jika ada).
- Toggle sidebar pada layar mobile.

### Layout Wrapper

Container utama yang membungkus konten halaman.

- Sidebar + Header + Main Content area.
- Main content scrollable jika konten melebihi viewport.
- Padding dan spacing konsisten.
- Mendukung full-width dan boxed layout (maksimum width).

### Breadcrumb

Hierarki navigasi untuk konteks halaman saat ini.

- Ditampilkan di bagian atas area konten.
- Setiap level breadcrumb dapat diklik untuk navigasi.
- Level terakhir menunjukkan halaman saat ini (bukan link).
- Contoh: Beranda > Data Guru > Detail Guru

## Komponen Data tampilan

### StatCard

Kartu ringkasan statistik untuk dashboard.

- Menampilkan angka utama (total guru, total siswa, dll.).
- Menampilkan label deskriptif.
- Opsional: ikon, tren naik/turun, atau perubahan persentase.
- Mendukung warna tematik (biru, hijau, kuning, merah).

### DataTable

Tabel data generik dengan fitur standar.

- Header kolom yang jelas dan konsisten.
- Paginasi (halaman sebelumnya/berikutnya, nomor halaman).
- Informasi jumlah data: "Menampilkan 1-20 dari 150 data".
- Kolom pencarian di bagian atas tabel.
- Filter kolom individual (dropdown per kolom).
- Sorting pada header kolom (asc/desc).
- Aksi per baris (edit, hapus, lihat).
- Loading state saat data dimuat.
- Empty state ketika tidak ada data.
- Responsive: scroll horizontal pada layar kecil.

### Modal

Dialog overlay untuk formulir dan konfirmasi.

- Judul modal yang deskriptif.
- Body modal untuk konten (form, detail, konfirmasi).
- Footer modal dengan tombol aksi (Simpan, Batal, Hapus).
- Tombol tutup (X) di pojok kanan atas.
- Klik di luar modal menutup modal (opsional, tergantung konteks).
- Escape key menutup modal (kecuali aksi kritis).

### Form

Komponen formulir untuk input data.

- Label untuk setiap field input dengan tanda asterisk (*) untuk field wajib.
- Input text, number, email, password, select, textarea sesuai kebutuhan.
- Placeholder yang deskriptif di setiap field.
- Validasi real-time (inline error messages).
- Help text untuk field yang memerlukan penjelasan.
- Tombol aksi utama (Simpan) dan sekunder (Batal).
- Loading state pada tombol submit selama proses penyimpanan.

### Card

Container konten umum untuk mengelompokkan informasi.

- Header card (opsional) dengan judul.
- Body card untuk konten utama.
- Footer card (opsional) untuk aksi terkait.
- Border dan shadow untuk visual hierarchy.
- Dapat berisi teks, gambar, tabel, grafik, atau komponen lain.

## Komponen Navigasi

### NavItem

Item menu tunggal dalam sidebar.

- Ikon di sisi kiri.
- Label teks di sisi kanan ikon.
- State aktif ditandai dengan highlight dan/atau badge.
- Tooltip saat sidebar collapse pada hover.

### SubMenu

Menu bersarang di bawah item menu utama.

- Indentasi visual untuk membedakan dari menu induk.
- Memperluas (expand) atau menyembunyikan (collapse) saat klik.
- Anak panah atau ikon chevron untuk menunjukkan expand/collapse state.

## Komponen Status

### Badge

Label kecil untuk status atau jumlah.

- Warna berdasarkan status: hijau (sukses/aktif), kuning (peringatan), merah (bahaya/tidak aktif), abu-abu (inactive).
- Dapat menampilkan angka (jumlah notifikasi, jumlah data).
- Ukuran kecil, tidak mengganggu layout utama.

### Alert / Toast

Notifikasi untuk informasi, peringatan, atau kesalahan.

- Toast untuk pesan singkat (sukses, error, info, warning).
- Auto-dismiss setelah 3-5 detik.
- Tombol close manual tersedia.
- Alert untuk pesan yang lebih penting dan tidak otomatis hilang.
- Posisi toast di pojok kanan atas atau bagian atas konten.
- Ikon yang sesuai untuk setiap tipe alert.

### Empty State

Tampilan saat tidak ada data.

- Ikon ilustratif yang relevan.
- Teks deskriptif: "Belum ada data guru" atau "Tidak ada siswa di rombel ini".
- Tombol aksi jika relevan: "Tambah Guru", "Buat Rombel", dll.

### Error State

Tampilan saat terjadi kesalahan.

- Pesan error yang jelas dan mudah dipahami.
- Tidak menampilkan detail teknis ke pengguna akhir.
- Tombol retry jika relevan.
- Link ke halaman sebelumnya atau beranda.

## Komponen Aksi

### Button

Tombol untuk berbagai aksi.

- Button utama (primary): warna brand, untuk aksi utama (Simpan, Buat).
- Button sekunder (secondary): outline, untuk aksi alternatif (Batal).
- Button bahaya (danger): warna merah, untuk aksi destruktif (Hapus).
- Button ghost: tanpa border, untuk aksi sekunder ringan.
- Ukuran: default, small, large.
- Loading state pada tombol yang memicu operasi berjalan.
- Disabled state untuk aksi yang tidak tersedia.

### Dropdown

Menu dropdown untuk aksi dan filter.

- Trigger berdasarkan klik atau hover.
- Item dropdown berisi teks dan opsional ikon.
- Dividers pemisah antar kelompok item.
- Dropdown dapat berisi submenu atau aksi berbahaya (dengan konfirmasi).

### Search Input

Field pencarian untuk menyaring data.

- Placeholder teks: "Cari..." atau "Search...".
- Ikon search di dalam field.
- Mendukung autofocus saat halaman dimuat (opsional).
- Clear button untuk mengosongkan pencarian.

## Komponen Khusus Dashboard

### QuickActionCard

Kartu aksi cepat untuk dashboard.

- Ikon besar di tengah.
- Label deskriptif di bawah ikon.
- Badge jumlah data terkait.
- Navigasi ke halaman terkait saat diklik.
- Warna ikon konsisten dengan modulnya.

### RecentActivityList

Daftar aktivitas terbaru atau notifikasi.

- Item aktivitas dengan timestamp.
- Ikon status (success, warning, error).
- Deskripsi singkat aktivitas.
- Link ke detail jika relevan.

## Pedoman Penggunaan

- Semua komponen harus konsisten secara visual di seluruh role.
- Spacing, sizing, dan warna harus mengikuti design system.
- Komponen harus accessible (keyboard navigable, ARIA labels).
- Responsive behavior harus diuji pada ukuran layar desktop, tablet, dan mobile.
- Komponen tidak boleh bergantung pada data yang belum dimuat (skeleton loading atau placeholder).