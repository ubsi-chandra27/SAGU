import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/request-user";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const csv = "nis,nisn,nama_lengkap,gender,nama_rombel\r\n100002,0012345679,Siti Aminah,PEREMPUAN,X-IPA-1\r\n";

  return new Response(csv, {
    headers: {
      "Content-Disposition": 'attachment; filename="template-import-siswa-sagu.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    },
    status: 200,
  });
}
