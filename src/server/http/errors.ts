/**
 * Errors that map onto an HTTP response. Anything else escaping a handler is a
 * bug and becomes a 500 with no detail leaked to the client.
 */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message: string, code: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (message: string, code = 'BAD_REQUEST') =>
  new AppError(400, message, code);

export const unauthorized = (message = 'Unauthorized', code = 'UNAUTHORIZED') =>
  new AppError(401, message, code);

export const forbidden = (message = 'Forbidden', code = 'FORBIDDEN') =>
  new AppError(403, message, code);

/**
 * Also used where "exists but is not yours" applies: answering 403 there would
 * confirm the id exists to someone who has no business knowing that.
 */
export const notFound = (message = 'Not found', code = 'NOT_FOUND') =>
  new AppError(404, message, code);

export const conflict = (message: string, code = 'CONFLICT') =>
  new AppError(409, message, code);
