import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth/request-user";
import { hasFormulaInjectionRisk, parseCsv } from "@/lib/csv";

const requiredHeaders = ["nis", "nisn", "nama_lengkap", "gender", "nama_rombel"];
const maxCsvSize = 512 * 1024;

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) return fail("File CSV tidak ditemukan", 400);
  if (file.size > maxCsvSize) return fail("Ukuran file CSV maksimal 512KB", 400);

  const rows = parseCsv(await file.text());
  const headers = Object.keys(rows[0] || {});
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    return fail("Header CSV tidak lengkap", 400, { missingHeaders });
  }

  const nisValues = rows.map((row) => row.nis).filter(Boolean);
  const nisnValues = rows.map((row) => row.nisn).filter(Boolean);
  const rombelNames = [...new Set(rows.map((row) => row.nama_rombel).filter(Boolean))];

  const [existingStudents, rombels] = await Promise.all([
    prisma.student.findMany({
      where: { OR: [{ nis: { in: nisValues } }, { nisn: { in: nisnValues } }] },
      select: { nis: true, nisn: true },
    }),
    prisma.rombel.findMany({
      where: { deletedAt: null, name: { in: rombelNames } },
      select: { id: true, name: true },
    }),
  ]);

  const existingNis = new Set(existingStudents.map((student) => student.nis));
  const existingNisn = new Set(existingStudents.map((student) => student.nisn));
  const rombelByName = new Map(rombels.map((rombel) => [rombel.name.toLowerCase(), rombel]));
  const seenNis = new Set<string>();
  const seenNisn = new Set<string>();

  const preview = rows.map((row, index) => {
    const errors: string[] = [];
    const line = index + 2;

    if (!row.nis) errors.push("NIS wajib diisi");
    if (!row.nisn) errors.push("NISN wajib diisi");
    if (!row.nama_lengkap) errors.push("Nama lengkap wajib diisi");
    if (!["LAKI_LAKI", "PEREMPUAN"].includes(row.gender)) {
      errors.push("Gender harus LAKI_LAKI atau PEREMPUAN");
    }
    if (!row.nama_rombel) errors.push("Nama rombel wajib diisi");
    if (row.nis && seenNis.has(row.nis)) errors.push("NIS duplikat di file");
    if (row.nisn && seenNisn.has(row.nisn)) errors.push("NISN duplikat di file");
    if (row.nis && existingNis.has(row.nis)) errors.push("NIS sudah ada di database");
    if (row.nisn && existingNisn.has(row.nisn)) errors.push("NISN sudah ada di database");
    if (row.nama_rombel && !rombelByName.has(row.nama_rombel.toLowerCase())) {
      errors.push("Rombel tidak ditemukan");
    }
    for (const value of Object.values(row)) {
      if (hasFormulaInjectionRisk(value)) {
        errors.push("Nilai CSV tidak boleh diawali =, +, -, atau @");
        break;
      }
    }

    if (row.nis) seenNis.add(row.nis);
    if (row.nisn) seenNisn.add(row.nisn);

    return {
      errors,
      line,
      valid: errors.length === 0,
      values: {
        fullName: row.nama_lengkap,
        gender: row.gender,
        nis: row.nis,
        nisn: row.nisn,
        rombelId: rombelByName.get(row.nama_rombel.toLowerCase())?.id || null,
        rombelName: row.nama_rombel,
      },
    };
  });

  return ok("Preview import siswa berhasil dibuat", {
    failed: preview.filter((row) => !row.valid).length,
    rows: preview,
    success: preview.filter((row) => row.valid).length,
    total: preview.length,
  });
}
