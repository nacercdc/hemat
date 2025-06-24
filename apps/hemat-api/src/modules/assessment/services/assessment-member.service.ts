import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import {
  AssessmentMember,
  Assessment,
  AssessmentGroup,
  User,
} from '../../../database/entities';
import { QueryService } from '../../../shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole } from '@shared/enums';
import {
  AssessmentMemberCreateRequestDto,
  AssessmentMemberUpdateRequestDto,
  FindAllAssessmentMemberDto,
  FindOneAssessmentMemberDto,
  AssessmentMemberMoveRequestDto,
} from '../dtos';
import { AssessmentMemberValidator } from '../utils/assessment-member.validator';

@Injectable()
export class AssessmentMemberService {
  private readonly logger = new Logger(AssessmentMemberService.name);

  constructor(
    @InjectRepository(AssessmentMember)
    private readonly memberRepository: Repository<AssessmentMember>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    query: FindAllAssessmentMemberDto,
  ): Promise<FindAllResponseDto<AssessmentMember>> {
      const assessment = await this.assessmentRepository.exists({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }
      return await new QueryService<AssessmentMember>(this.memberRepository)
        .filter([{ field: 'assessmentId', operator: '=', value: assessmentId }])
        .join(query.include)
        .filter([], { fields: ['role'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    userId: string,
    query: FindOneAssessmentMemberDto,
  ): Promise<AssessmentMember> {
    try {
      const relations = query.include || [];
      const member = await this.memberRepository.findOne({
        where: { assessmentId, userId },
        relations,
      });

      if (!member) {
        this.logger.error(
          `Member not found for user ${userId} in assessment ${assessmentId}`,
        );
        throw new NotFoundException('Member not found');
      }

      return member;
    } catch (err) {
      this.logger.error(`Failed to find member: ${err.message}`, err.stack);
      throw err;
    }
  }

  async create(
    assessmentId: string,
    payload: AssessmentMemberCreateRequestDto,
  ): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      await AssessmentMemberValidator.checkAssessmentExists(
        manager,
        assessmentId,
      );
      await AssessmentMemberValidator.checkGroupExists(
        manager,
        payload.groupId,
        assessmentId,
      );
      await AssessmentMemberValidator.checkUserExists(manager, payload.userId);
      const existingMember = await manager
        .getRepository(AssessmentMember)
        .exists({
          where: {
            userId: payload.userId,
            assessmentId,
            groupId: payload.groupId,
          },
        });
      if (existingMember) {
        throw new BadRequestException(
          'User is already a member of this assessment group',
        );
      }
      const groupMembers = await AssessmentMemberValidator.fetchGroupMembers(
        manager,
        payload.groupId,
        assessmentId,
      );
      // Enforce only one PRIMARY per assessment
      if (payload.role === MemberRole.PRIMARY) {
        const allMembers = await AssessmentMemberValidator.fetchAssessmentMembers(manager, assessmentId);
        AssessmentMemberValidator.validateAssessmentPrimaryConstraint(payload.role, allMembers);
      }
      AssessmentMemberValidator.validateGroupRoleConstraints(
        payload.role,
        groupMembers,
      );
      const newMember = manager.getRepository(AssessmentMember).create({
        userId: payload.userId,
        assessmentId,
        groupId: payload.groupId,
        role: payload.role,
      });
      return await manager.getRepository(AssessmentMember).save(newMember);
    });
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentMemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      const member = await manager.getRepository(AssessmentMember).findOne({
        where: { id, assessmentId },
        relations: ['user', 'assessment', 'group'],
      });
      if (!member) {
        throw new NotFoundException(`Assessment member ${id} not found`);
      }
      if (payload.role && payload.role !== member.role) {
        // Only one PRIMARY per assessment
        if (payload.role === MemberRole.PRIMARY) {
          const allMembers = await AssessmentMemberValidator.fetchAssessmentMembers(manager, assessmentId);
          const oldPrimary = allMembers.find(m => m.role === MemberRole.PRIMARY && m.id !== member.id);
          if (oldPrimary) {
            await manager.getRepository(AssessmentMember).update({ id: oldPrimary.id }, { role: MemberRole.MEMBER });
          }
        }
        // Only one TEAM_LEADER per group, and no group can have both PRIMARY and TEAM_LEADER
        const groupMembers = await AssessmentMemberValidator.fetchGroupMembers(manager, member.groupId, assessmentId);
        AssessmentMemberValidator.validateGroupRoleConstraints(payload.role, groupMembers.filter(m => m.id !== member.id));
        member.role = payload.role;
      }
      return await manager.getRepository(AssessmentMember).save(member);
    });
  }

  async moveMembers(
    assessmentId: string,
    payload: AssessmentMemberMoveRequestDto,
  ): Promise<AssessmentMember[]> {
    return this.dataSource.transaction(async (manager) => {
      await AssessmentMemberValidator.checkAssessmentExists(manager, assessmentId);
      // Only count groups with at least one member
      const groupIdsWithMembers = await manager.getRepository(AssessmentMember)
        .createQueryBuilder('member')
        .select('member.groupId')
        .where('member.assessmentId = :assessmentId', { assessmentId })
        .groupBy('member.groupId')
        .getRawMany();
      const groupCount = groupIdsWithMembers.length;
      const updatedIds: string[] = [];
      for (const move of payload.moves) {
        const { toGroupId, userIds, newRole, promoteUserId, promotePrimaryId } = move;
        await AssessmentMemberValidator.checkGroupExists(manager, toGroupId, assessmentId);
        for (const userId of userIds) {
          const member = await manager.getRepository(AssessmentMember).findOne({ where: { userId, assessmentId } });
          AssessmentMemberValidator.validateIsMember(member ?? undefined, userId);
          const fromGroupId = member!.groupId;
          if (member!.groupId === toGroupId) {
            throw new BadRequestException(`User ${userId} is already in group ${toGroupId}`);
          }
          if (newRole === MemberRole.TEAM_LEADER) {
            await this.handleTeamLeaderMove(manager, member!, toGroupId, fromGroupId, promoteUserId, promotePrimaryId, groupCount, assessmentId, updatedIds);
          } else if (newRole === MemberRole.PRIMARY) {
            await this.handlePrimaryMove(manager, member!, toGroupId, fromGroupId, promoteUserId, assessmentId, updatedIds);
          } else {
            await this.handleStandardMove(manager, member!, toGroupId, newRole, assessmentId, updatedIds);
          }
        }
      }
      return await manager.getRepository(AssessmentMember).find({ where: { id: In(updatedIds) }, relations: ['group'] });
    });
  }

  // --- Private helpers ---

  private async handleTeamLeaderMove(
    manager: any,
    member: AssessmentMember,
    toGroupId: string,
    fromGroupId: string,
    promoteUserId: string | undefined,
    promotePrimaryId: string | undefined,
    groupCount: number,
    assessmentId: string,
    updatedIds: string[],
  ) {
    // Always demote PRIMARY in destination group if present
    await this.demoteRoleIfExists(manager, assessmentId, toGroupId, MemberRole.PRIMARY, updatedIds);
    if (groupCount >= 3) {
      if (!promoteUserId) throw new BadRequestException('promoteUserId is required when moving a TEAM_LEADER out of a group');
      if (!promotePrimaryId) throw new BadRequestException('promotePrimaryId is required when moving a TEAM_LEADER out of a group with 3 or more groups');
      // Promote member in old group to TEAM_LEADER
      await this.promoteToRole(manager, assessmentId, fromGroupId, promoteUserId, MemberRole.TEAM_LEADER, updatedIds);
      // Promote another group's TEAM_LEADER to PRIMARY (and demote old PRIMARY in that group)
      await this.promoteToRole(manager, assessmentId, undefined, promotePrimaryId, MemberRole.PRIMARY, updatedIds);
    } else {
      if (!promoteUserId) throw new BadRequestException('promoteUserId is required when moving a TEAM_LEADER out of a group');
      // Demote old PRIMARY in the old group (if any), then promote
      await this.demoteRoleIfExists(manager, assessmentId, fromGroupId, MemberRole.PRIMARY, updatedIds);
      await this.promoteToRole(manager, assessmentId, fromGroupId, promoteUserId, MemberRole.PRIMARY, updatedIds);
    }
    // Move the TEAM_LEADER to the new group as TEAM_LEADER
    await manager.getRepository(AssessmentMember).update({ id: member.id }, { groupId: toGroupId, role: MemberRole.TEAM_LEADER });
    updatedIds.push(member.id);
  }

  private async handlePrimaryMove(
    manager: any,
    member: AssessmentMember,
    toGroupId: string,
    fromGroupId: string,
    promoteUserId: string | undefined,
    assessmentId: string,
    updatedIds: string[],
  ) {
    // Only one PRIMARY per assessment
    const allMembers = await AssessmentMemberValidator.fetchAssessmentMembers(manager, assessmentId);
    const otherPrimary = allMembers.find(m => m.role === MemberRole.PRIMARY && m.userId !== member.userId);
    if (otherPrimary) throw new BadRequestException('Another PRIMARY already exists in this assessment');
    // Demote TEAM_LEADER in destination group (if exists)
    await this.demoteRoleIfExists(manager, assessmentId, toGroupId, MemberRole.TEAM_LEADER, updatedIds);
    // Move primary to new group and set role to PRIMARY
    await manager.getRepository(AssessmentMember).update({ id: member.id }, { groupId: toGroupId, role: MemberRole.PRIMARY });
    updatedIds.push(member.id);
    // Promote promoteUserId to TEAM_LEADER in old group
    if (!promoteUserId) throw new BadRequestException('promoteUserId is required when moving a PRIMARY');
    await this.promoteToRole(manager, assessmentId, fromGroupId, promoteUserId, MemberRole.TEAM_LEADER, updatedIds);
  }

  private async handleStandardMove(
    manager: any,
    member: AssessmentMember,
    toGroupId: string,
    newRole: MemberRole,
    assessmentId: string,
    updatedIds: string[],
  ) {
    // Standard move logic with group role validation
    const groupMembers = await AssessmentMemberValidator.fetchGroupMembers(manager, toGroupId, assessmentId);
    AssessmentMemberValidator.validateGroupRoleConstraints(newRole, groupMembers);
    await manager.getRepository(AssessmentMember).update({ id: member.id }, { groupId: toGroupId, role: newRole });
    updatedIds.push(member.id);
  }

  private async promoteToRole(
    manager: any,
    assessmentId: string,
    groupId: string | undefined,
    userId: string | undefined,
    newRole: MemberRole,
    updatedIds: string[],
  ) {
    if (!userId) return;
    const member = await manager.getRepository(AssessmentMember).findOne({
      where: groupId ? { userId, assessmentId, groupId } : { userId, assessmentId },
    });
    if (!member) throw new NotFoundException(`Promote member ${userId} not found`);
    // Demote old PRIMARY if promoting to PRIMARY
    if (newRole === MemberRole.PRIMARY) {
      await this.demoteRoleIfExists(manager, assessmentId, member.groupId, MemberRole.PRIMARY, updatedIds);
    }
    await manager.getRepository(AssessmentMember).update({ id: member.id }, { role: newRole });
    updatedIds.push(member.id);
  }

  private async demoteRoleIfExists(
    manager: any,
    assessmentId: string,
    groupId: string,
    role: MemberRole,
    updatedIds: string[],
  ) {
    const oldMember = await manager.getRepository(AssessmentMember).findOne({
      where: { assessmentId, groupId, role },
    });
    if (oldMember) {
      await manager.getRepository(AssessmentMember).update({ id: oldMember.id }, { role: MemberRole.MEMBER });
      updatedIds.push(oldMember.id);
    }
  }

  async delete(assessmentId: string, id: string): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const member = await manager.getRepository(AssessmentMember).findOne({
          where: { id, assessmentId },
          relations: ['user', 'assessment', 'group'],
        });
        if (!member) {
          throw new NotFoundException(`Assessment member ${id} not found`);
        }

        await manager
          .getRepository(AssessmentMember)
          .softDelete({ id, assessmentId });
        return member;
      } catch (err) {
        this.logger.error(
          `Failed to delete assessment member: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to delete assessment member');
      }
    });
  }

  async restore(assessmentId: string, id: string): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const member = await manager.getRepository(AssessmentMember).findOne({
          where: { id, assessmentId },
          withDeleted: true,
        });
        if (!member) {
          throw new NotFoundException(`Assessment member ${id} not found`);
        }

        await manager.getRepository(AssessmentMember).recover(member);
        return member;
      } catch (err) {
        this.logger.error(
          `Failed to restore assessment member: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to restore assessment member');
      }
    });
  }
}
