import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { Request, Response } from 'express';
// import { I18nContext } from 'nestjs-i18n';

type CustomHttpException = {
  message: string;
  debugMessage: any;
  errors?: Record<string, string[]>;
  debugErrors?: Record<string, string[]>;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  // private i18n: I18nContext<Record<string, unknown>> | undefined;
  private isProduction: boolean;

  constructor(isProduction: boolean = true) {
    this.isProduction = isProduction;
  }

  @SentryExceptionCaptured()
  async catch(exception: unknown, host: ArgumentsHost) {
    // this.i18n = I18nContext.current(host);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let exceptionName: string = 'Error';
    let message: string;
    let errors: Record<string, string[]> | undefined = undefined;
    let debugMessage: any;
    let debugErrors: Record<string, string[]> | undefined = undefined;

    if (exception instanceof HttpException) {
      const httpException = this.httpException(exception.getResponse());

      statusCode = exception.getStatus();
      exceptionName = exception.name;
      message = httpException.message;
      debugMessage = httpException.debugMessage;
      errors = httpException.errors;
      debugErrors = httpException.debugErrors;
    } else if (exception instanceof Error) {
      exceptionName = exception.name;
      // message = this.translate('common.exception.unexpectedError');
      message = 'Internal Server Error';
      debugMessage = exception.message;
    } else {
      // message = this.translate('common.exception.unexpectedError');
      message = 'Internal Server Error';
      debugMessage = `Unknown error type: ${JSON.stringify(exception)}`;
    }

    this.logger.error(
      `[${exceptionName}] Status: ${statusCode}, Path: ${request.url}, Client Message: "${message}"`,
      debugMessage,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(errors && { errors }),
      ...(!this.isProduction && {
        debug: {
          message: debugMessage,
          errors: debugErrors,
          stack: exception instanceof Error ? exception.stack : undefined,
        },
      }),
    });
  }

  private httpException(response: string | object): CustomHttpException {
    if (typeof response === 'string') {
      return { message: response, debugMessage: response };
    }

    if (typeof response === 'object') {
      let errors: Record<string, string[]> | undefined = undefined;
      let debugErrors: Record<string, string[]> | undefined = undefined;

      if ('errors' in response) {
        const responseErrors = response.errors as Record<string, string[]>;
        const clientErrors: Record<string, string[]> = {};
        Object.keys(responseErrors).forEach((key) => {
          if (responseErrors[key]) {
            clientErrors[key] = responseErrors[key].map((message: string) =>
             message,
            );
          }
        });

        errors = clientErrors;
        debugErrors = responseErrors;
      }

      if ('message' in response) {
        let message =
          typeof response.message === 'string'
            ? response.message
            : 'Unhandled HTTP Exception';
        // ? this.translate(response.message)
        // : this.translate('common.exception.unhandledHTTPError');

        if (Array.isArray(response.message)) {
          message = response.message
            .map((message: string) => message)
            .join(', ');
        }

        return { message, debugMessage: response.message, errors, debugErrors };
      }
    }

    return {
      // message: this.translate('common.exception.unhandledHTTPError'),
      message: 'Unhandled HTTP Exception',
      debugMessage: response,
    };
  }

  // private translate(str: string): string {
  //   let [message, param] = str.split('args:');
  //   message = message?.trim() ?? 'common.exception.unexpectedError';
  //   const args = param
  //     ?.split('|')
  //     ?.reduce((acc: Record<string, string>, current: string) => {
  //       let [key, value] = current.split(':');

  //       if (key && value) {
  //         acc[key.trim()] = value.trim();
  //       }

  //       return acc;
  //     }, {});

  //   return this.i18n ? this.i18n.t(message, { args }) : message;
  // }
}