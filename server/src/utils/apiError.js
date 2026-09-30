export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = null) {
    return new ApiError(message, 400, errors);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(message, 409);
  }

  static unprocessable(message = 'Validation failed', errors = null) {
    return new ApiError(message, 422, errors);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(message, 500);
  }
}
