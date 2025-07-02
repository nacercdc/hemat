import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, In } from 'typeorm';
import {
  AssessmentComponent,
  AssessmentSubComponent,
  Component,
  AssessmentSubComponentAnswer,
} from '@database/entities';
import { UUID } from '@shared/helpers';
import { Filter, QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import {
  AssessmentComponentDto,
  FindAllAssessmentComponentDto,
  FindAllAssessmentSubComponentDto,
} from '../dtos';
import { getTranslated } from '@shared/helpers/translation.helper';

interface AssessmentComponentWithCounts extends AssessmentComponent {
  filledSubComponentsCount: number;
  filledPercentage: number;
}

@Injectable()
export class AssessmentComponentService {
  private readonly logger = new Logger(AssessmentComponentService.name);

  constructor(
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentSubComponentAnswer)
    private readonly assessmentSubComponentAnswerRepository: Repository<AssessmentSubComponentAnswer>,
  ) {}

  async create(
    manager: EntityManager,
    assessmentId: string,
    templateDomainId: Record<string, string>,
  ): Promise<{
    components: AssessmentComponent[];
    templateComponentId: Record<string, string>;
  }> {
    const components = await manager.find(Component, {
      where: { isActive: true },
    });

    const assessmentComponents: AssessmentComponent[] = [];
    const templateComponentId: Record<string, string> = {};

    components.forEach(
      ({ id, code, name, description, domainId, translations }) => {
        const parentId = templateDomainId[domainId] ?? null;

        if (parentId) {
          const component = manager.create(AssessmentComponent, {
            id: UUID.v4(),
            code,
            name,
            description,
            assessmentId,
            domainId: parentId,
            translations,
          });
          templateComponentId[id] = component.id;
          assessmentComponents.push(component);
        }
      },
    );

    try {
      await manager.insert(AssessmentComponent, assessmentComponents);
      this.logger.debug('templateComponentId', templateComponentId);
      return { components: assessmentComponents, templateComponentId };
    } catch (err) {
      this.logger.error('create:', err);
      throw new BadRequestException('Failed to create assessment components.');
    }
  }

  async findAll(
    query: FindAllAssessmentComponentDto & { assessmentId: string },
  ): Promise<FindAllResponseDto<AssessmentComponentWithCounts>> {
    const qb = this.assessmentComponentRepository.createQueryBuilder('component')
      .leftJoin('component.subComponents', 'subComponent')
      .leftJoin('assessment_sub_component_answers', 'filled', 'filled.subComponentId = subComponent.id')
      .select([
        'component',
        'COUNT(DISTINCT filled.subComponentId) AS "filledSubComponentsCount"',
        'COUNT(DISTINCT subComponent.id) AS "total"'
      ])
      .where('component.assessmentId = :assessmentId', { assessmentId: query.assessmentId })
      .groupBy('component.id');

    if (query.search) {
      qb.andWhere('(component.code ILIKE :search OR component.name ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }
    
    const [rows, total] = await Promise.all([
      qb.skip(query.skip).take(query.take).getRawAndEntities(),
      qb.getCount(),
    ]);

    const data = rows.entities.map((component, idx) => {
      const raw = rows.raw[idx];
      const total = +raw.total || 0;
      const filled = +raw.filledSubComponentsCount || 0;
      return {
        ...component,
        filledSubComponentsCount: filled,
        filledPercentage: total ? Math.round((filled / total) * 100) : 0,
      };
    });
    return { data, total };
  }

  async findOne(
    assessmentId: string,
    id: string,
  ): Promise<AssessmentComponent> {
    const component = await this.assessmentComponentRepository.findOne({
      where: { id, assessmentId },
    });

    if (!component) {
      throw new NotFoundException(`Assessment component ${id} not found.`);
    }

    return component;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentComponentDto,
  ): Promise<AssessmentComponent> {
    return this.assessmentComponentRepository.manager.transaction(
      async (manager) => {
        const component = await this.findOne(assessmentId, id);

        const entity = {
          code: payload.code,
          name: payload.name,
          description: payload.description,
          translations: payload.translations,
        };

        try {
          await manager.update(
            AssessmentComponent,
            { id, assessmentId },
            entity,
          );
          return { ...component, ...entity };
        } catch (err) {
          this.logger.error(`update: ${err.message}`, err.stack);
          throw new BadRequestException(
            'Failed to update assessment component.',
          );
        }
      },
    );
  }

  async findSubComponents(
    id: string,
    query: FindAllAssessmentSubComponentDto & { language?: string },
  ): Promise<FindAllResponseDto<AssessmentSubComponent>> {
    const component = await this.assessmentComponentRepository.findOne({
      where: { id },
    });
    if (!component) {
      throw new NotFoundException(`Component ${id} not found.`);
    }

    // Filter by componentId and assessmentId
    const qb = this.assessmentSubComponentRepository
      .createQueryBuilder('subComponent')
      .where('subComponent.componentId = :componentId', { componentId: id })
      .andWhere('subComponent.assessmentId = :assessmentId', { assessmentId: component.assessmentId });

    if (query.search) {
      qb.andWhere('subComponent.code ILIKE :search OR subComponent.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const sortFields = query.ascending?.length
      ? query.ascending
      : query.descending?.length
        ? query.descending
        : ['createdAt'];
    const sortOrder = query.ascending?.length ? 'ASC' : 'DESC';
    sortFields.forEach((field) => qb.addOrderBy(`subComponent.${field}`, sortOrder));

    const [subComponents, total] = await Promise.all([
      qb.skip(query.skip).take(query.take).getMany(),
      qb.getCount(),
    ]);

    // Add translation if language param is provided
    const language = query.language;
    const data = language
      ? subComponents.map((subComponent) => ({
          ...subComponent,
          name: getTranslated(subComponent, language, 'name', subComponent.name),
          description: getTranslated(subComponent, language, 'description', subComponent.description),
        }))
      : subComponents;

    return {
      data,
      total,
    };
  }

  private filters(query: FindAllAssessmentComponentDto & { assessmentId?: string }): Filter[] {
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
