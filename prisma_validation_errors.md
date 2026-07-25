# Prisma Validation Errors — Sisa Error

Dihasilkan dari: `npx prisma validate` (Prisma CLI 5.22.0)

---

## Ringkasan

| Item | Detail |
|------|--------|
| **Total Error** | 25 |
| **Total Kategori** | 1 |
| **Model Terdampak** | 16 (User, Semester, Class, Rombel, Subject, Parent, TeachingAssignment, CurriculumModule, LearningObjective, TeachingJournal, GradingComponent, FormativeAssessment, GradeDashboard, AcademicYear, Student, Rapor, SummativeAssessment) |
| **Estimasi Tingkat Kesulitan** | Sedang — semua error adalah field relation yang kehilangan field sebaliknya di model terkait |

---

## 1. Relation Errors

> Semua error berikut memiliki pola yang sama: field relation pada satu model tidak memiliki field relation kebalikan (opposite relation) di model tujuan.

### Daftar Error

| # | Model (Sumber) | Field | Model (Tujuan) | Kode |
|---|----------------|-------|----------------|------|
| 1 | User | `teachingJournals` | TeachingJournal | P1012 |
| 2 | Semester | `classes` | Class | P1012 |
| 3 | Class | `teachingJournals` | TeachingJournal | P1012 |
| 4 | Class | `rapors` | Rapor | P1012 |
| 5 | Rombel | `academicYear` | AcademicYear | P1012 |
| 6 | Rombel | `teachingJournals` | TeachingJournal | P1012 |
| 7 | Rombel | `rapors` | Rapor | P1012 |
| 8 | Subject | `teachingJournals` | TeachingJournal | P1012 |
| 9 | Subject | `summativeAssessments` | SummativeAssessment | P1012 |
| 10 | Parent | `student` | Student | P1012 |
| 11 | TeachingAssignment | `class` | Class | P1012 |
| 12 | CurriculumModule | `subject` | Subject | P1012 |
| 13 | CurriculumModule | `academicYear` | AcademicYear | P1012 |
| 14 | CurriculumModule | `semester` | Semester | P1012 |
| 15 | LearningObjective | `subject` | Subject | P1012 |
| 16 | LearningObjective | `academicYear` | AcademicYear | P1012 |
| 17 | LearningObjective | `semester` | Semester | P1012 |
| 18 | TeachingJournal | `curriculumModule` | CurriculumModule | P1012 |
| 19 | TeachingJournal | `learningObjective` | LearningObjective | P1012 |
| 20 | GradingComponent | `subject` | Subject | P1012 |
| 21 | FormativeAssessment | `recorder` | User | P1012 |
| 22 | GradeDashboard | `student` | Student | P1012 |
| 23 | GradeDashboard | `subject` | Subject | P1012 |
| 24 | GradeDashboard | `semester` | Semester | P1012 |
| 25 | GradeDashboard | `academicYear` | AcademicYear | P1012 |

### Detail per Model Terdampak (Model yang Harus Menambah Field)

#### TeachingJournal
Perlu menambahkan field relation balikan untuk source dari model berikut:
1. `User.teachingJournals` (baris 119)
2. `Class.teachingJournals` (baris 199)
3. `Rombel.teachingJournals` (baris 224)
4. `Subject.teachingJournals` (baris 241)

#### Class
Perlu menambahkan field relation balikan untuk:
1. `Semester.classes` (baris 177)
2. `TeachingAssignment.class` (baris 324)

#### Rapor
Perlu menambahkan field relation balikan untuk:
1. `Class.rapors` (baris 200)
2. `Rombel.rapors` (baris 225)

#### AcademicYear
Perlu menambahkan field relation balikan untuk:
1. `Rombel.academicYear` (baris 218)
2. `CurriculumModule.academicYear` (baris 383)
3. `LearningObjective.academicYear` (baris 415)
4. `GradeDashboard.academicYear` (baris 617)

#### Student
Perlu menambahkan field relation balikan untuk:
1. `Parent.student` (baris 304)
2. `GradeDashboard.student` (baris 613)

#### Subject
Perlu menambahkan field relation balikan untuk:
1. `CurriculumModule.subject` (baris 382)
2. `LearningObjective.subject` (baris 414)
3. `GradingComponent.subject` (baris 525)
4. `GradeDashboard.subject` (baris 615)

#### Semester
Perlu menambahkan field relation balikan untuk:
1. `CurriculumModule.semester` (baris 384)
2. `LearningObjective.semester` (baris 416)
3. `GradeDashboard.semester` (baris 616)

#### SummativeAssessment
Perlu menambahkan field relation balikan untuk:
1. `Subject.summativeAssessments` (baris 242)

#### CurriculumModule
Perlu menambahkan field relation balikan untuk:
1. `TeachingJournal.curriculumModule` (baris 500)

#### LearningObjective
Perlu menambahkan field relation balikan untuk:
1. `TeachingJournal.learningObjective` (baris 501)

#### User
Perlu menambahkan field relation balikan untuk:
1. `FormativeAssessment.recorder` — menggunakan named relation `@relation("FormativeRecorder")` (baris 556)

---

## Jumlah Error per Kategori

| Kategori | Jumlah |
|----------|--------|
| Relation Errors | 25 |
| Missing Unique Constraints | 0 |
| Enum Errors | 0 |
| Field Type Errors | 0 |
| Foreign Key Errors | 0 |
| Other Errors | 0 |

---

## Catatan

- Semua 25 error memiliki error code **P1012** (schema validation error).
- Pola error konsisten: field relation pada model A mengarah ke model B, tetapi model B tidak memiliki field relation yang berlawanan (opposite relation).
- Tidak ditemukan error pada kategori lain (Missing Unique Constraints, Enum Errors, Field Type Errors, Foreign Key Errors).
- Perbaikan memerlukan penambahan field relation pada model-model tujuan yang tercantum di atas.
- Tidak dilakukan perubahan pada schema.