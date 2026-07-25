export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function badRequest(message: string, details?: unknown) {
  return new HttpError(400, message, details);
}

export function unauthorized(message = "Unauthorized") {
  return new HttpError(401, message);
}

export function forbidden(message = "Forbidden") {
  return new HttpError(403, message);
}

export function notFound(message = "Not Found") {
  return new HttpError(404, message);
}

export function validationError(message: string, details?: unknown) {
  return new HttpError(422, message, details);
}

export function internalServerError(message = "Internal Server Error") {
  return new HttpError(500, message);
}
