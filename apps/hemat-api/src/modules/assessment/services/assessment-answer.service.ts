import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import {
  Answer,
  AssessmentSubComponentAnswer,
  AssessmentSubComponent,
  AssessmentMeasurementScale,
  AssessmentComponent,
  Assessment,
  AssessmentGroup,
  AssessmentDomain,
} from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole, AnswerStatus, AssessmentStatus } from '@shared/enums';
import { PercentageUtil } from '../utils';
import { AssessmentAnswerValidator } from '../utils/assessment-answer.validator';
import {
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
  FindAllAssessmentAnswerDto,
  FindOneAssessmentAnswerDto,
} from '../dtos';
import { AssessmentSubComponentService } from './assessment-sub-component.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubComponentAnswerUpdatedEvent } from '../events/assessment-answer.events';
import { ASSESSMENT_ANSWER_EVENTS } from '../events/assessment-answer.events.constants';

@Injectable()
export class AssessmentAnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    private dataSource: DataSource,
    private validator: AssessmentAnswerValidator,
    private assessmentSubComponentService: AssessmentSubComponentService,
    private eventEmitter: EventEmitter2,
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
      const assessment = await manager.findOne(Assessment, { where: { id: assessmentId } });
      if (!assessment) {
        throw new NotFoundException(`Assessment ${assessmentId} not found`);
      }
      if (!assessment.isActive) {
        throw new BadRequestException('Cannot answer an inactive assessment');
      }
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

      const isPrimary = typeof payload.isPrimary === 'boolean' ? payload.isPrimary : false;

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

      const component = await manager.findOne(AssessmentComponent, {
        where: { id: subComponent.componentId },
      });
      if (!component) {
        throw new BadRequestException(
          `Component ${subComponent.componentId} not found for sub-component ${payload.subComponentId}`,
        );
      }

      const measurementScale = await manager.findOne(AssessmentMeasurementScale, {
        where: { id: payload.measurementScaleId },
      });
      if (!measurementScale || measurementScale.assessmentId !== assessmentId) {
        throw new BadRequestException(
          `Measurement scale ${payload.measurementScaleId} does not belong to assessment ${assessmentId}`,
        );
      }

      let allowedDomainIds: string[] = [];
      if (!isPrimary) {
        const group = await manager.findOne(AssessmentGroup, {
          where: { id: member.groupId },
          relations: ['domains'],
        });
        if (!group) {
          throw new ForbiddenException('Your group does not exist');
        }
        if (!group.domains || group.domains.length === 0) {
          throw new ForbiddenException(
            'Your group does not have any domains assigned',
          );
        }
        allowedDomainIds = group.domains.map((d: AssessmentDomain) => d.id);
        if (!allowedDomainIds.includes(component.domainId)) {
          throw new ForbiddenException('You do not have access to this domain');
        }
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

        if (
          assessment &&
          assessment.status !== AssessmentStatus.IN_PROGRESS &&
          assessment.status !== AssessmentStatus.CLOSED &&
          assessment.status !== AssessmentStatus.COMPLETED
        ) {
          assessment.status = AssessmentStatus.IN_PROGRESS;
          await manager.save(Assessment, assessment);
        }
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
          componentId: subComponent.componentId,
          domainId: component.domainId,
        });
      } else {
        subComponentAnswer = manager.create(AssessmentSubComponentAnswer, {
          subComponentId: payload.subComponentId,
          measurementScaleId: payload.measurementScaleId,
          answerId: answer.id,
          evidence: payload.evidence,
          reference: payload.reference,
          notes: payload.notes,
          componentId: subComponent.componentId,
          domainId: component.domainId,
        });
      }

      await manager.save(AssessmentSubComponentAnswer, subComponentAnswer);

      answer.percentage = await PercentageUtil.calculatePercentage(
        assessmentId,
        answer.id,
        manager,
        'Answer',
        allowedDomainIds,
      );
      answer.status =
        answer.percentage === 100
          ? AnswerStatus.COMPLETED
          : AnswerStatus.INPROGRESS;
      await manager.save(Answer, answer);

      // --- COMPLETION CHECK FOR PRIMARY ANSWERS ---
      if (isPrimary) {
        // Count all subcomponents for this assessment
        const totalSubComponents = await manager.count(AssessmentSubComponent, { where: { assessmentId } });
        // Count unique subComponentIds with a primary answer for this assessment
        const primaryAnswered = await manager
          .createQueryBuilder(AssessmentSubComponentAnswer, 'sca')
          .innerJoin('sca.answer', 'answer')
          .where('answer.assessmentId = :assessmentId', { assessmentId })
          .andWhere('answer.isPrimary = :isPrimary', { isPrimary: true })
          .andWhere('sca.deletedAt IS NULL')
          .andWhere('answer.deletedAt IS NULL')
          .select('DISTINCT sca.subComponentId', 'subComponentId')
          .getRawMany();
        if (primaryAnswered.length === totalSubComponents && totalSubComponents > 0) {
          assessment.status = AssessmentStatus.COMPLETED;
          await manager.save(Assessment, assessment);
        }
      }
      // --- END COMPLETION CHECK ---

      // Emit event after subcomponent answer create/update
      this.eventEmitter.emit(ASSESSMENT_ANSWER_EVENTS.SUBCOMPONENT_UPDATED, new SubComponentAnswerUpdatedEvent(answer.id));

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
        answer.isPrimary ? undefined : (await (async () => {
          const group = await manager.findOne(AssessmentGroup, {
            where: { id: member.groupId },
            relations: ['domains'],
          });
          return (group?.domains || []).map((d: AssessmentDomain) => d.id);
        })()),
      );
      answer.status =
        answer.percentage === 100
          ? AnswerStatus.COMPLETED
          : AnswerStatus.INPROGRESS;

      // --- COMPLETION CHECK FOR PRIMARY ANSWERS (update) ---
      if (answer.isPrimary) {
        const totalSubComponents = await manager.count(AssessmentSubComponent, { where: { assessmentId } });
        const primaryAnswered = await manager
          .createQueryBuilder(AssessmentSubComponentAnswer, 'sca')
          .innerJoin('sca.answer', 'answer')
          .where('answer.assessmentId = :assessmentId', { assessmentId })
          .andWhere('answer.isPrimary = :isPrimary', { isPrimary: true })
          .andWhere('sca.deletedAt IS NULL')
          .andWhere('answer.deletedAt IS NULL')
          .select('DISTINCT sca.subComponentId', 'subComponentId')
          .getRawMany();
        const assessment = await manager.findOne(Assessment, { where: { id: assessmentId } });
        if (assessment && primaryAnswered.length === totalSubComponents && totalSubComponents > 0) {
          assessment.status = AssessmentStatus.COMPLETED;
          await manager.save(Assessment, assessment);
        }
      }
      // --- END COMPLETION CHECK ---

      // Emit event after subcomponent answer update
      this.eventEmitter.emit(ASSESSMENT_ANSWER_EVENTS.SUBCOMPONENT_UPDATED, new SubComponentAnswerUpdatedEvent(answer.id));

      return manager.save(Answer, answer);
    });
  }

  async submitAssessmentAnswers(
    assessmentId: string,
    userId: string,
  ): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      // Find the assessment
      const assessment = await manager.findOne(Assessment, {
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException(`Assessment ${assessmentId} not found`);
      }

      // Find all subcomponents for the assessment
      const subComponents = await manager
        .getRepository(AssessmentSubComponent)
        .find({ where: { assessmentId } });
      if (!subComponents.length) {
        throw new NotFoundException(
          'No subcomponents found for this assessment',
        );
      }

      // Find the user's primary answer for this assessment
      const answer = await manager.findOne(Answer, {
        where: { assessmentId, userId, isPrimary: true },
      });
      if (!answer) {
        throw new NotFoundException(
          'No primary answer found for this assessment',
        );
      }

      // Check all subcomponents for this assessment are answered
      const subComponentIds = subComponents.map((sc) => sc.id);
      const answered = await manager.find(AssessmentSubComponentAnswer, {
        where: {
          answerId: answer.id,
          subComponentId: In(subComponentIds),
        },
      });
      if (answered.length !== subComponentIds.length) {
        throw new BadRequestException(
          'Not all subcomponents for this assessment are answered',
        );
      }

      // Check answer status is COMPLETED or SUBMITTED
      if (answer.status === AnswerStatus.SUBMITTED) {
        return {
          message: 'Assessment answers already submitted',
          answerId: answer.id,
          status: answer.status,
        };
      }
      if (answer.status !== AnswerStatus.COMPLETED) {
        throw new BadRequestException(
          'Answer status must be COMPLETED to submit',
        );
      }

      // Set answer status to SUBMITTED
      answer.status = AnswerStatus.SUBMITTED;
      await manager.save(Answer, answer);

      // Update assessment status to SUBMITTED
      assessment.status = AssessmentStatus.SUBMITTED;
      await manager.save(Assessment, assessment);

      return {
        message: 'Assessment answers submitted',
        answerId: answer.id,
        status: answer.status,
        assessmentStatus: assessment.status,
      };
    });
  }
}