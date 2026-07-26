import { AttendanceMeetingPrint } from "@/components/print/attendance-meeting-print";

export default function GuruAttendancePrintPage({ params }: { params: { meetingId: string } }) {
  return <AttendanceMeetingPrint endpoint={`/api/v1/guru/meetings/${params.meetingId}/attendance`} />;
}
