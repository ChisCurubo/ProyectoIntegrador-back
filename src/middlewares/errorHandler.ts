import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './customErrors';

// Middleware para manejar errores
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Verifica si los encabezados ya fueron enviados
  if (res.headersSent) {
    return next(err);
  }

  // Si el error es una instancia de AppError (nuestros errores personalizados)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode, // Incluir statusCode en la respuesta
      message: err.message,
    });
  }

  // En caso de que sea otro tipo de error (no controlado)
  console.error('Error no controlado:', err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR, // Incluye el statusCode en errores no controlados
    message: 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Stack solo en desarrollo
  });
}
