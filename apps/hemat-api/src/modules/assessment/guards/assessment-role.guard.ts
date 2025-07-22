import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { AssessmentMember } from '@database/entities';
import { AbilityService } from '@shared/modules/auth/services';
import { PermissionSubjectEnum } from '@shared/enums/permission.enum';
import { rolePermissions, methodToAction } from './assessment-role-permissions';
import { ABILITIES } from '@shared/constants';
import { AbilityParams } from '@shared/types';
import { MemberRole } from '@shared/enums/member.enum';
import { AssessmentDomain } from '@database/entities';
import { AssessmentSubComponent } from '@database/entities';
import { AssessmentComponent } from '@database/entities';
import { AssessmentMeasurementScaleSubComponent } from '@database/entities';

@Injectable()
export class AssessmentRoleGuard implements CanActivate {
  private readonly logger = new Logger(AssessmentRoleGuard.name);

  constructor(
    @InjectRepository(AssessmentMember)
    private readonly assessmentMemberRepository: Repository<AssessmentMember>,
    @InjectRepository(AssessmentDomain)
    private readonly assessmentDomainRepository: Repository<AssessmentDomain>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
    @InjectRepository(AssessmentMeasurementScaleSubComponent)
    private readonly assessmentMeasurementScaleSubComponentRepository: Repository<AssessmentMeasurementScaleSubComponent>,
    private readonly abilityService: AbilityService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId: string | undefined = user?.id;
    let assessmentId: string | undefined =
      request.params?.assessmentId || request.params?.id;
    // Patch: If only domainId is present, resolve assessmentId from domain
    if (!request.params?.assessmentId && request.params?.id) {
      const domain = await this.assessmentDomainRepository.findOne({ where: { id: request.params.id } });
      if (domain) {
        assessmentId = domain.assessmentId;
      } else {
        // Try to resolve as AssessmentSubComponent
        const subComponent = await this.assessmentSubComponentRepository.findOne({ where: { id: request.params.id } });
        if (subComponent) {
          assessmentId = subComponent.assessmentId;
        } else {
          // Try to resolve as AssessmentComponent
          const component = await this.assessmentComponentRepository.findOne({ where: { id: request.params.id } });
          if (component) {
            assessmentId = component.assessmentId;
          } else {
            // Try to resolve as AssessmentMeasurementScaleSubComponent
            const measurementScaleSubComponent = await this.assessmentMeasurementScaleSubComponentRepository.findOne({ where: { id: request.params.id } });
            if (measurementScaleSubComponent) {
              // Get the subComponentId, then look up the AssessmentSubComponent to get assessmentId
              const subComponent = await this.assessmentSubComponentRepository.findOne({ where: { id: measurementScaleSubComponent.subComponentId } });
              if (subComponent) {
                assessmentId = subComponent.assessmentId;
              }
            }
          }
        }
      }
    }
    this.logger.debug(`AssessmentRoleGuard: Resolved assessmentId: ${assessmentId} for userId: ${userId}`);
    const method = request.method as string;
    const action = methodToAction[method] || 'read';
    const subject = PermissionSubjectEnum.ASSESSMENT;

    this.logger.debug(
      `Checking access for user: ${userId}, assessment: ${assessmentId}, action: ${action}`,
    );

    // 1. Check for public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      this.logger.debug('Route is public, allowing access');
      return true;
    }

    // 2. Check admin permissions
    if (user?.isAdmin) {
      const abilityParams = this.reflector.get<AbilityParams>(
        ABILITIES,
        context.getHandler(),
      );
      if (abilityParams?.permissions) {
        const ability = await this.abilityService.createForUser(user);
        this.logger.debug(
          `Admin ability rules: ${JSON.stringify(ability.rules)}`,
        );
        if (ability.can(action, subject)) {
          this.logger.debug(`Admin has ${action}:${subject} permission`);
          return true;
        }
        this.logger.warn(`Admin lacks ${action}:${subject} permission`);
        throw new ForbiddenException(
          `Admin does not have ${action}:${subject} permission`,
        );
      }
      this.logger.warn('No permissions defined for this route');
      throw new ForbiddenException('No permissions defined for this route');
    }

    // 3. Non-admin: Assessment membership/role logic
    if (!userId) {
      this.logger.warn('Missing user context');
      throw new ForbiddenException('Missing user context');
    }

    // For routes without assessmentId (e.g., findAll), allow read access and let service filter
    if (!assessmentId && action === 'read') {
      this.logger.debug(
        `No assessmentId provided for user ${userId}, allowing read access for findAll`,
      );
      return true;
    }

    // For routes with assessmentId (e.g., findOne, getDomainProgress)
    if (!assessmentId) {
      this.logger.warn('Missing assessment context');
      throw new ForbiddenException('Missing assessment context');
    }

    this.logger.debug(
      `Querying AssessmentMember for userId: ${userId}, assessmentId: ${assessmentId}`,
    );
    const member = await this.assessmentMemberRepository.findOne({
      where: { assessmentId, userId, deletedAt: IsNull() },
    });
    this.logger.debug(`AssessmentRoleGuard: Found member: ${JSON.stringify(member)}`);

    if (!member) {
      this.logger.warn(
        `No AssessmentMember found for userId: ${userId}, assessmentId: ${assessmentId}`,
      );
      throw new ForbiddenException('You are not a member of this assessment');
    }

    // Ensure role is a valid MemberRole enum value
    const memberRole = Object.values(MemberRole).includes(
      member.role as MemberRole,
    )
      ? (member.role as MemberRole)
      : null;
    if (!memberRole) {
      this.logger.warn(`Invalid member role: ${member.role}`);
      throw new ForbiddenException('Invalid member role');
    }

    // Check if the member's role allows the action
    const allowedActions = rolePermissions[memberRole];
    this.logger.debug(
      `Member role: ${memberRole}, allowed actions: ${allowedActions}`,
    );
    if (!allowedActions || !allowedActions.includes(action)) {
      this.logger.warn(`Action ${action} not allowed for role ${memberRole}`);
      throw new ForbiddenException(
        'You do not have permission for this action',
      );
    }

    // Attach assessment role and group to the request
    request.user = {
      ...user,
      assessmentRole: memberRole,
      assessmentGroupId: member.groupId,
    };
    this.logger.debug(
      `Access granted for userId: ${userId}, role: ${memberRole}, groupId: ${member.groupId}`,
    );

    return true;
  }
}
