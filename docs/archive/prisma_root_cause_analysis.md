# Prisma Root Cause Analysis — 25 Relation Errors

Dihasilkan dari: `prisma validate` (Prisma CLI 5.22.0)
Schema: `prisma/schema.prisma`

---

## 1. Akar Masalah Utama

Keseluruhan 25 error memiliki satu pola akar masalah yang sama:

> **Ketika field relation satu-ke-banyak (`ModelA.field ModelB[]`) ditambahkan pada suatu model, field relation kebalikan (back-relation) pada model tujuan tidak ditambahkan.**

Prisma mengharuskan setiap sisi relation satu-ke-banyak memiliki field di model tujuan yang menunjuk kembali ke model sumber. Ketika field sisi-sumber ditambahkan tanpa field sisi-tujuan, Prisma menghasilkan error P1012.

---

## 2. Kelompokan Berdasarkan Akar Masalah

Setiap kelompok mewakili satu target model yang kehilangan field back-relation. Perbaikan dilakukan dengan menambahkan field relation yang sesuai pada model target.

### RC-1: TeachingJournal kehilangan field back-relation (4 error)

**Model yang terlibat:**
- `User` → `TeachingJournal` — User memiliki `teachingJournals` tetapi TeachingJournal tidak memiliki `user`
- `Class` → `TeachingJournal` — Class memiliki `teachingJournals` tetapi TeachingJournal tidak memiliki `class`
- `Rombel` → `TeachingJournal` — Rombel memiliki `teachingJournals` tetapi TeachingJournal tidak memiliki `rombel`
- `Subject` → `TeachingJournal` — Subject memiliki `teachingJournals` tetapi TeachingJournal tidak memiliki `subject`

**Field relation yang hilang/tidak sinkron pada TeachingJournal:**
| Sumber | Field yang dibutuhkan di TeachingJournal |
|--------|------------------------------------------|
| User.teachingJournals | `user User @relation(fields: [userId], references: [id])` |
| Class.teachingJournals | `class Class @relation(fields: [classId], references: [id])` |
| Rombel.teachingJournals | `rombel Rombel @relation(fields: [rombelId], references: [id])` |
| Subject.teachingJournals | `subject Subject @relation(fields: [subjectId], references: [id])` |

**Jumlah error:** 4
**Estimasi kesulitan:** Tinggi — TeachingJournal adalah model junction dengan banyak relasi; penambahan 4 field back-relation harus konsisten dengan `@relation` names dan FK columns yang sudah ada.

---

### RC-2: Class kehilangan field back-relation (2 error)

**Model yang terlibat:**
- `Semester` → `Class` — Semester memiliki `classes` tetapi Class tidak memiliki `semester`
- `TeachingAssignment` → `Class` — TeachingAssignment memiliki `class` (FK classId) tetapi Class tidak memiliki `teachingAssignment`

**Field relation yang hilang/tidak sinkron pada Class:**
| Sumber | Field yang dibutuhkan di Class |
|--------|-------------------------------|
| Semester.classes | `semester Semester? @relation(fields: [semesterId], references: [id])` (perlu tambah semesterId FK) |
| TeachingAssignment.class | `teachingAssignments TeachingAssignment[]` |

**Jumlah error:** 2
**Estimasi kesulitan:** Sedang — Class sudah memiliki `academicYear` FK; penambahan `semesterId` FK dan field relation konsisten dengan pola yang ada.

---

### RC-3: Rapor kehilangan field back-relation (2 error)

**Model yang terlibat:**
- `Class` → `Rapor` — Class memiliki `rapors` tetapi Rapor tidak memiliki `class`
- `Rombel` → `Rapor` — Rombel memiliki `rapors` tetapi Rapor tidak memiliki `rombel`

**Field relation yang hilang/tidak sinkron pada Rapor:**
| Sumber | Field yang dibutuhkan di Rapor |
|--------|-------------------------------|
| Class.rapors | `class Class @relation(fields: [classId], references: [id])` (perlu tambah classId FK) |
| Rombel.rapors | `rombel Rombel @relation(fields: [rombelId], references: [id])` (perlu tambah rombelId FK) |

**Jumlah error:** 2
**Estimasi kesulitan:** Sedang — Rapor sudah memiliki FK untuk student, teachingAssignment, subject, semester, academicYear; penambahan classId/rombelId FK konsisten.

---

### RC-4: AcademicYear kehilangan field back-relation (4 error)

