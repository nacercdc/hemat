import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ASSESSMENT_ACTION_KEY } from './assessment-action.decorator';
import { AssessmentAbilityDto } from '../dtos/assessment-ability.dto';

@Injectable()
export class AssessmentAbilityActionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAction = this.reflector.get<string>(ASSESSMENT_ACTION_KEY, context.getHandler());
    if (!requiredAction) return true; // No action required

    const request = context.switchToHttp().getRequest();
    // Ability should be set by @AssessmentAbilityUser or previous guard
    const ability: AssessmentAbilityDto = request.ability;
    if (!ability || !ability.actions.includes(requiredAction)) {
      throw new ForbiddenException(`You do not have permission to ${requiredAction} this resource`);
    }
    return true;
  }
} 