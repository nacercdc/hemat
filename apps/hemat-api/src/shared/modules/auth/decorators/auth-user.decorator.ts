import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthDto } from '../dtos';

export const AuthUser = createParamDecorator<any>(
  (data, context: ExecutionContext): AuthDto => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.user;
  },
);
