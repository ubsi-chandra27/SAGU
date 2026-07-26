import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AttendanceRecapPage } from "@/components/admin/attendance-recap-page";

export default function AdminAttendanceRecapPage() {
  return (
    <DashboardLayout role="admin">
      <AttendanceRecapPage />
    </DashboardLayout>
  );
}
