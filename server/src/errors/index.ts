import { ApiError } from './ApiError.ts';

export class BadRequestError extends ApiError {
  constructor(code: string, message = 'Bad Request') {
    super(400, code, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(code: string, message = 'Unauthorized') {
    super(401, code, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(code: string, message = 'Forbidden') {
    super(403, code, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(code: string, message = 'Not Found') {
    super(404, code, message);
  }
}

export class ConflictError extends ApiError {
  constructor(code: string, message = 'Conflict') {
    super(409, code, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(code: string, message = 'Internal Server Error') {
    super(500, code, message);
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(code: string, message = 'Service Unavailable') {
    super(503, code, message);
  }
}
