import { BadRequestException } from '@nestjs/common';
import { MemberRole, AssessmentStatus } from '@shared/enums';
import { AssessmentMemberValidator } from '../utils/assessment-member.validator';
import { AssessmentMember, Assessment } from '../../../database/entities';

export class RoleTransitionService {
  static async updateRole({
    manager,
    member,
    targetRole,
    promoteUserId,
    assessmentId,
    groupId,
  }: {
    manager: any;
    member: AssessmentMember;
    targetRole: MemberRole;
    promoteUserId?: string;
    assessmentId: string;
    groupId: string;
  }): Promise<AssessmentMember> {
    // Prevent role change if assessment is in progress or beyond and member is PRIMARY or TEAM_LEADER
    const assessment = await manager.getRepository(Assessment).findOne({ where: { id: assessmentId } });
    if (
      assessment &&
      [AssessmentStatus.IN_PROGRESS, AssessmentStatus.CLOSED, AssessmentStatus.COMPLETED].includes(assessment.status) &&
      (member.role === MemberRole.PRIMARY || member.role === MemberRole.TEAM_LEADER)
    ) {
      throw new BadRequestException('Cannot change role of PRIMARY or TEAM_LEADER after assessment has started filling.');
    }

    const allMembers = await AssessmentMemberValidator.fetchAssessmentMembers(
      manager,
      assessmentId,
    );
    const groupMembers = await AssessmentMemberValidator.fetchGroupMembers(
      manager,
      groupId,
      assessmentId,
    );
    const otherGroupMembers = groupMembers.filter((m) => m.id !== member.id);

    // MEMBER -> PRIMARY: Not allowed
    if (
      member.role === MemberRole.MEMBER &&
      targetRole === MemberRole.PRIMARY
    ) {
      throw new BadRequestException(
        'Cannot update directly from MEMBER to PRIMARY.',
      );
    }

    // MEMBER -> TEAM_LEADER: promoteUserId required
    if (
      member.role === MemberRole.MEMBER &&
      targetRole === MemberRole.TEAM_LEADER
    ) {
      if (!promoteUserId) {
        throw new BadRequestException(
          'promoteUserId is required when updating MEMBER to TEAM_LEADER.',
        );
      }
      const promoteUser = otherGroupMembers.find(
        (m) => m.id === promoteUserId && m.role === MemberRole.MEMBER,
      );
      if (!promoteUser) {
        throw new BadRequestException(
          'promoteUserId must be another MEMBER in the same group.',
        );
      }
      // Demote any existing TEAM_LEADER in the group
      const oldTeamLeader = otherGroupMembers.find(
        (m) => m.role === MemberRole.TEAM_LEADER,
      );
      if (oldTeamLeader) {
        await manager
          .getRepository(AssessmentMember)
          .update({ id: oldTeamLeader.id }, { role: MemberRole.MEMBER });
      }
      // Promote the specified user to TEAM_LEADER
      await manager
        .getRepository(AssessmentMember)
        .update({ id: promoteUser.id }, { role: MemberRole.TEAM_LEADER });
      // The current member remains MEMBER
      return member;
    }

    // TEAM_LEADER -> MEMBER: promoteUserId required
    if (
      member.role === MemberRole.TEAM_LEADER &&
      targetRole === MemberRole.MEMBER
    ) {
      if (!promoteUserId) {
        throw new BadRequestException(
          'promoteUserId is required when updating TEAM_LEADER to MEMBER.',
        );
      }
      const promoteUser = otherGroupMembers.find(
        (m) => m.id === promoteUserId && m.role === MemberRole.MEMBER,
      );
      if (!promoteUser) {
        throw new BadRequestException(
          'promoteUserId must be another MEMBER in the same group.',
        );
      }
      // Promote the specified user to TEAM_LEADER
      await manager
        .getRepository(AssessmentMember)
        .update({ id: promoteUser.id }, { role: MemberRole.TEAM_LEADER });
      // The current member becomes MEMBER
      member.role = MemberRole.MEMBER;
      return await manager.getRepository(AssessmentMember).save(member);
    }

    // TEAM_LEADER -> PRIMARY: allowed, demote old PRIMARY
    if (
      member.role === MemberRole.TEAM_LEADER &&
      targetRole === MemberRole.PRIMARY
    ) {
      const oldPrimary = allMembers.find(
        (m) => m.role === MemberRole.PRIMARY && m.id !== member.id,
      );
      if (oldPrimary) {
        // Demote old PRIMARY to TEAM_LEADER in their group if possible, else MEMBER
        const oldPrimaryGroupMembers =
          await AssessmentMemberValidator.fetchGroupMembers(
            manager,
            oldPrimary.groupId,
            assessmentId,
          );
        const hasTeamLeader = oldPrimaryGroupMembers.some(
          (m) => m.role === MemberRole.TEAM_LEADER,
        );
        if (!hasTeamLeader) {
          await manager
            .getRepository(AssessmentMember)
            .update({ id: oldPrimary.id }, { role: MemberRole.TEAM_LEADER });
        } else {
          await manager
            .getRepository(AssessmentMember)
            .update({ id: oldPrimary.id }, { role: MemberRole.MEMBER });
        }
      }
      // Cannot have TEAM_LEADER in the same group
      const groupHasTeamLeader = otherGroupMembers.some(
        (m) => m.role === MemberRole.TEAM_LEADER,
      );
      if (groupHasTeamLeader) {
        throw new BadRequestException(
          'Cannot set PRIMARY in a group that already has a TEAM_LEADER.',
        );
      }
      member.role = MemberRole.PRIMARY;
      return await manager.getRepository(AssessmentMember).save(member);
    }

    // PRIMARY -> TEAM_LEADER: promoteUserId required (must be a TEAM_LEADER in any group)
    if (
      member.role === MemberRole.PRIMARY &&
      targetRole === MemberRole.TEAM_LEADER
    ) {
      if (!promoteUserId) {
        throw new BadRequestException(
          'promoteUserId is required when updating PRIMARY to TEAM_LEADER.',
        );
      }
      const promoteUser = allMembers.find(
        (m) => m.id === promoteUserId && m.role === MemberRole.TEAM_LEADER,
      );
      if (!promoteUser) {
        throw new BadRequestException(
          'promoteUserId must be a TEAM_LEADER in any group.',
        );
      }
      // Promote the specified TEAM_LEADER to PRIMARY
      await manager
        .getRepository(AssessmentMember)
        .update({ id: promoteUser.id }, { role: MemberRole.PRIMARY });
      // The current member becomes TEAM_LEADER in their group if possible, else MEMBER
      const groupHasTeamLeader = otherGroupMembers.some(
        (m) => m.role === MemberRole.TEAM_LEADER,
      );
      if (!groupHasTeamLeader) {
        member.role = MemberRole.TEAM_LEADER;
      } else {
        member.role = MemberRole.MEMBER;
      }
      return await manager.getRepository(AssessmentMember).save(member);
    }

    // PRIMARY -> MEMBER: Not allowed
    if (
      member.role === MemberRole.PRIMARY &&
      targetRole === MemberRole.MEMBER
    ) {
      throw new BadRequestException(
        'Cannot update directly from PRIMARY to MEMBER.',
      );
    }

    // Update to TEAM_LEADER (when another TEAM_LEADER exists in group): demote old TEAM_LEADER
    if (targetRole === MemberRole.TEAM_LEADER) {
      const oldTeamLeader = otherGroupMembers.find(
        (m) => m.role === MemberRole.TEAM_LEADER,
      );
      if (oldTeamLeader) {
        await manager
          .getRepository(AssessmentMember)
          .update({ id: oldTeamLeader.id }, { role: MemberRole.MEMBER });
      }
      // Cannot have PRIMARY in the same group
      const groupHasPrimary = otherGroupMembers.some(
        (m) => m.role === MemberRole.PRIMARY,
      );
      if (groupHasPrimary) {
        throw new BadRequestException(
          'Cannot set TEAM_LEADER in a group that already has a PRIMARY.',
        );
      }
      member.role = MemberRole.TEAM_LEADER;
      return await manager.getRepository(AssessmentMember).save(member);
    }

    // Update to MEMBER (from MEMBER): just update
    if (targetRole === MemberRole.MEMBER) {
      member.role = MemberRole.MEMBER;
      return await manager.getRepository(AssessmentMember).save(member);
    }

    throw new BadRequestException('This role update is not allowed.');
  }

