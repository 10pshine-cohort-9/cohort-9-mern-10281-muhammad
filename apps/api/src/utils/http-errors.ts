import ApiError from "./api-error.js";

export class ConflictError extends ApiError {
  constructor(message = "Conflict", errors?: unknown) {
    super(409, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", errors?: unknown) {
    super(401, message, errors);
  }
}
