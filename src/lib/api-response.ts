import { NextResponse } from "next/server";

export function ok<T>(message: string, data: T, status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function created<T>(message: string, data: T) {
  return ok(message, data, 201);
}