  static async moveMember({
    manager,
    member,
    toGroupId,
    promoteUserId,
    assessmentId,
  }: {
    manager: any;
    member: AssessmentMember;
    toGroupId: string;
    promoteUserId?: string;
    assessmentId: string;
  }): Promise<void> {
    // Prevent move if assessment is in progress or beyond and member is PRIMARY or TEAM_LEADER
    const assessment = await manager.getRepository(Assessment).findOne({ where: { id: assessmentId } });
    if (
      assessment &&
      [AssessmentStatus.IN_PROGRESS, AssessmentStatus.CLOSED, AssessmentStatus.COMPLETED].includes(assessment.status) &&
      (member.role === MemberRole.PRIMARY || member.role === MemberRole.TEAM_LEADER)
    ) {
      throw new BadRequestException('Cannot move PRIMARY or TEAM_LEADER after assessment has started filling.');
    }

    const fromGroupId = member.groupId;
    if (fromGroupId === toGroupId) {
      throw new BadRequestException(
        `User ${member.userId} is already in group ${toGroupId}`,
      );
    }
    // Check source group won't be empty
    const sourceGroupMembers =
      await AssessmentMemberValidator.fetchGroupMembers(
        manager,
        fromGroupId,
        assessmentId,
      );
    if (sourceGroupMembers.length <= 2 && !promoteUserId) {
      throw new BadRequestException(
        'Source group cannot be empty after move, promoteUserId is required',
      );
    }
    // Handle moves based on current role
    if (member.role === MemberRole.TEAM_LEADER) {
      if (!promoteUserId) {
        throw new BadRequestException(
          'promoteUserId is required when moving a TEAM_LEADER',
        );
      }
      // Validate promoteUserId is from source group
      const promoteUserMember = await manager
        .getRepository(AssessmentMember)
        .findOne({
          where: { userId: promoteUserId, assessmentId, groupId: fromGroupId },
        });
      if (!promoteUserMember) {
        throw new BadRequestException(
          'promoteUserId must be a member of the source group',
        );
      }
      // Check destination group roles
      const destinationGroupPrimary = await manager
        .getRepository(AssessmentMember)
        .findOne({
          where: { assessmentId, groupId: toGroupId, role: MemberRole.PRIMARY },
        });
      const destinationGroupTeamLeader = await manager
        .getRepository(AssessmentMember)
        .findOne({
          where: {
            assessmentId,
            groupId: toGroupId,
            role: MemberRole.TEAM_LEADER,
          },
        });
      // If destination has PRIMARY or TEAM_LEADER, moving member becomes MEMBER
      const newRole =
        destinationGroupPrimary || destinationGroupTeamLeader
          ? MemberRole.MEMBER
          : MemberRole.TEAM_LEADER;
      // Promote member in source group to TEAM_LEADER
      await manager
        .getRepository(AssessmentMember)
        .update({ id: promoteUserMember.id }, { role: MemberRole.TEAM_LEADER });
      // Move the team leader to new group with determined role
      await manager
        .getRepository(AssessmentMember)
        .update({ id: member.id }, { groupId: toGroupId, role: newRole });
    } else if (member.role === MemberRole.PRIMARY) {
      if (!promoteUserId) {
        throw new BadRequestException(
          'promoteUserId is required when moving a PRIMARY',
        );
      }
      // Validate promoteUserId is from source group
      const promoteUserMember = await manager
        .getRepository(AssessmentMember)
        .findOne({
          where: { userId: promoteUserId, assessmentId, groupId: fromGroupId },
        });
      if (!promoteUserMember) {
        throw new BadRequestException(
          'promoteUserId must be a member of the source group',
        );
      }
      // Check for TEAM_LEADER in destination group
      const destinationGroupTeamLeader = await manager
        .getRepository(AssessmentMember)
        .findOne({
          where: {
            assessmentId,
            groupId: toGroupId,
            role: MemberRole.TEAM_LEADER,
          },
        });
      // If destination has TEAM_LEADER, they become MEMBER
      if (destinationGroupTeamLeader) {
        await manager
          .getRepository(AssessmentMember)
          .update(
            { id: destinationGroupTeamLeader.id },
            { role: MemberRole.MEMBER },
          );
      }
      // Move the primary to new group keeping PRIMARY role
      await manager
        .getRepository(AssessmentMember)
        .update({ id: member.id }, { groupId: toGroupId });
      // Then promote member in source group to TEAM_LEADER
      await manager
        .getRepository(AssessmentMember)
        .update({ id: promoteUserMember.id }, { role: MemberRole.TEAM_LEADER });
    } else {
      // Standard MEMBER move
      await manager
        .getRepository(AssessmentMember)
        .update({ id: member.id }, { groupId: toGroupId });
    }
  }
}
