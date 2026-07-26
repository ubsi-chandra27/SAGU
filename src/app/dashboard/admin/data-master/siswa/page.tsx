import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { MasterDataPage } from "@/components/admin/master-data-page";

export default function StudentsPage() {
  return (
    <DashboardLayout role="admin">
      <MasterDataPage entity="students" />
    </DashboardLayout>
  );
}
