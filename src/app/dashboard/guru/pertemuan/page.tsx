import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { TeacherMeetingsPage } from "@/components/teacher/teacher-meetings-page";

export default function MeetingsPage() {
  return (
    <DashboardLayout role="guru">
      <TeacherMeetingsPage />
    </DashboardLayout>
  );
}
