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
} from '../../../database/entities';
import { QueryService } from '../../../shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole } from '@shared/enums';
import {
  AssessmentMemberCreateRequestDto,
  AssessmentMemberUpdateRequestDto,
  FindAllAssessmentMemberDto,
  FindOneAssessmentMemberDto,
  AssessmentMemberMoveSimpleDto,
} from '../dtos';
import { AssessmentMemberValidator } from '../utils/assessment-member.validator';
import { RoleTransitionService } from '../services/role-transition.service';

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
      const assessment = await manager.getRepository(Assessment).findOne({ where: { id: assessmentId } });
      if (!assessment) {
        throw new NotFoundException(`Assessment ${assessmentId} not found`);
      }
      if (!assessment.isActive) {
        throw new BadRequestException('Cannot add member to an inactive assessment');
      }
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
        const allMembers =
          await AssessmentMemberValidator.fetchAssessmentMembers(
            manager,
            assessmentId,
          );
        AssessmentMemberValidator.validateAssessmentPrimaryConstraint(
          payload.role,
          allMembers,
        );
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
    return this._updateInternal({ assessmentId, id, userId: undefined, payload });
  }

  async updateByUserId(
    assessmentId: string,
    userId: string,
    payload: AssessmentMemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    return this._updateInternal({ assessmentId, id: undefined, userId, payload });
  }

  private async _updateInternal({ assessmentId, id, userId, payload }: { assessmentId: string, id?: string, userId?: string, payload: AssessmentMemberUpdateRequestDto }): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      let member;
      if (id) {
        member = await manager.getRepository(AssessmentMember).findOne({
          where: { id, assessmentId },
          relations: ['user', 'assessment', 'group'],
        });
      } else if (userId) {
        member = await manager.getRepository(AssessmentMember).findOne({
          where: { userId, assessmentId },
          relations: ['user', 'assessment', 'group'],
        });
      }
      if (!member) {
        throw new NotFoundException(`Assessment member not found`);
      }
      if (!payload.role || payload.role === member.role) {
        return member;
      }
      // If demoting TEAM_LEADER to MEMBER, check group size
      if (
        member.role === MemberRole.TEAM_LEADER &&
        payload.role === MemberRole.MEMBER
      ) {
        const groupMembers = await manager.getRepository(AssessmentMember).find({
          where: { groupId: member.groupId, assessmentId },
        });
        if (groupMembers.length === 1) {
          throw new BadRequestException('Cannot demote TEAM_LEADER to MEMBER when the group has only one member.');
        }
      }
      return await RoleTransitionService.updateRole({
        manager,
        member,
        targetRole: payload.role,
        promoteUserId: payload.promoteUserId,
        assessmentId,
        groupId: member.groupId,
      });
    });
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
  async moveMember(
    assessmentId: string,
    payload: AssessmentMemberMoveSimpleDto,
  ): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      await AssessmentMemberValidator.checkAssessmentExists(
        manager,
        assessmentId,
      );
      await AssessmentMemberValidator.checkGroupExists(
        manager,
        payload.toGroupId,
        assessmentId,
      );
      const member = await manager
        .getRepository(AssessmentMember)
        .findOne({ where: { userId: payload.userId, assessmentId } });
      if (!member)
        throw new NotFoundException(
          `Assessment member for user ${payload.userId} not found`,
        );
      AssessmentMemberValidator.validateIsMember(member, payload.userId);
      await RoleTransitionService.moveMember({
        manager,
        member,
        toGroupId: payload.toGroupId,
        promoteUserId: payload.promoteUserId,
        assessmentId,
      });
      const updated = await manager
        .getRepository(AssessmentMember)
        .findOne({ where: { id: member.id }, relations: ['group'] });
      if (!updated)
        throw new NotFoundException(
          `Assessment member for user ${payload.userId} not found after move`,
        );
      return updated;
    });
  }

  async findByUser(userId: string): Promise<AssessmentMember[]> {
    return this.memberRepository.find({ where: { userId } });
  }

  async hasPrimaryMember(assessmentId: string): Promise<boolean> {
    return !!(await this.memberRepository.findOne({
      where: { assessmentId, role: MemberRole.PRIMARY },
    }));
  }

  async hasPrimaryInGroup(groupId: string): Promise<boolean> {
    return !!(await this.memberRepository.findOne({
      where: { groupId, role: MemberRole.PRIMARY },
    }));
  }

  async hasTeamLeaderInGroup(groupId: string): Promise<boolean> {
    return !!(await this.memberRepository.findOne({
      where: { groupId, role: MemberRole.TEAM_LEADER },
    }));
  }

  async deleteByUserId(assessmentId: string, userId: string): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const member = await manager.getRepository(AssessmentMember).findOne({
          where: { userId, assessmentId },
          relations: ['user', 'assessment', 'group'],
        });
        if (!member) {
          throw new NotFoundException(`Assessment member for user ${userId} not found`);
        }
        await manager.getRepository(AssessmentMember).softDelete({ userId, assessmentId });
        return member;
      } catch (err) {
        this.logger.error(
          `Failed to delete assessment member by userId: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to delete assessment member');
      }
    });
  }

  async restoreByUserId(assessmentId: string, userId: string): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const member = await manager.getRepository(AssessmentMember).findOne({
          where: { userId, assessmentId },
          withDeleted: true,
        });
        if (!member) {
          throw new NotFoundException(`Assessment member for user ${userId} not found`);
        }
        await manager.getRepository(AssessmentMember).recover(member);
        return member;
      } catch (err) {
        this.logger.error(
          `Failed to restore assessment member by userId: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to restore assessment member');
      }
    });
  }
}
