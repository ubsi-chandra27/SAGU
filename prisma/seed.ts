import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseBoolean(value: string | null): boolean {
  if (value === null || value === undefined) return false;
  return value === "true" || value === "1";
}

async function main() {
  const school = await prisma.school.upsert({
    where: { name: "SMA Negeri 1 SAGU" },
    update: {},
    create: {
      name: "SMA Negeri 1 SAGU",
      npsn: "20123456",
      address: "Jl. Pendidikan No. 1, Kota SAGU",
      phone: "(021) 1234567",
      email: "sekolah@sagu.sch.id",
    },
  });

  console.log(`School created/upserted: ${school.name} (id: ${school.id})`);

  const setting = await prisma.setting.upsert({
    where: { schoolId_key: { schoolId: school.id, key: "school_name" } },
    update: { value: "SMA Negeri 1 SAGU", description: "Nama sekolah" },
    create: {
      schoolId: school.id,
      key: "school_name",
      value: "SMA Negeri 1 SAGU",
      description: "Nama sekolah",
    },
  });

  console.log("Setting created/upserted");

  const academicYear2025 = await prisma.academicYear.upsert({
    where: { name: "2025/2026" },
    update: {},
    create: {
      name: "2025/2026",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });

  console.log(`Academic Year created/upserted: ${academicYear2025.name}`);

  const semesterGanjil = await prisma.semester.upsert({
    where: { academicYearId_name: { academicYearId: academicYear2025.id, name: "Ganjil" } },
    update: {},
    create: {
      academicYearId: academicYear2025.id,
      name: "Ganjil",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
    },
  });

  const semesterGenap = await prisma.semester.upsert({
    where: { academicYearId_name: { academicYearId: academicYear2025.id, name: "Genap" } },
    update: {},
    create: {
      academicYearId: academicYear2025.id,
      name: "Genap",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-30"),
      isActive: false,
    },
  });

  console.log("Semesters created/upserted");

  const classX = await prisma.class.upsert({
    where: { name: "X-IPA-1" },
    update: {},
    create: {
      name: "X-IPA-1",
      level: "X",
      academicYearId: academicYear2025.id,
      capacity: 35,
    },
  });

  console.log(`Class created/upserted: ${classX.name}`);

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@sagu.sch.id",
      passwordHash: "$2b$10$placeholderhashedpasswordforadminexample",
      role: "ADMIN",
      isActive: true,
    },
  });

  const guruUser = await prisma.user.upsert({
    where: { username: "guru_informatika" },
    update: {},
    create: {
      username: "guru_informatika",
      email: "guru@inf.sagu.sch.id",
      passwordHash: "$2b$10$placeholderhashedpasswordforguruexample",
      role: "GURU",
      isActive: true,
    },
  });

  const waliKelasUser = await prisma.user.upsert({
    where: { username: "wali_kelas_x1" },
    update: {},
    create: {
      username: "wali_kelas_x1",
      email: "walikelas@x1.sagu.sch.id",
      passwordHash: "$2b$10$placeholderhashedpasswordforwalikelasexample",
      role: "WALI_KELAS",
      isActive: true,
    },
  });

  const siswaUser = await prisma.user.upsert({
    where: { username: "siswa_01" },
    update: {},
    create: {
      username: "siswa_01",
      email: "siswa01@sagu.sch.id",
      passwordHash: "$2b$10$placeholderhashedpasswordforsiswaexample",
      role: "SISWA",
      isActive: true,
    },
  });

  const orangTuaUser = await prisma.user.upsert({
    where: { username: "ortu_siswa_01" },
    update: {},
    create: {
      username: "ortu_siswa_01",
      email: "ortu@sagu.sch.id",
      passwordHash: "$2b$10$placeholderhashedpasswordforortuexample",
      role: "ORANG_TUA",
      isActive: true,
    },
  });

  console.log("Users created/upserted");

  const adminProfile = await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      fullName: "Administrator SAGU",
      gender: "LAKI_LAKI",
      phone: "(021) 1234567",
      address: "Jl. Sekolah No. 1",
    },
  });

  const guruProfile = await prisma.profile.upsert({
    where: { userId: guruUser.id },
    update: {},
    create: {
      userId: guruUser.id,
      fullName: "Budi Santoso, S.Kom",
      gender: "LAKI_LAKI",
      placeOfBirth: "Sagu",
      dateOfBirth: new Date("1980-05-15"),
      phone: "(021) 9876543",
      address: "Jl. Mencari No. 5",
    },
  });

  const waliKelasProfile = await prisma.profile.upsert({
    where: { userId: waliKelasUser.id },
    update: {},
    create: {
      userId: waliKelasUser.id,
      fullName: "Dewi Lestari, S.Pd",
      gender: "PEREMPUAN",
      placeOfBirth: "Sagu",
      dateOfBirth: new Date("1985-03-22"),
      phone: "(021) 5551234",
      address: "Jl. Mengajar No. 10",
    },
  });

  console.log("Profiles created/upserted");

  const teacherRecord = await prisma.teacher.upsert({
    where: { userId: guruUser.id },
    update: {},
    create: {
      userId: guruUser.id,
      nip: "19800515201001001",
      specialization: "Informatika",
    },
  });

  console.log(`Teacher created/upserted: ${teacherRecord.nip}`);

  const subjectInformatika = await prisma.subject.upsert({
    where: { code: "INF" },
    update: {},
    create: {
      name: "Informatika",
      code: "INF",
      description: "Mata pelajaran Informatika berdasarkan Kurikulum Merdeka",
    },
  });

  console.log(`Subject created/upserted: ${subjectInformatika.name}`);

  const teachingAssignment = await prisma.teachingAssignment.upsert({
    where: {
      teacherId_rombelId_subjectId_academicYearId_semesterId: {
        teacherId: teacherRecord.id,
        rombelId: "",
        subjectId: subjectInformatika.id,
        academicYearId: academicYear2025.id,
        semesterId: semesterGanjil.id,
      },
    },
    update: {},
    create: {
      teacherId: teacherRecord.id,
      rombelId: "",
      classId: classX.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
    },
  });

  console.log("TeachingAssignment created/upserted");

  const cpInformatika = await prisma.learningObjectiveCP.upsert({
    where: { subjectId_gradeLevel_cpCode: { subjectId: subjectInformatika.id, gradeLevel: "X", cpCode: "CP-INF-01" } },
    update: {},
    create: {
      subjectId: subjectInformatika.id,
      gradeLevel: "X",
      cpCode: "CP-INF-01",
      description: "Memahami konsep dasar pemrograman dan aplikasi teknologi informasi",
    },
  });

  await prisma.learningObjectiveCP.upsert({
    where: { subjectId_gradeLevel_cpCode: { subjectId: subjectInformatika.id, gradeLevel: "X", cpCode: "CP-INF-02" } },
    update: {},
    create: {
      subjectId: subjectInformatika.id,
      gradeLevel: "X",
      cpCode: "CP-INF-02",
      description: "Mengembangkan perangkat lunak sederhana sesuai kebutuhan",
    },
  });

  await prisma.learningObjectiveCP.upsert({
    where: { subjectId_gradeLevel_cpCode: { subjectId: subjectInformatika.id, gradeLevel: "X", cpCode: "CP-INF-03" } },
    update: {},
    create: {
      subjectId: subjectInformatika.id,
      gradeLevel: "X",
      cpCode: "CP-INF-03",
      description: "Menerapkan etika digital dan keamanan data dalam penggunaan teknologi",
    },
  });

  console.log("Learning Objective CP created/upserted");

  const lm1 = await prisma.curriculumModule.upsert({
    where: { teachingAssignmentId_number: { teachingAssignmentId: teachingAssignment.id, number: 1 } },
    update: {},
    create: {
      teachingAssignmentId: teachingAssignment.id,
      cpId: cpInformatika.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      number: 1,
      title: "Dasar Pemrograman",
      description: "Materi tentang variabel, tipe data, dan operasi dasar pemrograman",
      topics: "Variabel, Tipe Data, Operator Aritmatika",
      assessmentType: "UAS",
      weight: "0.25",
    },
  });

  const lm2 = await prisma.curriculumModule.upsert({
    where: { teachingAssignmentId_number: { teachingAssignmentId: teachingAssignment.id, number: 2 } },
    update: {},
    create: {
      teachingAssignmentId: teachingAssignment.id,
      cpId: cpInformatika.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      number: 2,
      title: "Struktur Kontrol",
      description: "Materi tentang struktur kendali seperti IF, WHILE, dan FOR",
      topics: "IF, WHILE, FOR, Percabangan, Perulangan",
      assessmentType: "UTS",
      weight: "0.25",
    },
  });

  const lm3 = await prisma.curriculumModule.upsert({
    where: { teachingAssignmentId_number: { teachingAssignmentId: teachingAssignment.id, number: 3 } },
    update: {},
    create: {
      teachingAssignmentId: teachingAssignment.id,
      cpId: cpInformatika.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      number: 3,
      title: "Fungsi dan Modul",
      description: "Materi tentang fungsi, parameter, dan modul dalam pemrograman",
      topics: "Definisi Fungsi, Parameter, Return Value, Import",
      assessmentType: "proyek",
      weight: "0.25",
    },
  });

  const lm4 = await prisma.curriculumModule.upsert({
    where: { teachingAssignmentId_number: { teachingAssignmentId: teachingAssignment.id, number: 4 } },
    update: {},
    create: {
      teachingAssignmentId: teachingAssignment.id,
      cpId: cpInformatika.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      number: 4,
      title: "Keamanan Digital",
      description: "Materi tentang etika digital, keamanan data, dan perlindungan informasi",
      topics: "Etika Digital, Enkripsi Dasar, Keamanan Berbasis Web",
      assessmentType: "UAS",
      weight: "0.25",
    },
  });

  console.log("Curriculum Modules (LM) created/upserted for Informatika");

  const tp1 = await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm1.id, tpNumber: 1 } },
    update: {},
    create: {
      curriculumModuleId: lm1.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 1,
      title: "Memahami variabel dan tipe data",
      description: "Siswa mampu menjelaskan jenis tipe data dan mendeklarasikan variabel dalam bahasa pemrograman",
      indicator: "Menjelaskan jenis tipe data (integer, string, boolean, array) dan mendeklarasikan variabel dengan benar",
    },
  });

  const tp2 = await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm1.id, tpNumber: 2 } },
    update: {},
    create: {
      curriculumModuleId: lm1.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 2,
      title: "Melakukan operasi aritmatika",
      description: "Siswa mampu menulis ekspresi aritmatika sederhana dalam kode program",
      indicator: "Menulis ekspresi aritmatika (penjumlahan, pengurangan, perkalian, pembagian) dengan benar",
    },
  });

  const tp3 = await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm1.id, tpNumber: 3 } },
    update: {},
    create: {
      curriculumModuleId: lm1.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 3,
      title: "Menggunakan input dan output dasar",
      description: "Siswa mampu membuat program sederhana dengan input dan output",
      indicator: "Membuat program interaktif dengan input dari pengguna dan output ke layar",
    },
  });

  const tp4 = await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm2.id, tpNumber: 1 } },
    update: {},
    create: {
      curriculumModuleId: lm2.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 1,
      title: "Memahami struktur IF",
      description: "Siswa mampu menggunakan percabangan IF untuk mengambil keputusan",
      indicator: "Menulis program dengan struktur IF-ELSE untuk berbagai kondisi logika",
    },
  });

  const tp5 = await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm2.id, tpNumber: 2 } },
    update: {},
    create: {
      curriculumModuleId: lm2.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 2,
      title: "Memahami struktur WHILE dan FOR",
      description: "Siswa mampu menggunakan perulangan untuk memproses data secara berulang",
      indicator: "Menulis program dengan WHILE dan FOR loop untuk berbagai kebutuhan iterasi",
    },
  });

  const tp6 = await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm3.id, tpNumber: 1 } },
    update: {},
    create: {
      curriculumModuleId: lm3.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 1,
      title: "Membuat fungsi sederhana",
      description: "Siswa mampu mendefinisikan fungsi dengan parameter dan nilai kembalian",
      indicator: "Menulis fungsi dengan parameter input dan return value yang benar",
    },
  });

  const tp7 = await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm3.id, tpNumber: 2 } },
    update: {},
    create: {
      curriculumModuleId: lm3.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 2,
      title: "Menggunakan modul dan library",
      description: "Siswa mampu mengimpor dan menggunakan modul eksternal",
      indicator: "Menunjukkan cara menggunakan modul dan library dalam program",
    },
  });

  await prisma.learningObjective.upsert({
    where: { curriculumModuleId_tpNumber: { curriculumModuleId: lm4.id, tpNumber: 1 } },
    update: {},
    create: {
      curriculumModuleId: lm4.id,
      teachingAssignmentId: teachingAssignment.id,
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      tpNumber: 1,
      title: "Menerapkan etika digital",
      description: "Siswa memahami pentingnya etika dalam penggunaan teknologi digital",
      indicator: "Menjelaskan prinsip etika digital dan memberi contoh penerapannya",
    },
  });

  console.log("Learning Objectives (TP) created/upserted");

  const gcHarian = await prisma.gradingComponent.upsert({
    where: { academicYearId_semesterId_subjectId_name: { academicYearId: academicYear2025.id, semesterId: semesterGanjil.id, subjectId: subjectInformatika.id, name: "Harian" } },
    update: {},
    create: {
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      name: "Harian",
      weight: "0.30",
      assessmentCategory: "SUMATIF",
      assessmentTypeDetail: "HARIAN",
      description: "Penilaian harian berbasis tugas dan observasi",
    },
  });

  const gcUTS = await prisma.gradingComponent.upsert({
    where: { academicYearId_semesterId_subjectId_name: { academicYearId: academicYear2025.id, semesterId: semesterGanjil.id, subjectId: subjectInformatika.id, name: "UTS" } },
    update: {},
    create: {
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      name: "UTS",
      weight: "0.25",
      assessmentCategory: "SUMATIF",
      assessmentTypeDetail: "UTS",
      description: "Ujian Tengah Semester",
    },
  });

  const gcUAS = await prisma.gradingComponent.upsert({
    where: { academicYearId_semesterId_subjectId_name: { academicYearId: academicYear2025.id, semesterId: semesterGanjil.id, subjectId: subjectInformatika.id, name: "UAS" } },
    update: {},
    create: {
      subjectId: subjectInformatika.id,
      academicYearId: academicYear2025.id,
      semesterId: semesterGanjil.id,
      name: "UAS",
      weight: "0.50",
      assessmentCategory: "SUMATIF",
      assessmentTypeDetail: "UAS",
      description: "Ujian Akhir Semester",
    },
  });

  console.log("Grading Components created/upserted");

  const studentUser = await prisma.user.upsert({
    where: { username: "siswa_01" },
    update: {},
    create: {
      username: "siswa_01",
      email: "siswa01@sagu.sch.id",
      passwordHash: "$2b$10$placeholderhashedpasswordforsiswaexample",
      role: "SISWA",
      isActive: true,
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      nis: "100001",
      nisn: "0012345678",
      rombelId: "",
      parentName: "Budi Rahayu",
      parentPhone: "(021) 8881234",
      parentEmail: "ortu.siswa01@sagu.sch.id",
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { username: "ortu_siswa_01" },
    update: {},
    create: {
      username: "ortu_siswa_01",
      email: "ortu@sagu.sch.id",
      passwordHash: "$2b$10$placeholderhashedpasswordforortuexample",
      role: "ORANG_TUA",
      isActive: true,
    },
  });

  const parentRecord = await prisma.parent.upsert({
    where: { userId_studentId: { userId: parentUser.id, studentId: student.id } },
    update: {},
    create: {
      userId: parentUser.id,
      studentId: student.id,
      relationship: "ayah",
    },
  });

  console.log("Student and Parent created/upserted");

  const meeting1 = await prisma.meeting.upsert({
    where: { teachingAssignmentId_meetingNumber: { teachingAssignmentId: teachingAssignment.id, meetingNumber: 1 } },
    update: {},
    create: {
      teachingAssignmentId: teachingAssignment.id,
      curriculumModuleId: lm1.id,
      learningObjectiveId: tp1.id,
      meetingNumber: 1,
      meetingDate: new Date("2025-07-15"),
      startTime: new Date("2025-07-15T08:00:00"),
      endTime: new Date("2025-07-15T09:30:00"),
      topicSummary: "Pengenalan variabel dan tipe data",
      tpCovered: "TP1: Memahami variabel dan tipe data",
    },
  });

  const meeting2 = await prisma.meeting.upsert({
    where: { teachingAssignmentId_meetingNumber: { teachingAssignmentId: teachingAssignment.id, meetingNumber: 2 } },
    update: {},
    create: {
      teachingAssignmentId: teachingAssignment.id,
      curriculumModuleId: lm1.id,
      learningObjectiveId: tp2.id,
      meetingNumber: 2,
      meetingDate: new Date("2025-07-17"),
      startTime: new Date("2025-07-17T08:00:00"),
      endTime: new Date("2025-07-17T09:30:00"),
      topicSummary: "Operasi aritmatika dalam program",
      tpCovered: "TP2: Melakukan operasi aritmatika",
    },
  });

  console.log("Meetings created/upserted");

  const attendance1 = await prisma.attendance.upsert({
    where: { studentId_attendanceDate: { studentId: student.id, attendanceDate: new Date("2025-07-15") } },
    update: {},
    create: {
      studentId: student.id,
      rombelId: "",
      attendanceDate: new Date("2025-07-15"),
      status: "HADIR",
      recordedById: guruUser.id,
    },
  });

  const attendance2 = await prisma.attendance.upsert({
    where: { studentId_attendanceDate: { studentId: student.id, attendanceDate: new Date("2025-07-17") } },
    update: {},
    create: {
      studentId: student.id,
      rombelId: "",
      attendanceDate: new Date("2025-07-17"),
      status: "HADIR",
      recordedById: guruUser.id,
    },
  });

  console.log("Attendance records created/upserted");

  const fa1 = await prisma.formativeAssessment.upsert({
    where: { learningObjectiveId_studentId_assessmentDate: { learningObjectiveId: tp1.id, studentId: student.id, assessmentDate: new Date("2025-07-15") } },
    update: {},
    create: {
      learningObjectiveId: tp1.id,
      meetingId: meeting1.id,
      teachingAssignmentId: teachingAssignment.id,
      studentId: student.id,
      score: 85,
      maxScore: 100,
      feedback: "Bagus! Memahami konsep variabel dengan baik. Perlu latihan lebih untuk tipe data array.",
      assessmentDate: new Date("2025-07-15"),
      assessmentType: "OBSERVASI",
      recordedById: guruUser.id,
    },
  });

  const fa2 = await prisma.formativeAssessment.upsert({
    where: { learningObjectiveId_studentId_assessmentDate: { learningObjectiveId: tp2.id, studentId: student.id, assessmentDate: new Date("2025-07-17") } },
    update: {},
    create: {
      learningObjectiveId: tp2.id,
      meetingId: meeting2.id,
      teachingAssignmentId: teachingAssignment.id,
      studentId: student.id,
      score: 90,
      maxScore: 100,
      feedback: "Sangat Bagus! Ekspresi aritmatika ditulis dengan benar. Lanjutkan ke materi berikutnya.",
      assessmentDate: new Date("2025-07-17"),
      assessmentType: "TUGAS_HARIAN",
      recordedById: guruUser.id,
    },
  });

  console.log("Formative Assessments created/upserted");

  const saHarian = await prisma.summativeAssessment.upsert({
    where: { curriculumModuleId_studentId_gradingComponentId: { curriculumModuleId: lm1.id, studentId: student.id, gradingComponentId: gcHarian.id } },
    update: {},
    create: {
      curriculumModuleId: lm1.id,
      gradingComponentId: gcHarian.id,
      teachingAssignmentId: teachingAssignment.id,
      studentId: student.id,
      score: 82,
      maxScore: 100,
      isPublished: false,
      notes: "Nilai tugas harian minggu ke-2",
    },
  });

  const saUTS = await prisma.summativeAssessment.upsert({
    where: { curriculumModuleId_studentId_gradingComponentId: { curriculumModuleId: lm2.id, studentId: student.id, gradingComponentId: gcUTS.id } },
    update: {},
    create: {
      curriculumModuleId: lm2.id,
      gradingComponentId: gcUTS.id,
      teachingAssignmentId: teachingAssignment.id,
      studentId: student.id,
      score: 78,
      maxScore: 100,
      isPublished: false,
      notes: "UTS Tengah Semester",
    },
  });

  const saUAS = await prisma.summativeAssessment.upsert({
    where: { curriculumModuleId_studentId_gradingComponentId: { curriculumModuleId: lm4.id, studentId: student.id, gradingComponentId: gcUAS.id } },
    update: {},
    create: {
      curriculumModuleId: lm4.id,
      gradingComponentId: gcUAS.id,
      teachingAssignmentId: teachingAssignment.id,
      studentId: student.id,
      score: 80,
      maxScore: 100,
      isPublished: false,
      notes: "UAS Akhir Semester - Soal A",
    },
  });

  console.log("Summative Assessments created/upserted");

  console.log("\n=== SEED DATA SELESAI ===");
  console.log(`Total: 1 sekolah, 5 pengguna, 1 guru, 1 siswa, 1 orang tua`);
  console.log(`Mata pelajaran: ${subjectInformatika.name}`);
  console.log(`LM: 4 (Dasar Pemrograman, Struktur Kontrol, Fungsi dan Modul, Keamanan Digital)`);
  console.log(`TP per LM: bervariasi (3-2 TP per LM)`);
  console.log(`Grading Components: 3 (Harian 30%, UTS 25%, UAS 50%)`);
  console.log(`Pertemuan: 2 (LM1 dan LM1 TP berlanjut)`);
  console.log(`Absensi: 2 record`);
  console.log(`Penilaian Formatif: 2 record`);
  console.log(`Penilaian Sumatif: 3 record (Harian, UTS, UAS)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });