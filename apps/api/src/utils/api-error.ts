export type ApiErrorDetails = Record<string, string[]>;

export default class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: ApiErrorDetails,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
