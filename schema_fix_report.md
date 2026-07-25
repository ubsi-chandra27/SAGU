# Schema Fix Report

## Perubahan yang Dilakukan

### 1. attendanceSummary String? -> Json?
- **File:** `prisma/schema.prisma`
- **Model:** `Rapor`
- **Sebelum:** `attendanceSummary String? @map("attendance_summary") @db.Json`
- **Sesudah:** `attendanceSummary Json? @map("attendance_summary") @db.Json`
- **Alasan:** Tipe field harus sesuai dengan annotation `@db.Json`. `String?` tidak sesuai untuk penyimpanan data JSON.

### 2. oldValues String? -> Json?
- **File:** `prisma/schema.prisma`
- **Model:** `AuditLog`
- **Sebelum:** `oldValues String? @map("old_values") @db.Json`
- **Sesudah:** `oldValues Json? @map("old_values") @db.Json`
- **Alasan:** Tipe field harus sesuai dengan annotation `@db.Json`.

### 3. newValues String? -> Json?
- **File:** `prisma/schema.prisma`
- **Model:** `AuditLog`
- **Sebelum:** `newValues String? @map("new_values") @db.Json`
- **Sesudah:** `newValues Json? @map("new_values") @db.Json`
- **Alasan:** Tipe field harus sesuai dengan annotation `@db.Json`.

### 4. Relasi User ↔ Attendance yang ambigu
- **File:** `prisma/schema.prisma`
- **Model:** `User`
- **Sebelum:** `attendances Attendance[]`
- **Sesudah:** `attendances Attendance[] @relation("AttendanceRecorder")`
- **Alasan:** `Attendance.recorder` menggunakan nama relasi `"AttendanceRecorder"`, tetapi `User.attendances` tidak memiliki nama relasi yang sama. Ini menyebabkan relasi ambigu karena Prisma tidak dapat mencocokkan inverse relation dengan benar. Penambahan `@relation("AttendanceRecorder")` pada `User.attendances` membuat hubungan menjadi eksplisit dan tidak ambigu.

### 5. Setting.schoolId one-to-one
- **File:** `prisma/schema.prisma`
- **Model:** `Setting`
- **Sebelum:** `@@unique([schoolId, key])`
- **Sesudah:** `@@unique([schoolId])`
- **Alasan:** `School.settings Setting?` mendeklarasikan relasi one-to-one. Namun batasan unik komposit `@@unique([schoolId, key])` memungkinkan beberapa record Setting per sekolah (berbeda key), yang secara efektif membuatnya one-to-many. Mengubah menjadi `@@unique([schoolId])` menegakkan hubungan one-to-one yang konsisten dengan deklarasi relasi `School.settings Setting?`.

### 6. Student.userId one-to-one
- **File:** `prisma/schema.prisma`
- **Model:** `Student`
- **Sebelum:** Tidak ada `@@unique([userId])`
- **Sesudah:** `@@unique([userId])` ditambahkan
- **Alasan:** `User.student Student?` mendeklarasikan relasi one-to-one. Agar Prisma dapat menegakkan hubungan one-to-one, `Student.userId` harus memiliki batasan unik. Penambahan `@@unique([userId])` memastikan setiap user hanya dapat dikaitkan dengan satu student.

## Hasil Prisma Format

```
Prisma schema loaded from prisma\schema.prisma
```

`prisma format` berhasil memuat dan memformat schema. Terdapat 2 error validasi pre-existing yang tidak terkait dengan perubahan yang dilakukan:
- `User.FormativeAssessment` missing opposite relation field pada `FormativeAssessment`
- `FormativeAssessment.recorder` missing opposite relation field pada `User`

## Hasil Prisma Validate

```
Validation Error Count: 25
```

`prisma validate` menemukan 25 error validasi. Semua error adalah **pre-existing** dan tidak diperkenalkan oleh perubahan yang dilakukan. Error terkait dengan missing opposite relation fields pada beberapa model (misalnya `Class` ↔ `TeachingAssignment`, `Subject` ↔ `GradingComponent`, dll).

**Tidak ada error baru yang diperkenalkan oleh 6 perubahan yang dilakukan.**

## Ringkasan

| No | Perubahan | Status |
|----|-----------|--------|
| 1 | attendanceSummary String? -> Json? | ✅ Selesai |
| 2 | oldValues String? -> Json? | ✅ Selesai |
| 3 | newValues String? -> Json? | ✅ Selesai |
| 4 | Relasi User ↔ Attendance ambigu | ✅ Selesai |
| 5 | Setting.schoolId one-to-one | ✅ Selesai |
| 6 | Student.userId one-to-one | ✅ Selesai |