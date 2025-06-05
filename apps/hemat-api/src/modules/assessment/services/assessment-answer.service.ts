import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  AssessmentAnswer,
  Assessment,
  AssessmentGroup,
} from '@database/entities';
import { QueryService } from '@shared/services';
import {
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
  FindAllAssessmentAnswerDto,
  FindOneAssessmentAnswerDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole } from '@shared/enums';
import { AssessmentMemberService } from '@modules/assessment/services';

@Injectable()
export class AssessmentAnswerService {
  constructor(
    @InjectRepository(AssessmentAnswer)
    private readonly assessmentAnswerRepository: Repository<AssessmentAnswer>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    private readonly assessmentMemberService: AssessmentMemberService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    groupId: string,
    query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<AssessmentAnswer>> {
    await this.validateAssessmentAndGroup(assessmentId, groupId);
    return new QueryService<AssessmentAnswer>(this.assessmentAnswerRepository)
      .join(query.include)
      .filter([], {
        fields: ['evidence', 'reference', 'notes'],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    groupId: string,
    id: string,
    query: FindOneAssessmentAnswerDto,
  ): Promise<AssessmentAnswer> {
    await this.validateAssessmentAndGroup(assessmentId, groupId);
    const answer = await new QueryService<AssessmentAnswer>(
      this.assessmentAnswerRepository,
    )
      .join(query.include)
      .getOne();
    if (!answer)
      throw new NotFoundException(`Assessment answer ${id} not found`);
    return answer;
  }

  async create(
    assessmentId: string,
    groupId: string,
    payload: AssessmentAnswerCreateRequestDto,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        payload.userId,
        { include: [] },
      );
      if (member.role.toLowerCase() !== MemberRole.PRIMARY.toLowerCase()) {
        throw new BadRequestException(
          'Only primary role members can submit answers',
        );
      }

      const existingAnswer = await manager.findOne(AssessmentAnswer, {
        where: {
          assessmentId,
          subComponentId: payload.subComponentId,
          userId: payload.userId,
        },
      });
      if (existingAnswer)
        throw new BadRequestException(
          'Answer already exists for this sub-component and user',
        );

      const answer = manager.create(AssessmentAnswer, { ...payload });
      return manager.save(AssessmentAnswer, answer);
    });
  }

  async update(
    assessmentId: string,
    groupId: string,
    id: string,
    payload: AssessmentAnswerUpdateRequestDto,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id, assessmentId },
      });
      if (!answer)
        throw new NotFoundException(`Assessment answer ${id} not found`);

      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        answer.userId,
        { include: [] },
      );
      if (member.role !== MemberRole.PRIMARY)
        throw new BadRequestException(
          'Only primary role members can update answers',
        );

      if (payload.userId && payload.userId !== answer.userId) {
        const newMember = await this.assessmentMemberService.findOne(
          assessmentId,
          groupId,
          payload.userId,
          { include: [] },
        );
        if (newMember.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can update answers',
          );
        }
      }

      return manager.save(AssessmentAnswer, { ...answer, ...payload });
    });
  }

  async delete(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id, assessmentId },
      });
      if (!answer)
        throw new NotFoundException(`Assessment answer ${id} not found`);

      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        answer.userId,
        { include: [] },
      );
      if (member.role !== MemberRole.PRIMARY)
        throw new BadRequestException(
          'Only primary role members can delete answers',
        );

      return manager.softRemove(AssessmentAnswer, answer);
    });
  }

  async restore(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id, assessmentId },
        withDeleted: true,
      });
      if (!answer)
        throw new NotFoundException(`Assessment answer ${id} not found`);

      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        answer.userId,
        { include: [] },
      );
      if (member.role !== MemberRole.PRIMARY)
        throw new BadRequestException(
          'Only primary role members can restore answers',
        );

      return manager.recover(AssessmentAnswer, answer);
    });
  }

  private async validateAssessmentAndGroup(
    assessmentId: string,
    groupId: string,
  ) {
    if (
      !(await this.assessmentRepository.exists({ where: { id: assessmentId } }))
    ) {
      throw new NotFoundException('Assessment not found');
    }
    if (
      !(await this.groupRepository.exists({
        where: { id: groupId, assessmentId },
      }))
    ) {
      throw new NotFoundException('Assessment group not found');
    }
  }
}