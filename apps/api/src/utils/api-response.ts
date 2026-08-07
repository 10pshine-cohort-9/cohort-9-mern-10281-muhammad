export default class ApiResponse<T> {
  success: boolean;

  constructor(
    statusCode: number,
    public data: T,
    public message: string = "Success",
  ) {
    this.success = statusCode < 400;
  }
}
