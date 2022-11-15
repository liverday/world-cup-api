export default class AppError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

export function badRequest(message: string): AppError {
  return new AppError(400, message);
}

export function notFound(message: string): AppError {
  return new AppError(404, message);
}
