import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentMember } from '@database/entities';

@Injectable()
export class AssessmentRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(AssessmentMember)
    private readonly assessmentMemberRepository: Repository<AssessmentMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user?.isAdmin) {
      return true;
    }
    const userId = request.user?.id;
    const assessmentId = request.params?.assessmentId;
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
    return true;
  }
}
