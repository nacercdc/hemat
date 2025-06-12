import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import {
  AssessmentAnswer,
  Assessment,
  AssessmentMember,
  AssessmentGroup,
  AssessmentSubComponent,
} from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole } from '@shared/enums';
import {
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
  FindAllAssessmentAnswerDto,
  FindOneAssessmentAnswerDto,
} from '..';

@Injectable()
export class AssessmentAnswerService {
  constructor(
    @InjectRepository(AssessmentAnswer)
    private readonly assessmentAnswerRepository: Repository<AssessmentAnswer>,
    @InjectRepository(AssessmentSubComponent)
    private readonly subComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentMember)
    private readonly memberRepository: Repository<AssessmentMember>,
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    userId: string,
    query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<AssessmentAnswer>> {
    const member = await this.validateAssessmentAndMembership(
      assessmentId,
      userId,
    );
    const isTeamLeader = member.role === MemberRole.TEAM_LEADER;

    const queryService = new QueryService<AssessmentAnswer>(
      this.assessmentAnswerRepository,
    )
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip);

    if (!isTeamLeader) {
      const group = await this.groupRepository.findOne({
        where: { id: member.groupId, assessmentId },
      });
      if (!group) {
        throw new NotFoundException('Group not found for this user');
      }
    }
    return queryService.getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    userId: string,
    id: string,
    query: FindOneAssessmentAnswerDto,
  ): Promise<AssessmentAnswer> {
    const member = await this.validateAssessmentAndMembership(
      assessmentId,
      userId,
    );
    const isTeamLeader = member.role === MemberRole.TEAM_LEADER;

    const queryService = new QueryService<AssessmentAnswer>(
      this.assessmentAnswerRepository,
    )
      .join(query.include)
      .filter([{ field: 'id', operator: '=', value: id }]);

    if (!isTeamLeader) {
      queryService.filter([{ field: 'userId', operator: '=', value: userId }]);
    }

    const answer = await queryService.getOne();
    if (!answer) {
      throw new NotFoundException(`Assessment answer ${id} not found`);
    }
    return answer;
  }

  async findAllBySubComponent(
    subComponentId: string,
    userId: string,
    query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<AssessmentAnswer>> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException(`Sub-component ${subComponentId} not found`);
    }

    const member = await this.memberRepository.findOne({
      where: { assessmentId: subComponent.assessmentId, userId },
    });
    if (!member) {
      throw new NotFoundException(
        `User ${userId} is not a member of assessment ${subComponent.assessmentId}`,
      );
    }
    const isTeamLeader = member.role === MemberRole.TEAM_LEADER;

    const queryService = new QueryService<AssessmentAnswer>(
      this.assessmentAnswerRepository,
    )
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip);

    if (!isTeamLeader) {
      const group = await this.groupRepository.findOne({
        where: { id: member.groupId, assessmentId: subComponent.assessmentId },
      });
      if (!group) {
        throw new NotFoundException('Group not found for this user');
      }
    }
    return await queryService.getManyAndCount();
  }

  async create(
    assessmentId: string,
    userId: string,
    payload: AssessmentAnswerCreateRequestDto,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const member = await this.validateAssessmentAndMembership(
        assessmentId,
        userId,
        manager,
      );

      const assessment = await manager.findOne(Assessment, {
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException(`Assessment ${assessmentId} not found`);
      }

      const existingAnswer = await manager.findOne(AssessmentAnswer, {
        where: {
          assessmentId,
          userId,
          subComponentId: payload.subComponentId,
        },
      });
      if (existingAnswer) {
        throw new BadRequestException(
          `Answer already exists for sub-component ${payload.subComponentId} by user ${userId} in assessment ${assessmentId}`,
        );
      }

      if (member.role === MemberRole.PRIMARY) {
        const group = await manager.findOne(AssessmentGroup, {
          where: { id: member.groupId, assessmentId },
        });
        if (!group) {
          throw new NotFoundException(
            `Group ${member.groupId} not found for assessment ${assessmentId}`,
          );
        }

        const groupMembers = await manager.find(AssessmentMember, {
          where: { groupId: member.groupId, role: MemberRole.PRIMARY },
        });
        const primaryUserIds = groupMembers.map((m) => m.userId);
        const groupAnswerCount = await manager.count(AssessmentAnswer, {
          where: {
            assessmentId,
            userId: In(primaryUserIds),
          },
        });
        if (groupAnswerCount > 0) {
          throw new BadRequestException(
            `Group ${member.groupId} has already submitted an answer for assessment ${assessmentId}`,
          );
        }
      } else if (member.role === MemberRole.TEAM_LEADER) {
        const teamLeaderMembers = await manager.find(AssessmentMember, {
          where: { assessmentId, role: MemberRole.TEAM_LEADER },
        });
        const teamLeaderUserIds = teamLeaderMembers.map((m) => m.userId);
        const teamLeaderAnswerCount = await manager.count(AssessmentAnswer, {
          where: {
            assessmentId,
            userId: In(teamLeaderUserIds),
          },
        });
        if (teamLeaderAnswerCount > 0) {
          throw new BadRequestException(
            `Team leader has already submitted an answer for assessment ${assessmentId}`,
          );
        }
      } else {
        throw new BadRequestException(
          `User ${userId} with role ${member.role} is not authorized to submit answers for assessment ${assessmentId}`,
        );
      }

      const answer = manager.create(AssessmentAnswer, {
        ...payload,
        userId,
        assessmentId,
      });
      return manager.save(AssessmentAnswer, answer);
    });
  }

  async update(
    assessmentId: string,
    userId: string,
    id: string,
    payload: AssessmentAnswerUpdateRequestDto,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id, assessmentId, userId },
      });
      if (!answer) {
        throw new NotFoundException(
          `Assessment answer ${id} not found for user ${userId}`,
        );
      }

      const member = await this.validateAssessmentAndMembership(
        assessmentId,
        userId,
        manager,
      );
      if (
        member.role !== MemberRole.PRIMARY &&
        member.role !== MemberRole.TEAM_LEADER
      ) {
        throw new BadRequestException(
          `User ${userId} with role ${member.role} is not authorized to update answers`,
        );
      }

      return manager.save(AssessmentAnswer, { ...answer, ...payload });
    });
  }

  async delete(
    assessmentId: string,
    userId: string,
    id: string,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id, assessmentId, userId },
      });
      if (!answer) {
        throw new NotFoundException(
          `Assessment answer ${id} not found for user ${userId}`,
        );
      }

      const member = await this.validateAssessmentAndMembership(
        assessmentId,
        userId,
        manager,
      );
      if (
        member.role !== MemberRole.PRIMARY &&
        member.role !== MemberRole.TEAM_LEADER
      ) {
        throw new BadRequestException(
          `User ${userId} with role ${member.role} is not authorized to delete answers`,
        );
      }

      return manager.softRemove(AssessmentAnswer, answer);
    });
  }

  async restore(
    assessmentId: string,
    userId: string,
    id: string,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id, assessmentId, userId },
        withDeleted: true,
      });
      if (!answer) {
        throw new NotFoundException(
          `Assessment answer ${id} not found for user ${userId}`,
        );
      }

      const member = await this.validateAssessmentAndMembership(
        assessmentId,
        userId,
        manager,
      );
      if (
        member.role !== MemberRole.PRIMARY &&
        member.role !== MemberRole.TEAM_LEADER
      ) {
        throw new BadRequestException(
          `User ${userId} with role ${member.role} is not authorized to restore answers`,
        );
      }

      return manager.recover(AssessmentAnswer, answer);
    });
  }

  private async validateAssessmentAndMembership(
    assessmentId: string,
    userId: string,
    manager = this.dataSource.manager,
  ): Promise<AssessmentMember> {
    const assessment = await manager
      .getRepository(Assessment)
      .exists({ where: { id: assessmentId } });
    if (!assessment) {
      throw new NotFoundException(`Assessment ${assessmentId} not found`);
    }

    const member = await manager.findOne(AssessmentMember, {
      where: { assessmentId, userId },
    });
    if (!member) {
      throw new NotFoundException(
        `User ${userId} is not a member of any group for assessment ${assessmentId}`,
      );
    }

    return member;
  }
}
