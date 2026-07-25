-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GURU', 'WALI_KELAS', 'SISWA', 'ORANG_TUA');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT');

-- CreateEnum
CREATE TYPE "AssessmentCategory" AS ENUM ('FORMATIF', 'SUMATIF');

-- CreateEnum
CREATE TYPE "AssessmentTypeDetail" AS ENUM ('HARIAN', 'TUGAS_HARIAN', 'KUIS_SINGKAT', 'REFLEKSI', 'DISKUSI', 'TENGAH_SEMESTER', 'AKHIR_SEMESTER', 'UTS', 'UAS', 'PROYEK', 'PORTOFOLIO');

-- CreateEnum
CREATE TYPE "GradeLetter" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "Predicate" AS ENUM ('SANGAT_BAIK', 'BAIK', 'CUKUP', 'KURANG', 'TIDAK_MEMENUHI');

-- CreateTable
CREATE TABLE "schools" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "npsn" VARCHAR(10),
    "address" TEXT NOT NULL,
    "phone" VARCHAR(15),
    "email" VARCHAR(100),
    "logo_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "avatar_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "gender" "Gender",
    "place_of_birth" VARCHAR(100),
    "date_of_birth" TIMESTAMP(3),
    "phone" VARCHAR(15),
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semesters" (
    "id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "name" VARCHAR(10) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "level" VARCHAR(10) NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "semester_id" UUID,
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rombels" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "homeroom_teacher_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rombels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nip" VARCHAR(18),
    "specialization" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nis" VARCHAR(10) NOT NULL,
    "nisn" VARCHAR(10) NOT NULL,
    "rombel_id" UUID,
    "parent_name" VARCHAR(255),
    "parent_phone" VARCHAR(15),
    "parent_email" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "relationship" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teaching_assignments" (
    "id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "rombel_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teaching_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_objectives_cp" (
    "id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "grade_level" VARCHAR(10) NOT NULL,
    "cp_code" VARCHAR(20) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "learning_objectives_cp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_modules" (
    "id" UUID NOT NULL,
    "teaching_assignment_id" UUID NOT NULL,
    "cp_id" UUID,
    "subject_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "topics" TEXT,
    "assessment_type" VARCHAR(50),
    "weight" DECIMAL(3,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "curriculum_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_objectives" (
    "id" UUID NOT NULL,
    "curriculum_module_id" UUID NOT NULL,
    "teaching_assignment_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "tp_number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "indicator" TEXT,
    "due_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "learning_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" UUID NOT NULL,
    "teaching_assignment_id" UUID NOT NULL,
    "teaching_journal_id" UUID,
    "curriculum_module_id" UUID,
    "learning_objective_id" UUID,
    "meeting_number" INTEGER NOT NULL,
    "meeting_date" DATE NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "topic_summary" TEXT,
    "tp_covered" TEXT,
    "homeroom_teacher_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "rombel_id" UUID NOT NULL,
    "attendance_date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "note" TEXT,
    "recorded_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teaching_journals" (
    "id" UUID NOT NULL,
    "teaching_assignment_id" UUID NOT NULL,
    "curriculum_module_id" UUID,
    "learning_objective_id" UUID,
    "meeting_number" INTEGER NOT NULL,
    "meeting_date" DATE NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "topic" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "tp_covered" TEXT,
    "metode_pembelajaran" VARCHAR(100),
    "media" TEXT,
    "refleksi_guru" TEXT,
    "tindak_lanjut" TEXT,
    "is_plan" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "rombel_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,

    CONSTRAINT "teaching_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grading_components" (
    "id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "weight" DECIMAL(3,2) NOT NULL,
    "assessment_category" "AssessmentCategory" NOT NULL,
    "assessment_type_detail" "AssessmentTypeDetail" NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "grading_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formative_assessments" (
    "id" UUID NOT NULL,
    "learning_objective_id" UUID NOT NULL,
    "meeting_id" UUID NOT NULL,
    "teaching_assignment_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "max_score" DECIMAL(5,2) NOT NULL,
    "feedback" TEXT,
    "assessment_date" DATE NOT NULL,
    "assessment_type" "AssessmentTypeDetail" NOT NULL,
    "recorded_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "formative_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summative_assessments" (
    "id" UUID NOT NULL,
    "curriculum_module_id" UUID NOT NULL,
    "grading_component_id" UUID NOT NULL,
    "meeting_id" UUID,
    "teaching_assignment_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "max_score" DECIMAL(5,2) NOT NULL,
    "weight_override" DECIMAL(3,2),
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_by" UUID,
    "published_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "summative_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades_dashboard" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "teaching_assignment_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "numeric_score" DECIMAL(5,2) NOT NULL,
    "letter_grade" "GradeLetter" NOT NULL,
    "predicate" "Predicate" NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grades_dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raport" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "rombel_id" UUID,
    "teaching_assignment_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "numeric_score" DECIMAL(5,2) NOT NULL,
    "letter_grade" "GradeLetter" NOT NULL,
    "predicate" "Predicate" NOT NULL,
    "attendance_summary" JSON,
    "teacher_note" TEXT,
    "parent_note" TEXT,
    "is_printed" BOOLEAN NOT NULL DEFAULT false,
    "printed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "raport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "table_name" VARCHAR(50) NOT NULL,
    "record_id" VARCHAR(100) NOT NULL,
    "old_values" JSON,
    "new_values" JSON,
    "ip_address" VARCHAR(45) NOT NULL,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_school_id_key" ON "settings"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "academic_years_name_idx" ON "academic_years"("name");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_academic_year_id_name_key" ON "semesters"("academic_year_id", "name");

-- CreateIndex
CREATE INDEX "classes_academic_year_id_level_idx" ON "classes"("academic_year_id", "level");

-- CreateIndex
CREATE UNIQUE INDEX "rombels_class_id_academic_year_id_semester_id_name_key" ON "rombels"("class_id", "academic_year_id", "semester_id", "name");

-- CreateIndex
CREATE INDEX "subjects_name_idx" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- CreateIndex
CREATE INDEX "students_rombel_id_idx" ON "students"("rombel_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_nis_key" ON "students"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "students_nisn_key" ON "students"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "parents_user_id_student_id_key" ON "parents"("user_id", "student_id");

-- CreateIndex
CREATE INDEX "teaching_assignments_teacher_id_rombel_id_idx" ON "teaching_assignments"("teacher_id", "rombel_id");

-- CreateIndex
CREATE INDEX "teaching_assignments_academic_year_id_semester_id_idx" ON "teaching_assignments"("academic_year_id", "semester_id");

-- CreateIndex
CREATE INDEX "teaching_assignments_subject_id_idx" ON "teaching_assignments"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "teaching_assignments_teacher_id_rombel_id_subject_id_academ_key" ON "teaching_assignments"("teacher_id", "rombel_id", "subject_id", "academic_year_id", "semester_id");

-- CreateIndex
CREATE INDEX "learning_objectives_cp_subject_id_grade_level_idx" ON "learning_objectives_cp"("subject_id", "grade_level");

-- CreateIndex
CREATE UNIQUE INDEX "learning_objectives_cp_subject_id_grade_level_cp_code_key" ON "learning_objectives_cp"("subject_id", "grade_level", "cp_code");

-- CreateIndex
CREATE INDEX "curriculum_modules_teaching_assignment_id_idx" ON "curriculum_modules"("teaching_assignment_id");

-- CreateIndex
CREATE INDEX "curriculum_modules_academic_year_id_semester_id_idx" ON "curriculum_modules"("academic_year_id", "semester_id");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_modules_teaching_assignment_id_number_key" ON "curriculum_modules"("teaching_assignment_id", "number");

-- CreateIndex
CREATE INDEX "learning_objectives_curriculum_module_id_idx" ON "learning_objectives"("curriculum_module_id");

-- CreateIndex
CREATE INDEX "learning_objectives_teaching_assignment_id_idx" ON "learning_objectives"("teaching_assignment_id");

-- CreateIndex
CREATE INDEX "learning_objectives_academic_year_id_semester_id_idx" ON "learning_objectives"("academic_year_id", "semester_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_objectives_curriculum_module_id_tp_number_key" ON "learning_objectives"("curriculum_module_id", "tp_number");

-- CreateIndex
CREATE INDEX "meetings_teaching_assignment_id_meeting_date_idx" ON "meetings"("teaching_assignment_id", "meeting_date");

-- CreateIndex
CREATE UNIQUE INDEX "meetings_teaching_assignment_id_meeting_number_key" ON "meetings"("teaching_assignment_id", "meeting_number");

-- CreateIndex
CREATE INDEX "attendances_attendance_date_student_id_idx" ON "attendances"("attendance_date", "student_id");

-- CreateIndex
CREATE INDEX "attendances_rombel_id_idx" ON "attendances"("rombel_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_student_id_attendance_date_key" ON "attendances"("student_id", "attendance_date");

-- CreateIndex
CREATE INDEX "teaching_journals_teaching_assignment_id_meeting_date_idx" ON "teaching_journals"("teaching_assignment_id", "meeting_date");

-- CreateIndex
CREATE INDEX "teaching_journals_meeting_date_idx" ON "teaching_journals"("meeting_date");

-- CreateIndex
CREATE UNIQUE INDEX "teaching_journals_teaching_assignment_id_meeting_number_key" ON "teaching_journals"("teaching_assignment_id", "meeting_number");

-- CreateIndex
CREATE INDEX "grading_components_academic_year_id_semester_id_idx" ON "grading_components"("academic_year_id", "semester_id");

-- CreateIndex
CREATE INDEX "grading_components_subject_id_idx" ON "grading_components"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "grading_components_academic_year_id_semester_id_subject_id__key" ON "grading_components"("academic_year_id", "semester_id", "subject_id", "name");

-- CreateIndex
CREATE INDEX "formative_assessments_learning_objective_id_idx" ON "formative_assessments"("learning_objective_id");

-- CreateIndex
CREATE INDEX "formative_assessments_meeting_id_idx" ON "formative_assessments"("meeting_id");

-- CreateIndex
CREATE INDEX "formative_assessments_student_id_idx" ON "formative_assessments"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "formative_assessments_learning_objective_id_student_id_asse_key" ON "formative_assessments"("learning_objective_id", "student_id", "assessment_date");

-- CreateIndex
CREATE INDEX "summative_assessments_curriculum_module_id_idx" ON "summative_assessments"("curriculum_module_id");

-- CreateIndex
CREATE INDEX "summative_assessments_student_id_idx" ON "summative_assessments"("student_id");

-- CreateIndex
CREATE INDEX "summative_assessments_grading_component_id_idx" ON "summative_assessments"("grading_component_id");

-- CreateIndex
CREATE INDEX "summative_assessments_teaching_assignment_id_idx" ON "summative_assessments"("teaching_assignment_id");

-- CreateIndex
CREATE INDEX "summative_assessments_meeting_id_idx" ON "summative_assessments"("meeting_id");

-- CreateIndex
CREATE UNIQUE INDEX "summative_assessments_curriculum_module_id_student_id_gradi_key" ON "summative_assessments"("curriculum_module_id", "student_id", "grading_component_id");

-- CreateIndex
CREATE INDEX "grades_dashboard_teaching_assignment_id_student_id_idx" ON "grades_dashboard"("teaching_assignment_id", "student_id");

-- CreateIndex
CREATE INDEX "grades_dashboard_student_id_semester_id_idx" ON "grades_dashboard"("student_id", "semester_id");

-- CreateIndex
CREATE UNIQUE INDEX "grades_dashboard_student_id_semester_id_academic_year_id_key" ON "grades_dashboard"("student_id", "semester_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "raport_student_id_semester_id_idx" ON "raport"("student_id", "semester_id");

-- CreateIndex
CREATE UNIQUE INDEX "raport_student_id_semester_id_academic_year_id_key" ON "raport"("student_id", "semester_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_table_name_idx" ON "audit_logs"("table_name");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rombels" ADD CONSTRAINT "rombels_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rombels" ADD CONSTRAINT "rombels_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rombels" ADD CONSTRAINT "rombels_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rombels" ADD CONSTRAINT "rombels_homeroom_teacher_id_fkey" FOREIGN KEY ("homeroom_teacher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_rombel_id_fkey" FOREIGN KEY ("rombel_id") REFERENCES "rombels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_rombel_id_fkey" FOREIGN KEY ("rombel_id") REFERENCES "rombels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objectives_cp" ADD CONSTRAINT "learning_objectives_cp_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_cp_id_fkey" FOREIGN KEY ("cp_id") REFERENCES "learning_objectives_cp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objectives" ADD CONSTRAINT "learning_objectives_curriculum_module_id_fkey" FOREIGN KEY ("curriculum_module_id") REFERENCES "curriculum_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objectives" ADD CONSTRAINT "learning_objectives_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objectives" ADD CONSTRAINT "learning_objectives_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objectives" ADD CONSTRAINT "learning_objectives_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objectives" ADD CONSTRAINT "learning_objectives_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_teaching_journal_id_fkey" FOREIGN KEY ("teaching_journal_id") REFERENCES "teaching_journals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_curriculum_module_id_fkey" FOREIGN KEY ("curriculum_module_id") REFERENCES "curriculum_modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_learning_objective_id_fkey" FOREIGN KEY ("learning_objective_id") REFERENCES "learning_objectives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_rombel_id_fkey" FOREIGN KEY ("rombel_id") REFERENCES "rombels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_journals" ADD CONSTRAINT "teaching_journals_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_journals" ADD CONSTRAINT "teaching_journals_curriculum_module_id_fkey" FOREIGN KEY ("curriculum_module_id") REFERENCES "curriculum_modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_journals" ADD CONSTRAINT "teaching_journals_learning_objective_id_fkey" FOREIGN KEY ("learning_objective_id") REFERENCES "learning_objectives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_journals" ADD CONSTRAINT "teaching_journals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_journals" ADD CONSTRAINT "teaching_journals_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_journals" ADD CONSTRAINT "teaching_journals_rombel_id_fkey" FOREIGN KEY ("rombel_id") REFERENCES "rombels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_journals" ADD CONSTRAINT "teaching_journals_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_components" ADD CONSTRAINT "grading_components_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_components" ADD CONSTRAINT "grading_components_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_components" ADD CONSTRAINT "grading_components_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formative_assessments" ADD CONSTRAINT "formative_assessments_learning_objective_id_fkey" FOREIGN KEY ("learning_objective_id") REFERENCES "learning_objectives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formative_assessments" ADD CONSTRAINT "formative_assessments_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formative_assessments" ADD CONSTRAINT "formative_assessments_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formative_assessments" ADD CONSTRAINT "formative_assessments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formative_assessments" ADD CONSTRAINT "formative_assessments_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summative_assessments" ADD CONSTRAINT "summative_assessments_curriculum_module_id_fkey" FOREIGN KEY ("curriculum_module_id") REFERENCES "curriculum_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summative_assessments" ADD CONSTRAINT "summative_assessments_grading_component_id_fkey" FOREIGN KEY ("grading_component_id") REFERENCES "grading_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summative_assessments" ADD CONSTRAINT "summative_assessments_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summative_assessments" ADD CONSTRAINT "summative_assessments_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summative_assessments" ADD CONSTRAINT "summative_assessments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summative_assessments" ADD CONSTRAINT "summative_assessments_published_by_fkey" FOREIGN KEY ("published_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summative_assessments" ADD CONSTRAINT "summative_assessments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades_dashboard" ADD CONSTRAINT "grades_dashboard_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades_dashboard" ADD CONSTRAINT "grades_dashboard_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades_dashboard" ADD CONSTRAINT "grades_dashboard_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades_dashboard" ADD CONSTRAINT "grades_dashboard_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades_dashboard" ADD CONSTRAINT "grades_dashboard_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raport" ADD CONSTRAINT "raport_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raport" ADD CONSTRAINT "raport_teaching_assignment_id_fkey" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raport" ADD CONSTRAINT "raport_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raport" ADD CONSTRAINT "raport_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raport" ADD CONSTRAINT "raport_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raport" ADD CONSTRAINT "raport_rombel_id_fkey" FOREIGN KEY ("rombel_id") REFERENCES "rombels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raport" ADD CONSTRAINT "raport_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
