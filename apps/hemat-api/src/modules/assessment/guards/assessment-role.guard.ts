import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentMember } from '@database/entities';
import { rolePermissions, methodToAction } from './assessment-role-permissions';
import { AbilityService } from '@shared/modules/auth/services/ability.service';
import { PermissionSubjectEnum } from '@shared/enums/permission.enum';

@Injectable()
export class AssessmentRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(AssessmentMember)
    private readonly assessmentMemberRepository: Repository<AssessmentMember>,
    private readonly abilityService: AbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId: string | undefined = user?.id;
    // Accept both :id and :assessmentId for flexibility
    const assessmentId: string | undefined =
      request.params?.id || request.params?.assessmentId;
    const method = request.method as string;
    const action = methodToAction[method] || 'read';
    // Default to assessment as subject, can be customized per route
    const subject: PermissionSubjectEnum = PermissionSubjectEnum.ASSESSMENT;

    // 1. If isAdmin, check system permissions (for read:assessment only)
    if (user?.isAdmin) {
      const ability = await this.abilityService.createForUser(user);
      if (action === 'read' && subject === PermissionSubjectEnum.ASSESSMENT) {
        if (ability.can(action, subject)) {
          return true;
        }
        throw new ForbiddenException(
          'Admin does not have read:assessment permission',
        );
      }
      // For other actions, fall through to member logic
    }

    // 2. Assessment membership/role logic
    if (!userId || !assessmentId) {
      throw new ForbiddenException('Missing user or assessment context');
    }
    const member = await this.assessmentMemberRepository.findOne({
      where: { assessmentId, userId },
    });
    if (!member) {
      throw new ForbiddenException('You are not a member of this assessment');
    }
    request.assessmentRole = member.role;
    request.assessmentGroupId = member.groupId;
    const allowedActions = rolePermissions[member.role];
    if (!allowedActions || !allowedActions.includes(action)) {
      throw new ForbiddenException(
        'You do not have permission for this action',
      );
    }
    return true;
  }
}
