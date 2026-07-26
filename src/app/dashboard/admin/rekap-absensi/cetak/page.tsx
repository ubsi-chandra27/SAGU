import { AttendanceRecapPrint } from "@/components/print/attendance-recap-print";

export default function AdminRecapPrintPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") params.set(key, value);
  });

  return <AttendanceRecapPrint query={params.toString()} />;
}
