import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MemberRole } from '@shared/enums';
import { AssessmentMember, AssessmentGroup, User } from '@database/entities';
import { Repository } from 'typeorm';

export class AssessmentMemberValidator {
  static async fetchGroupMembers(
    manager: any,
    groupId: string,
    assessmentId: string,
  ): Promise<AssessmentMember[]> {
    return manager
      .getRepository(AssessmentMember)
      .find({ where: { groupId, assessmentId } });
  }

  static async fetchAssessmentMembers(
    manager: any,
    assessmentId: string,
  ): Promise<AssessmentMember[]> {
    return manager
      .getRepository(AssessmentMember)
      .find({ where: { assessmentId } });
  }

  static async checkAssessmentExists(
    manager: any,
    assessmentId: string,
  ): Promise<void> {
    const exists = await manager
      .getRepository(AssessmentGroup)
      .exists({ where: { assessmentId } });
    if (!exists) throw new NotFoundException('Assessment not found');
  }

  static async checkGroupExists(
    manager: any,
    groupId: string,
    assessmentId: string,
  ): Promise<void> {
    const exists = await manager
      .getRepository(AssessmentGroup)
      .exists({ where: { id: groupId, assessmentId } });
    if (!exists) throw new NotFoundException('Assessment group not found');
  }

  static async checkUserExists(manager: any, userId: string): Promise<void> {
    const exists = await manager
      .getRepository(User)
      .exists({ where: { id: userId } });
    if (!exists) throw new NotFoundException('User not found');
  }

  static async checkDuplicateMembership(
    manager: any,
    userId: string,
    assessmentId: string,
  ): Promise<void> {
    const count = await manager
      .getRepository(AssessmentMember)
      .count({ where: { userId, assessmentId } });
    if (count > 1) {
      throw new BadRequestException(
        `User ${userId} already exists in multiple groups for this assessment. This is not allowed.`,
      );
    }
  }

  static validateGroupRoleConstraints(
    role: MemberRole,
    groupMembers: AssessmentMember[],
  ) {
    // Rule 1: Only one TEAM_LEADER per group
    const teamLeaderCount = groupMembers.filter(
      (m) => m.role === MemberRole.TEAM_LEADER,
    ).length;
    if (role === MemberRole.TEAM_LEADER && teamLeaderCount > 0) {
      throw new BadRequestException(
        'Only one TEAM_LEADER is allowed per group.',
      );
    }

    // Rule 2: Cannot have both PRIMARY and TEAM_LEADER in same group
    const hasPrimary = groupMembers.some((m) => m.role === MemberRole.PRIMARY);
    const hasTeamLeader = groupMembers.some((m) => m.role === MemberRole.TEAM_LEADER);

    if (role === MemberRole.PRIMARY && hasTeamLeader) {
      throw new BadRequestException(
        'Cannot add PRIMARY to a group that already has a TEAM_LEADER.',
      );
    }
    if (role === MemberRole.TEAM_LEADER && hasPrimary) {
      throw new BadRequestException(
        'Cannot add TEAM_LEADER to a group that already has a PRIMARY.',
      );
    }
  }

  static validateAssessmentPrimaryConstraint(
    role: MemberRole,
    allMembers: AssessmentMember[],
  ) {
    // Rule: Only one PRIMARY in entire assessment
    if (role === MemberRole.PRIMARY) {
      const hasPrimary = allMembers.some((m) => m.role === MemberRole.PRIMARY);
      if (hasPrimary) {
        throw new BadRequestException('Only one PRIMARY member is allowed per assessment');
      }
    }
  }

  static validateIsMember(
    member: AssessmentMember | undefined,
    userId: string,
  ) {
    if (!member) {
      throw new BadRequestException(
        `User ${userId} is not a member of this assessment and cannot be moved.`,
      );
    }
  }

  static validateSourceGroupNotEmpty(
    sourceGroupMembers: AssessmentMember[],
    promoteUserId?: string,
  ) {
    // Rule: Source group cannot be empty after move
    if (sourceGroupMembers.length <= 2 && !promoteUserId) {
      throw new BadRequestException('Source group cannot be empty after move, promoteUserId is required');
    }
  }
}
