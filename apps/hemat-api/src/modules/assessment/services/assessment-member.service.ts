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
      await AssessmentMemberValidator.checkAssessmentExists(
        manager,
        assessmentId,
      );
      const updatedMemberIds: string[] = [];
      for (const { userIds, group: groupInput } of payload.groups) {
        let groupId: string = groupInput as string;
        await AssessmentMemberValidator.checkGroupExists(
          manager,
          groupId,
          assessmentId,
        );
        const groupMembers = await AssessmentMemberValidator.fetchGroupMembers(
          manager,
          groupId,
          assessmentId,
        );
        for (const userId of userIds) {
          await AssessmentMemberValidator.checkUserExists(manager, userId);
          const member = await manager
            .getRepository(AssessmentMember)
            .findOne({ where: { userId, assessmentId } });
          AssessmentMemberValidator.validateIsMember(
            member ?? undefined,
            userId,
          );
          await AssessmentMemberValidator.checkDuplicateMembership(
            manager,
            userId,
            assessmentId,
          );
          // Enforce only one PRIMARY per assessment
          if (member!.role === MemberRole.PRIMARY) {
            const allMembers = await AssessmentMemberValidator.fetchAssessmentMembers(manager, assessmentId);
            AssessmentMemberValidator.validateAssessmentPrimaryConstraint(member!.role, allMembers.filter(m => m.id !== member!.id));
          }
          AssessmentMemberValidator.validateGroupRoleConstraints(
            member!.role,
            groupMembers,
          );
          if (member!.groupId === groupId) {
            throw new BadRequestException(
              `User ${userId} is already in group ${groupId}`,
            );
          }
          await manager
            .getRepository(AssessmentMember)
            .update({ id: member!.id }, { groupId });
          updatedMemberIds.push(member!.id);
        }
      }
      return await manager
        .getRepository(AssessmentMember)
        .find({ where: { id: In(updatedMemberIds) }, relations: ['group'] });
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
}
