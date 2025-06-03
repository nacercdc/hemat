import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  AssessmentSubComponent,
  SubComponent,
} from '@africa-cdc/database/entities';
import { AssessmentSubComponentDto } from '../dtos';
import { UUID } from '@africa-cdc/shared';

@Injectable()
export class AssessmentSubComponentService {
  private readonly loggerService = new Logger(
    AssessmentSubComponentService.name,
  );

  constructor(
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
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

  async findAll(assessmentId: string): Promise<AssessmentSubComponent[]> {
    return this.assessmentSubComponentRepository.find({
      where: { assessmentId },
    });
  }

  async findOne(
    assessmentId: string,
    id: string,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id, assessmentId },
    });
    if (!subComponent) {
      throw new NotFoundException('Assessment sub-component not found');
    }
    return subComponent;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.findOne(assessmentId, id);
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
}
