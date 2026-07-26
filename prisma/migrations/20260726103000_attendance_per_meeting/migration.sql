-- Attendance per meeting migration.
-- Existing seeded attendance rows are preserved by backfilling meeting_id from
-- matching rombel assignment and attendance_date before the column is required.

ALTER TABLE "attendances"
ADD COLUMN "meeting_id" UUID;

UPDATE "attendances" AS a
SET "meeting_id" = m."id"
FROM "meetings" AS m
INNER JOIN "teaching_assignments" AS ta
  ON ta."id" = m."teaching_assignment_id"
WHERE a."meeting_id" IS NULL
  AND a."rombel_id" = ta."rombel_id"
  AND a."attendance_date" = m."meeting_date";

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "attendances" WHERE "meeting_id" IS NULL) THEN
    RAISE EXCEPTION 'attendance_per_meeting migration cannot continue: some attendance rows could not be matched to meetings';
  END IF;
END $$;

DROP INDEX IF EXISTS "attendances_student_id_attendance_date_key";

ALTER TABLE "attendances"
ALTER COLUMN "meeting_id" SET NOT NULL;

CREATE INDEX "attendances_meeting_id_idx" ON "attendances"("meeting_id");

CREATE UNIQUE INDEX "attendances_student_id_meeting_id_key"
ON "attendances"("student_id", "meeting_id");

ALTER TABLE "attendances"
ADD CONSTRAINT "attendances_meeting_id_fkey"
FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
