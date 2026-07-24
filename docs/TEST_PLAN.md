# Test Plan

## Rencana Pengujian SAGU

Dokumen ini mendefinisikan strategi dan rencana pengujian untuk aplikasi SAGU, mencakup pengujian unit, integrasi, role-based testing, dan pengujian laporan.

## Strategi Pengujian

### Pendekatan

Uji berlapis (layered testing) dengan empat tingkat:

1. Unit Test — menguji fungsi dan metode secara terpisah.
2. Integration Test — menguji interaksi antar modul dan database.
3. Role-Based Test — menguji bahwa setiap role memiliki akses sesuai permission.
4. End-to-End Test — menguji alur kerja utama dari perspektif pengguna.

### Alat Pengujian

Spesifikasi alat akan mengikuti keputusan stack teknologi. Alat yang disarankan:

- **Unit/Integration**: Framework pengujian bawaan stack backend (contoh: Jest, PHPUnit).
- **API Testing**: Postman, Insomnia, atau alat otomatisasi API.
- **E2E Testing**: Cypress, Playwright, atau Selenium.

## Cakupan Pengujian

### 1. Pengujian Autentikasi

| Skenario | Expected Result |
|---|---|
| Login dengan kredensial valid | Token diterbitkan, user diarahkan ke dashboard |
| Login dengan password salah | Pesan error, token tidak diterbitkan |
| Login dengan user nonaktif | Pesan error akun tidak aktif |
| Akses API tanpa token | HTTP 401 |
| Akses API dengan token kedaluwarsa | HTTP 401 |
| Logout | Token di-invalidasi, user diarahkan ke login |
| Refresh token valid | Token baru diterbitkan |
| Refresh token kedaluwarsa | Pengguna harus login ulang |

### 2. Pengujian RBAC

| Skenario | Expected Result |
|---|---|
| Admin mengakses `/api/v1/data/guru` | 200 OK |
| Admin membuat guru baru | 201 Created |
| Guru mengakses `/api/v1/pengguna` | 403 Forbidden |
| Siswa mengakses `/api/v1/pengaturan` | 403 Forbidden |
| Orang Tua mengakses data siswa lain | 403 Forbidden |
| Wali Kelas mengakses data rombelnya | 200 OK |
| Wali Kelas mengakses data rombel lain | 403 Forbidden |

### 3. Pengujian CRUD Data Master

#### Guru

| Skenario | Expected Result |
|---|---|
| Admin membuat guru dengan data lengkap | 201 Created |
| Admin membuat guru tanpa field wajib | 422 Validation Error |
| Admin memperbarui guru | 200 OK |
| Admin menghapus guru | Soft delete, data masih ada di database |
| Guru melihat daftar guru | 200 OK |
| Guru melihat detail diri sendiri | 200 OK |

#### Siswa

| Skenario | Expected Result |
|---|---|
| Admin membuat siswa dengan NIS unik | 201 Created |
| Admin membuat siswa dengan NIS duplikat | 422 Validation Error |
| Admin menghapus siswa | Soft delete |
| Siswa mengakses data diri sendiri | 200 OK |
| Siswa mengakses data siswa lain | 403 Forbidden |

### 4. Pengujian Absensi

| Skenario | Expected Result |
|---|---|
| Guru mencatat absensi siswa hadir | 201 Created |
| Guru mencatat absensi tanpa memilih status | 422 Validation Error |
| Guru mengedit absensi miliknya sendiri | 200 OK |
| Guru mengedit absensi guru lain | 403 Forbidden |
| Wali Kelas melihat rekap absensi rombelnya | 200 OK |
| Siswa melihat absensi sendiri | 200 OK |
| Orang Tua melihat absensi anaknya | 200 OK |

### 5. Pengujian Penilaian

| Skenario | Expected Result |
|---|---|
| Guru menginput nilai dengan skor valid | 201 Created |
| Guru menginput nilai dengan skor melebihi maksimal | 422 Validation Error |
| Guru mengubah nilai | 200 OK |
| Siswa melihat nilai sendiri | 200 OK |
| Orang Tua melihat nilai anak | 200 OK |
| Wali Kelas melihat rekap nilai rombel | 200 OK |
| Guru mengakses nilai rombel yang bukan ditugaskan | 403 Forbidden |

### 6. Pengujian Laporan

| Skenario | Expected Result |
|---|---|
| Admin menghasilkan laporan data guru | 200 OK, data lengkap |
| Admin menghasilkan laporan data siswa | 200 OK, data lengkap |
| Admin mengekspor laporan PDF | File PDF terunduh |
| Admin mengekspor laporan spreadsheet | File XLSX terunduh |
| Guru menghasilkan laporan untuk kelasnya | 200 OK |
| Wali Kelas menghasilkan laporan rombelnya | 200 OK |
| Siswa mengakses laporan global | 403 Forbidden |

### 7. Pengujian Pengaturan

| Skenario | Expected Result |
|---|---|
| Admin membuat tahun ajaran baru | 201 Created |
| Admin menambahkan semester | 201 Created |
| Admin memperbarui pengaturan sekolah | 200 OK |
| Guru mengakses halaman pengaturan | 403 Forbidden |
| Siswa mengakses halaman pengaturan | 403 Forbidden |

### 8. Pengujian Soft Delete

| Skenario | Expected Result |
|---|---|
| Admin menghapus guru | Guru tidak muncul di daftar, tapi masih ada di database |
| Admin memulihkan guru yang dihapus | Guru muncul kembali di daftar |
| Data yang di-delete tidak terlihat oleh role selain Admin | Terbukti |

### 9. Pengujian Audit Log

| Skenario | Expected Result |
|---|---|
| Admin membuat guru baru | Entri di `audit_logs` tercatat |
| Guru memperbarui nilai siswa | Entri di `audit_logs` tercatat dengan perubahan nilai |
| Admin menghapus rombel | Entri di `audit_logs` tercatat |
| Pengguna login gagal (3x berturut-turut) | Entri di `audit_logs` tercatat |

### 10. Pengujian Validasi Input

| Skenario | Expected Result |
|---|---|
| NIS kosong | 422 Validation Error |
| NISN duplikat | 422 Validation Error |
| Email tidak valid pada input orang tua | 422 Validation Error |
| Nilai di luar rentang skor | 422 Validation Error |
| Tanggal absensi di masa depan | 422 Validation Error |
| Password terlalu pendek | 422 Validation Error |

## Lingkungan Pengujian

### Test Environment

- Database terpisah dari produksi.
- Seed data untuk seluruh role dan data master contoh.
- Mock external service jika digunakan.

### Test Data

- Data uji mencakup seluruh 5 role.
- Data uji mencakup tahun ajaran aktif dan non-aktif.
- Data uji mencakup siswa dengan berbagai status absensi.
- Data uji mencakup nilai dengan berbagai komponen penilaian.

## Definisi Selesai Pengujian

- Semua unit test lulus.
- Semua integration test lulus.
- Semua role-based test lulus (tidak ada akses tidak sah).
- Critical dan high-priority bugs ditangani sebelum rilis.
- Test coverage minimal 80% untuk service layer.