**Model yang terlibat:**
- `Rombel` → `AcademicYear` — Rombel memiliki `academicYear` tetapi AcademicYear tidak memiliki `rombel`
- `CurriculumModule` → `AcademicYear` — CurriculumModule memiliki `academicYear` tetapi AcademicYear tidak memiliki `curriculumModule`
- `LearningObjective` → `AcademicYear` — LearningObjective memiliki `academicYear` tetapi AcademicYear tidak memiliki `learningObjective`
- `GradeDashboard` → `AcademicYear` — GradeDashboard memiliki `academicYear` tetapi AcademicYear tidak memiliki `gradeDashboard`

**Field relation yang hilang/tidak sinkron pada AcademicYear:**
| Sumber | Field yang dibutuhkan di AcademicYear |
|--------|---------------------------------------|
| Rombel.academicYear | `rombels Rombel[]` |
| CurriculumModule.academicYear | `curriculumModules CurriculumModule[]` |
| LearningObjective.academicYear | `learningObjectives LearningObjective[]` |
| GradeDashboard.academicYear | `gradeDashboards GradeDashboard[]` |

**Jumlah error:** 4
**Estimasi kesulitan:** Sedang — AcademicYear sudah memiliki banyak back-relation (semesters, classes, teachingAssignments, gradingComponents, rapors); penambahan 4 lagi konsisten.

---

### RC-5: Student kehilangan field back-relation (2 error)

**Model yang terlibat:**
- `Parent` → `Student` — Parent memiliki `student` tetapi Student tidak memiliki `parent`
- `GradeDashboard` → `Student` — GradeDashboard memiliki `student` tetapi Student tidak memiliki `gradeDashboard`

**Field relation yang hilang/tidak sinkron pada Student:**
| Sumber | Field yang dibutuhkan di Student |
|--------|----------------------------------|
| Parent.student | `parents Parent[]` |
| GradeDashboard.student | `gradeDashboards GradeDashboard[]` |

**Jumlah error:** 2
**Estimasi kesulitan:** Rendah — Student sudah memiliki banyak back-relation (user, rombel, attendances, formativeAssessments, summativeAssessments, rapors); penambahan 2 lagi konsisten.

---

### RC-6: Subject kehilangan field back-relation (4 error)

**Model yang terlibat:**
- `CurriculumModule` → `Subject` — CurriculumModule memiliki `subject` tetapi Subject tidak memiliki `curriculumModule`
- `LearningObjective` → `Subject` — LearningObjective memiliki `subject` tetapi Subject tidak memiliki `learningObjective`
- `GradingComponent` → `Subject` — GradingComponent memiliki `subject` tetapi Subject tidak memiliki `gradingComponent`
- `GradeDashboard` → `Subject` — GradeDashboard memiliki `subject` tetapi Subject tidak memiliki `gradeDashboard`

**Field relation yang hilang/tidak sinkron pada Subject:**
| Sumber | Field yang dibutuhkan di Subject |
|--------|---------------------------------|
| CurriculumModule.subject | `curriculumModules CurriculumModule[]` |
| LearningObjective.subject | `learningObjectives LearningObjective[]` |
| GradingComponent.subject | `gradingComponents GradingComponent[]` |
| GradeDashboard.subject | `gradeDashboards GradeDashboard[]` |

**Jumlah error:** 4
**Estimasi kesulitan:** Sedang — Subject sudah memiliki back-relation (teachingAssignments, teachingJournals, summativeAssessments, rapors, learningObjectivesCP); penambahan 4 lagi konsisten.

---

### RC-7: Semester kehilangan field back-relation (3 error)

**Model yang terlibat:**
- `CurriculumModule` → `Semester` — CurriculumModule memiliki `semester` tetapi Semester tidak memiliki `curriculumModule`
- `LearningObjective` → `Semester` — LearningObjective memiliki `semester` tetapi Semester tidak memiliki `learningObjective`
- `GradeDashboard` → `Semester` — GradeDashboard memiliki `semester` tetapi Semester tidak memiliki `gradeDashboard`

**Field relation yang hilang/tidak sinkron pada Semester:**
| Sumber | Field yang dibutuhkan di Semester |
|--------|-----------------------------------|
| CurriculumModule.semester | `curriculumModules CurriculumModule[]` |
| LearningObjective.semester | `learningObjectives LearningObjective[]` |
| GradeDashboard.semester | `gradeDashboards GradeDashboard[]` |

**Jumlah error:** 3
**Estimasi kesulitan:** Rendah — Semester sudah memiliki back-relation (academicYear, classes, rombels, teachingAssignments, gradingComponents, rapors); penambahan 3 lagi konsisten.

---

### RC-8: SummativeAssessment kehilangan field back-relation (1 error)

**Model yang terlibat:**
- `Subject` → `SummativeAssessment` — Subject memiliki `summativeAssessments` tetapi SummativeAssessment tidak memiliki `subject`

