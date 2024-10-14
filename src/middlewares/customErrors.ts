// src/middlewares/customErrors.ts
import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'La solicitud no es válida') {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(message, StatusCodes.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Error de validación') {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, false);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Servicio no disponible') {
    super(message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Error de base de datos') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, false);
  }
}
