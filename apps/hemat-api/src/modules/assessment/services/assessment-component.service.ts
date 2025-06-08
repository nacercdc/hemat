import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  AssessmentComponent,
  AssessmentSubComponent,
  Component,
} from '@database/entities';
import { Filter, QueryService } from '@shared/services';
import {
  AssessmentComponentDto,
  FindAllAssessmentComponentDto,
  FindAllAssessmentSubComponentDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { UUID } from '@shared/helpers';

@Injectable()
export class AssessmentComponentService {
  private readonly logger = new Logger(AssessmentComponentService.name);

  constructor(
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
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
  ): Promise<FindAllResponseDto<AssessmentComponent>> {
    return new QueryService<AssessmentComponent>(
      this.assessmentComponentRepository,
    )
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
    query: FindAllAssessmentSubComponentDto,
  ): Promise<FindAllResponseDto<AssessmentSubComponent>> {
    const component = await this.assessmentComponentRepository.findOne({
      where: { id },
    });
    if (!component) {
      throw new NotFoundException(`Component ${id} not found.`);
    }

    return await new QueryService<AssessmentSubComponent>(
      this.assessmentSubComponentRepository,
    )
      .filter([], {
        fields: ['code', 'name'],
        value: query.search,
      })
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  private filters(query: FindAllAssessmentComponentDto): Filter[] {
    const filters: Filter[] = [];
    if (typeof query.isActive === 'boolean') {
      filters.push({
        field: 'isActive',
        operator: '=',
        value: query.isActive,
      });
    }

    return filters;
  }
}
