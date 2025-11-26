import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
  field?: string;
}

/**
 * Send success response
 */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  res.status(statusCode).json(response);
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  error: string,
  statusCode = 500,
  code?: string,
  field?: string
): void {
  const response: ApiResponse<never> = {
    success: false,
    error,
  };

  if (code) {
    response.code = code;
  }

  if (field) {
    response.field = field;
  }

  res.status(statusCode).json(response);
}

/**
 * Send created response
 */
export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, 201, message);
}

/**
 * Send no content response
 */
export function sendNoContent(res: Response): void {
  res.status(204).send();
}
