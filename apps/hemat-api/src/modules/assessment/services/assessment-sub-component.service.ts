import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  Answer,
  AssessmentMember,
  AssessmentSubComponent,
  AssessmentSubComponentAnswer,
  SubComponent,
} from '@database/entities';
import { UUID } from '@shared/helpers';
import { Filter, QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import {
  AssessmentSubComponentDto,
  FindAllAssessmentAnswerDto,
  FindAllAssessmentSubComponentDto,
  FindOneAssessmentSubComponentDto,
} from '../dtos';
import { MemberRole } from '@shared/enums';
@Injectable()
export class AssessmentSubComponentService {
  private readonly loggerService = new Logger(
    AssessmentSubComponentService.name,
  );

  constructor(
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentSubComponentAnswer)
    private subComponentAnswerRepository: Repository<AssessmentSubComponentAnswer>,
    @InjectRepository(AssessmentSubComponent)
    private subComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentMember)
    private memberRepository: Repository<AssessmentMember>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async create(
    manager: EntityManager,
    assessmentId: string,
    templateComponentId: Record<string, string>,
  ): Promise<{
    subComponents: AssessmentSubComponent[];
    templateSubComponentId: Record<string, string>;
  }> {
    const subComponents = await manager.find(SubComponent, {
      where: { isActive: true },
      relations: { measurementScales: { measurementScale: true } },
    });

    const assessmentSubComponents: AssessmentSubComponent[] = [];
    const templateSubComponentId: Record<string, string> = {};
    subComponents.forEach(
      ({ id, code, name, description, componentId, translations }) => {
        const parentId = templateComponentId[componentId] ?? null;

        if (parentId) {
          const subComponent = manager.create(AssessmentSubComponent, {
            id: UUID.v4(),
            code,
            name,
            description,
            assessmentId,
            componentId: parentId,
            translations,
          });
          templateSubComponentId[id] = subComponent.id;
          assessmentSubComponents.push(subComponent);
        }
      },
    );

    this.loggerService.debug('templateSubComponentId', templateSubComponentId);
    await manager.insert(AssessmentSubComponent, assessmentSubComponents);

    return { subComponents: assessmentSubComponents, templateSubComponentId };
  }
  async findAll(
    query: FindAllAssessmentSubComponentDto & { assessmentId: string },
  ): Promise<FindAllResponseDto<AssessmentSubComponent>> {
    return new QueryService<AssessmentSubComponent>(
      this.assessmentSubComponentRepository,
    )
      .join(query.include)
      .filter(this.filters(query), {
        fields: ['code', 'name'],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }
  async findOne(
    assessmentId: string,
    id: string,
    query: FindOneAssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id, assessmentId },
      relations: query.include,
    });

    if (!subComponent) {
      throw new NotFoundException(`Assessment sub-component ${id} not found.`);
    }

    return subComponent;
  }
  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.findOne(assessmentId, id, {
      include: ['measurementScales'],
    });
    try {
      const entity = {
        code: payload.code,
        name: payload.name,
        description: payload.description,
        translations: payload.translations,
      };
      await this.assessmentSubComponentRepository.update(
        { id, assessmentId },
        entity,
      );

      return { ...subComponent, ...entity };
    } catch (err) {
      this.loggerService.error(
        `Failed to update assessment sub-component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to update assessment sub-component',
      );
    }
  }

  async findAllBySubComponent(
    subComponentId: string,
    userId: string,
    query: FindAllAssessmentAnswerDto & { assessmentId?: string },
  ): Promise<FindAllResponseDto<AssessmentSubComponentAnswer>> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent)
      throw new NotFoundException(`Sub-component ${subComponentId} not found`);

    const member = await this.memberRepository.findOne({
      where: { assessmentId: subComponent.assessmentId, userId },
    });
    if (!member)
      throw new NotFoundException(
        `User ${userId} is not a member of assessment ${subComponent.assessmentId}`,
      );

    const isTeamLeader = member.role === MemberRole.TEAM_LEADER;
    const filters = [
      { field: 'subComponentId', operator: '=' as const, value: subComponentId },
      { field: 'assessmentId', operator: '=' as const, value: subComponent.assessmentId },
    ];
    const queryService = new QueryService<AssessmentSubComponentAnswer>(
      this.subComponentAnswerRepository,
    )
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .filter(filters);

    if (!isTeamLeader) {
      const answers = await this.answerRepository.find({
        where: { assessmentId: subComponent.assessmentId, userId },
      });
      queryService.filter([
        { field: 'answerId', operator: 'IN' as const, value: answers.map((a) => a.id) },
      ]);
    }

    return queryService.getManyAndCount();
  }

  async findPrimaryAnswerBySubComponent(
    subComponentId: string,
    userId: string,
    query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<AssessmentSubComponentAnswer>> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent)
      throw new NotFoundException(`Sub-component ${subComponentId} not found`);

    const member = await this.memberRepository.findOne({
      where: { assessmentId: subComponent.assessmentId, userId },
    });
    if (!member)
      throw new NotFoundException(
        `User ${userId} is not a member of assessment ${subComponent.assessmentId}`,
      );

    // Get primary answers only
    const primaryAnswers = await this.answerRepository.find({
      where: { 
        assessmentId: subComponent.assessmentId,
        isPrimary: true 
      },
    });

    const queryService = new QueryService<AssessmentSubComponentAnswer>(
      this.subComponentAnswerRepository,
    )
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .filter([
        { field: 'subComponentId', operator: '=' as const, value: subComponentId },
        { field: 'answerId', operator: 'IN' as const, value: primaryAnswers.map((a) => a.id) },
      ]);

    return queryService.getManyAndCount();
  }

  private filters(query: FindAllAssessmentSubComponentDto & { assessmentId?: string }): Filter[] {
    const filters: Filter[] = [];
    if (typeof query.isActive === 'boolean') {
      filters.push({
        field: 'isActive',
        operator: '=',
        value: query.isActive,
      });
    }
    if (query.assessmentId) {
      filters.push({
        field: 'assessmentId',
        operator: '=',
        value: query.assessmentId,
      });
    }
    return filters;
  }
}
