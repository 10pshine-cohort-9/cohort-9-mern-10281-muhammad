export default class ApiResponse<T = unknown> {
  success: boolean;

  constructor(
    statusCode: number,
    public data: T | null,
    public message: string,
    public errors?: unknown,
  ) {
    this.success = statusCode < 400;
  }
}
