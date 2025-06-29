import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AssessmentAbilityDto } from './assessment-ability.dto';

export const AssessmentAbilityUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AssessmentAbilityDto => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