**Field relation yang hilang/tidak sinkron pada SummativeAssessment:**
| Sumber | Field yang dibutuhkan di SummativeAssessment |
|--------|----------------------------------------------|
| Subject.summativeAssessments | `subject Subject @relation(fields: [subjectId], references: [id])` (perlu tambah subjectId FK) |

**Jumlah error:** 1
**Estimasi kesulitan:** Rendah — Satu field FK dan relation tambahan.

---

### RC-9: CurriculumModule kehilangan field back-relation (1 error)

**Model yang terlibat:**
- `TeachingJournal` → `CurriculumModule` — TeachingJournal memiliki `curriculumModule` tetapi CurriculumModule tidak memiliki `teachingJournal`

**Field relation yang hilang/tidak sinkron pada CurriculumModule:**
| Sumber | Field yang dibutuhkan di CurriculumModule |
|--------|-------------------------------------------|
| TeachingJournal.curriculumModule | `teachingJournals TeachingJournal[]` |

**Jumlah error:** 1
**Estimasi kesulitan:** Rendah — Satu field list relation tambahan.

---

### RC-10: LearningObjective kehilangan field back-relation (1 error)

**Model yang terlibat:**
- `TeachingJournal` → `LearningObjective` — TeachingJournal memiliki `learningObjective` tetapi LearningObjective tidak memiliki `teachingJournal`

**Field relation yang hilang/tidak sinkron pada LearningObjective:**
| Sumber | Field yang dibutuhkan di LearningObjective |
|--------|-------------------------------------------|
| TeachingJournal.learningObjective | `teachingJournals TeachingJournal[]` |

**Jumlah error:** 1
**Estimasi kesulitan:** Rendah — Satu field list relation tambahan.

---

### RC-11: User kehilangan field back-relation dengan named relation (1 error)

**Model yang terlibat:**
- `FormativeAssessment` → `User` — FormativeAssessment memiliki `recorder User @relation("FormativeRecorder", ...)` tetapi User tidak memiliki field dengan `@relation("FormativeRecorder")`

**Field relation yang hilang/tidak sinkron pada User:**
| Sumber | Field yang dibutuhkan di User |
|--------|-------------------------------|
| FormativeAssessment.recorder | `formativeAssessments FormativeAssessment[] @relation("FormativeRecorder")` |

**Jumlah error:** 1
**Estimasi kesulitan:** Rendah — Satu field list relation dengan named relation. Perlu menggunakan nama relation yang sama (`"FormativeRecorder"`).

---

## 3. Estimasi

### Jumlah Akar Masalah Sebenarnya

**11 akar masalah** — masing-masing mewakili satu model target yang kehilangan field back-relation untuk satu atau lebih model sumber.

### Total Error yang Hilang Jika Semua Akar Masalah Diperbaiki

**25 dari 25 error** (100%) akan hilang jika seluruh 11 akar masalah diperbaiki.

---

## 4. Tabel Ringkasan Root Cause

| Root Cause | Models Terlibat | Error Count | Fix Complexity |
|---|---|---|---|
| RC-1: TeachingJournal kehilangan 4 back-relation | User, Class, Rombel, Subject → TeachingJournal | 4 | Tinggi |
| RC-2: Class kehilangan 2 back-relation | Semester, TeachingAssignment → Class | 2 | Sedang |
| RC-3: Rapor kehilangan 2 back-relation | Class, Rombel → Rapor | 2 | Sedang |
| RC-4: AcademicYear kehilangan 4 back-relation | Rombel, CurriculumModule, LearningObjective, GradeDashboard → AcademicYear | 4 | Sedang |
| RC-5: Student kehilangan 2 back-relation | Parent, GradeDashboard → Student | 2 | Rendah |
| RC-6: Subject kehilangan 4 back-relation | CurriculumModule, LearningObjective, GradingComponent, GradeDashboard → Subject | 4 | Sedang |
| RC-7: Semester kehilangan 3 back-relation | CurriculumModule, LearningObjective, GradeDashboard → Semester | 3 | Rendah |
| RC-8: SummativeAssessment kehilangan 1 back-relation | Subject → SummativeAssessment | 1 | Rendah |
| RC-9: CurriculumModule kehilangan 1 back-relation | TeachingJournal → CurriculumModule | 1 | Rendah |
| RC-10: LearningObjective kehilangan 1 back-relation | TeachingJournal → LearningObjective | 1 | Rendah |
| RC-11: User kehilangan 1 back-relation (named) | FormativeAssessment.recorder → User | 1 | Rendah |
| **Total** | | **25** | |