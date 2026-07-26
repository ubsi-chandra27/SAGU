import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AttendanceEditor } from "@/components/teacher/attendance-editor";

export default function AttendancePage({ params }: { params: { meetingId: string } }) {
  return (
    <DashboardLayout role="guru">
      <AttendanceEditor meetingId={params.meetingId} />
    </DashboardLayout>
  );
}
