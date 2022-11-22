import { NextFunction, Request, Response } from 'express';

export default function notFoundHandler(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  return response.status(404).json({
    message: `I'm sorry to disappoint you, but your route is in another Castle`,
  });
}
