export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(statusCode: number, code: string, message?: string) {
    super(message ?? code);

    this.statusCode = statusCode;
    this.code = code;

    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    // Capture the stack trace for debugging purposes
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
