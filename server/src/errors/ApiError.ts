export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;

    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    // Capture the stack trace for debugging purposes
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
