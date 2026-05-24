import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.error,
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  console.error(err);

  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor.',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}