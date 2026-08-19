import ApiError, { ApiErrorDetails } from "./api-error.js";

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request", errors?: ApiErrorDetails) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", errors?: ApiErrorDetails) {
    super(401, message, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found", errors?: ApiErrorDetails) {
    super(404, message, errors);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict", errors?: ApiErrorDetails) {
    super(409, message, errors);
  }
}
