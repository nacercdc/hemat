import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { EXCEPTION_ERRORS } from '../constants';
import { SentryExceptionCaptured } from '@sentry/nestjs';

interface ExceptionResponse {
  message?: string | string[] | object;
  [key: string]: any;
}

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res = exception.getResponse() as string | ExceptionResponse;

    const message =
      typeof res === 'object' && 'message' in res ? res.message : res;

    response.status(status).json({
      statusCode: status,
      error: EXCEPTION_ERRORS[status] ?? 'Bad Request',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
