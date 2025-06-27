import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { rolePermissions } from './assessment-role-permissions';
import { AssessmentAbilityDto } from '../dtos/assessment-ability.dto';

export const AssessmentAbilityUser = createParamDecorator(
  (action: string | undefined, context: ExecutionContext): AssessmentAbilityDto => {
    const request = context.switchToHttp().getRequest<Request>();
    const role = (request as any).assessmentRole as keyof typeof rolePermissions;
    const groupId = (request as any).assessmentGroupId as string | undefined;
    const allActions = rolePermissions[role] || [];
    let actions: string[] = allActions;
    if (action) {
      actions = allActions.includes(action) ? [action] : [];
    }
    const ability = new AssessmentAbilityDto(actions, role, groupId);
    (request as any).ability = ability; // Attach to request for guards
    return ability;
  },
); 