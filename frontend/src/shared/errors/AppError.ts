export class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly error: string;

  constructor(message: string, statusCode: number = 400, error: string = 'BAD_REQUEST') {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}