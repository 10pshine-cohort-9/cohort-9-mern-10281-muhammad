import ApiError, { ApiErrorDetails } from "./api-error.js";

export class ConflictError extends ApiError {
  constructor(message = "Conflict", errors?: ApiErrorDetails) {
    super(409, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", errors?: ApiErrorDetails) {
    super(401, message, errors);
  }
}
