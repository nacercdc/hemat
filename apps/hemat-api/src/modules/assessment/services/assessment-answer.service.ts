import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Answer,
  AssessmentSubComponentAnswer,
  AssessmentSubComponent,
} from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole, AnswerStatus } from '@shared/enums';
import { PercentageUtil } from '../utils';
import { AssessmentAnswerValidator } from '../utils/assessment-answer.validator';
import {
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
  FindAllAssessmentAnswerDto,
  FindOneAssessmentAnswerDto,
} from '../dtos';

@Injectable()
export class AssessmentAnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    private dataSource: DataSource,
    private validator: AssessmentAnswerValidator,
  ) {}

  async findAll(
    assessmentId: string,
    userId: string,
    query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<Answer>> {
    const { role } = await this.validator.validateMembership(
      assessmentId,
      userId,
    );

    const queryService = new QueryService<Answer>(this.answerRepository)
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .filter([{ field: 'assessmentId', operator: '=', value: assessmentId }]);

    if (role !== MemberRole.TEAM_LEADER && role !== MemberRole.PRIMARY) {
      queryService.filter([{ field: 'userId', operator: '=', value: userId }]);
    }

    return queryService.getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    userId: string,
    id: string,
    query: FindOneAssessmentAnswerDto,
  ): Promise<Answer> {
    const { role } = await this.validator.validateMembership(
      assessmentId,
      userId,
    );

    const queryService = new QueryService<Answer>(this.answerRepository)
      .join(query.include)
      .filter([{ field: 'id', operator: '=', value: id }]);

    if (role !== MemberRole.TEAM_LEADER && role !== MemberRole.PRIMARY) {
      queryService.filter([{ field: 'userId', operator: '=', value: userId }]);
    }

    const answer = await queryService.getOne();
    if (!answer) throw new NotFoundException(`Answer ${id} not found`);
    return answer;
  }

  async create(
    assessmentId: string,
    userId: string,
    payload: AssessmentAnswerCreateRequestDto,
  ): Promise<Answer> {
    return this.dataSource.transaction(async (manager) => {
      const member = await this.validator.validateMembership(
        assessmentId,
        userId,
        manager,
      );

      if (
        member.role !== MemberRole.PRIMARY &&
        member.role !== MemberRole.TEAM_LEADER
      ) {
        throw new ForbiddenException(
          'Only Primary or Team Leader roles can submit answers',
        );
      }

      const isPrimary = payload.isPrimary ?? false;

      if (isPrimary && member.role !== MemberRole.PRIMARY) {
        throw new BadRequestException(
          'Only Primary role can submit primary answers',
        );
      }

      const subComponent = await manager.findOne(AssessmentSubComponent, {
        where: { id: payload.subComponentId, assessmentId },
      });
      if (!subComponent) {
        throw new BadRequestException(
          `Sub-component ${payload.subComponentId} does not belong to assessment ${assessmentId}`,
        );
      }

      await this.validator.validateCreate(
        assessmentId,
        userId,
        member,
        { ...payload, isPrimary },
        manager,
      );

      const groupId = isPrimary ? null : member.groupId;
      let answer = await manager.findOne(Answer, {
        where: { assessmentId, userId, isPrimary },
      });

      if (!answer) {
        answer = manager.create(Answer, {
          assessmentId,
          userId,
          isPrimary,
          groupId,
          status: AnswerStatus.INPROGRESS,
        });
        await manager.save(Answer, answer);
      }

      let subComponentAnswer = await manager.findOne(
        AssessmentSubComponentAnswer,
        {
          where: {
            answerId: answer.id,
            subComponentId: payload.subComponentId,
          },
        },
      );

      if (subComponentAnswer) {
        Object.assign(subComponentAnswer, {
          measurementScaleId: payload.measurementScaleId,
          evidence: payload.evidence,
          reference: payload.reference,
          notes: payload.notes,
        });
      } else {
        subComponentAnswer = manager.create(AssessmentSubComponentAnswer, {
          subComponentId: payload.subComponentId,
          measurementScaleId: payload.measurementScaleId,
          answerId: answer.id,
          evidence: payload.evidence,
          reference: payload.reference,
          notes: payload.notes,
        });
      }

      await manager.save(AssessmentSubComponentAnswer, subComponentAnswer);

      answer.percentage = await PercentageUtil.calculatePercentage(
        assessmentId,
        answer.id,
        manager,
        'Answer',
      );
      answer.status =
        answer.percentage === 100
          ? AnswerStatus.COMPLETED
          : AnswerStatus.INPROGRESS;
      await manager.save(Answer, answer);

      return answer;
    });
  }

  async update(
    assessmentId: string,
    userId: string,
    id: string,
    payload: AssessmentAnswerUpdateRequestDto,
  ): Promise<Answer> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(Answer, {
        where: { id, assessmentId, userId },
      });
      if (!answer) throw new NotFoundException(`Answer ${id} not found`);

      const member = await this.validator.validateMembership(
        assessmentId,
        userId,
        manager,
      );

      if (
        member.role !== MemberRole.PRIMARY &&
        member.role !== MemberRole.TEAM_LEADER
      ) {
        throw new ForbiddenException(
          'Only Primary or Team Leader roles can update answers',
        );
      }

      if (
        payload.isPrimary !== undefined &&
        member.role !== MemberRole.PRIMARY &&
        payload.isPrimary
      ) {
        throw new BadRequestException(
          'Only Primary role can update primary answers',
        );
      }

      if (payload.subComponentId) {
        const subComponent = await manager.findOne(AssessmentSubComponent, {
          where: { id: payload.subComponentId, assessmentId },
        });
        if (!subComponent) {
          throw new BadRequestException(
            `Sub-component ${payload.subComponentId} does not belong to assessment ${assessmentId}`,
          );
        }
      }

      await this.validator.validateUpdate(id, member, payload);

      if (payload.isPrimary !== undefined) {
        answer.isPrimary = payload.isPrimary;
        answer.groupId = payload.isPrimary ? null : member.groupId;
      }

      if (
        payload.subComponentId ||
        payload.measurementScaleId ||
        payload.evidence ||
        payload.reference ||
        payload.notes !== undefined
      ) {
        const subComponentAnswer = await manager.findOne(
          AssessmentSubComponentAnswer,
          {
            where: { answerId: id, subComponentId: payload.subComponentId },
          },
        );
        if (!subComponentAnswer)
          throw new NotFoundException(`Sub-component answer not found`);

        Object.assign(subComponentAnswer, {
          subComponentId:
            payload.subComponentId || subComponentAnswer.subComponentId,
          measurementScaleId:
            payload.measurementScaleId || subComponentAnswer.measurementScaleId,
          evidence: payload.evidence || subComponentAnswer.evidence,
          reference: payload.reference || subComponentAnswer.reference,
          notes:
            payload.notes !== undefined
              ? payload.notes
              : subComponentAnswer.notes,
        });
        await manager.save(AssessmentSubComponentAnswer, subComponentAnswer);
      }

      answer.percentage = await PercentageUtil.calculatePercentage(
        assessmentId,
        answer.id,
        manager,
        'Answer',
      );
      answer.status =
        answer.percentage === 100
          ? AnswerStatus.COMPLETED
          : AnswerStatus.INPROGRESS;
      return manager.save(Answer, answer);
    });
  }
}