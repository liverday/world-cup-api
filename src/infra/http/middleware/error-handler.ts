/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from '@/application/error/app-error';
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: Error,
  _: Request,
  response: Response,
  _2: NextFunction,
): Response {
  if (err instanceof AppError) {
    return response.status(err.status).json({ message: err.message });
  }

  console.log(`🧨 [error-handler] there was an unhandled error: `, err);

  return response.status(500).json({
    message: 'Internal Server Error',
  });
}
