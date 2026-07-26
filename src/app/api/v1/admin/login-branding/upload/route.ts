import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPrimarySchool, normalizeLoginBranding } from "@/lib/branding";
import { requireAdmin } from "@/lib/auth/request-user";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

const LIMITS = {
  logo: 2 * 1024 * 1024,
  background: 5 * 1024 * 1024,
} as const;

type UploadType = keyof typeof LIMITS;

function isUploadType(value: FormDataEntryValue | null): value is UploadType {
  return value === "logo" || value === "background";
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

function matchesImageSignature(bytes: Buffer, mimeType: string) {
  if (mimeType === "image/png") {
    return bytes.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );
  }

  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === "image/webp") {
    return (
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  const formData = await req.formData();
  const uploadTypeValue = formData.get("type");
  const fileValue = formData.get("file");

  if (!isUploadType(uploadTypeValue)) {
    return jsonError("Jenis upload tidak valid", 400);
  }

  if (!(fileValue instanceof File)) {
    return jsonError("File wajib diunggah", 400);
  }

  const extension = ALLOWED_TYPES.get(fileValue.type);
  if (!extension) {
    return jsonError("Format file harus PNG, JPG, JPEG, atau WebP", 400);
  }

  if (fileValue.size > LIMITS[uploadTypeValue]) {
    const limitMb = uploadTypeValue === "logo" ? "2 MB" : "5 MB";
    return jsonError(`Ukuran file maksimal ${limitMb}`, 400);
  }

  const safeFileName = `${randomUUID()}.${extension}`;
  const uploadRoot = path.resolve(
    process.cwd(),
    "public",
    "uploads",
    "branding"
  );
  const targetDir = path.resolve(uploadRoot, uploadTypeValue);
  const targetPath = path.resolve(targetDir, safeFileName);

  if (!targetPath.startsWith(targetDir + path.sep)) {
    return jsonError("Path upload tidak valid", 400);
  }

  await mkdir(targetDir, { recursive: true });
  const bytes = Buffer.from(await fileValue.arrayBuffer());

  if (!matchesImageSignature(bytes, fileValue.type)) {
    return jsonError("Isi file tidak sesuai format gambar yang diizinkan", 400);
  }

  await writeFile(targetPath, bytes);

  const url = `/uploads/branding/${uploadTypeValue}/${safeFileName}`;
  const school = await getPrimarySchool();
  const updated = await prisma.school.update({
    where: { id: school.id },
    data:
      uploadTypeValue === "logo"
        ? { logoUrl: url }
        : { loginBackgroundUrl: url },
  });

  return NextResponse.json(
    {
      success: true,
      message:
        uploadTypeValue === "logo"
          ? "Logo sekolah berhasil diunggah"
          : "Background login berhasil diunggah",
      data: {
        url,
        branding: normalizeLoginBranding(updated),
      },
    },
    { status: 200 }
  );
}
