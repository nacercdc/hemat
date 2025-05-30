import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AssessmentComponent, Component } from '@database/entities';
import { AssessmentComponentDto } from '../dtos';
import { UUID } from '@shared/helpers';

@Injectable()
export class AssessmentComponentService {
  private readonly loggerService = new Logger(AssessmentComponentService.name);

  constructor(
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
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

    this.loggerService.debug('templateComponentId', templateComponentId);
    await manager.insert(AssessmentComponent, assessmentComponents);

    return { components: assessmentComponents, templateComponentId };
  }

  async findAll(assessmentId: string): Promise<AssessmentComponent[]> {
    return this.assessmentComponentRepository.find({
      where: { assessmentId },
    });
  }

  async findOne(
    assessmentId: string,
    id: string,
  ): Promise<AssessmentComponent> {
    const component = await this.assessmentComponentRepository.findOne({
      where: { id, assessmentId },
    });
    if (!component) {
      throw new NotFoundException('Assessment component not found');
    }
    return component;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentComponentDto,
  ): Promise<AssessmentComponent> {
    const component = await this.findOne(assessmentId, id);
    try {
      const entity = {
        code: payload.code,
        name: payload.name,
        description: payload.description,
        translations: payload.translations,
      };
      await this.assessmentComponentRepository.update(
        { id, assessmentId },
        entity,
      );

      return { ...component, ...entity };
    } catch (err) {
      this.loggerService.error(
        `Failed to update assessment component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment component');
    }
  }
}
