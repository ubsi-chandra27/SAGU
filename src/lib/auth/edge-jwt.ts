import { ROLE, Role } from "@/lib/auth/constants";

type JwtHeader = {
  alg: string;
  typ?: string;
};

export type MiddlewareAccessPayload = {
  email: string;
  exp: number;
  fullName: string;
  iat?: number;
  role: Role;
  sub: string;
  username: string;
};

const textEncoder = new TextEncoder();
const validRoles = new Set<string>(Object.values(ROLE));

function base64UrlToBytes(value: string) {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

function decodeJsonSegment(segment: string) {
  try {
    const bytes = base64UrlToBytes(segment);
    if (!bytes) return null;
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJwtHeader(value: unknown): value is JwtHeader {
  return (
    isRecord(value) &&
    value.alg === "HS256" &&
    (value.typ === undefined || value.typ === "JWT")
  );
}

function isAccessPayload(value: unknown): value is MiddlewareAccessPayload {
  if (!isRecord(value)) return false;
  if (value.type === "refresh") return false;

  return (
    typeof value.sub === "string" &&
    value.sub.length > 0 &&
    typeof value.username === "string" &&
    typeof value.email === "string" &&
    typeof value.fullName === "string" &&
    typeof value.role === "string" &&
    validRoles.has(value.role) &&
    typeof value.exp === "number" &&
    Number.isFinite(value.exp)
  );
}

export async function verifyAccessTokenForMiddleware(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    return null;
  }

  const [headerSegment, payloadSegment, signatureSegment] = parts;
  const header = decodeJsonSegment(headerSegment);
  if (!isJwtHeader(header)) return null;

  const signature = base64UrlToBytes(signatureSegment);
  if (!signature) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const isSignatureValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    textEncoder.encode(`${headerSegment}.${payloadSegment}`)
  );

  if (!isSignatureValid) return null;

  const payload = decodeJsonSegment(payloadSegment);
  if (!isAccessPayload(payload)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return null;

  return payload;
}
