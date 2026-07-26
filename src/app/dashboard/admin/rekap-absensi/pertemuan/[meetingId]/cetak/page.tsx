import { AttendanceMeetingPrint } from "@/components/print/attendance-meeting-print";

export default function AdminMeetingPrintPage({ params }: { params: { meetingId: string } }) {
  return <AttendanceMeetingPrint endpoint={`/api/v1/admin/attendance/meetings/${params.meetingId}`} />;
}
