import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import {
  AssessmentMeasurementScaleSubComponent,
  AssessmentSubComponent,
  MeasurementScaleSubComponent,
} from '@database/entities';
import {
  AssessmentMeasurementScaleSubComponentDto,
  FindAllAssessmentMeasurementScaleSubComponentDto,
} from '../dtos';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';

@Injectable()
export class AssessmentMeasurementScaleSubComponentService {
  private readonly loggerService = new Logger(
    AssessmentMeasurementScaleSubComponentService.name,
  );

  constructor(
    @InjectRepository(AssessmentMeasurementScaleSubComponent)
    private readonly assessmentMeasurementScaleSubComponentRepository: Repository<AssessmentMeasurementScaleSubComponent>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
  ) {}

  async create(
    manager: EntityManager,
    templateSubComponentId: Record<string, string>,
    templateMeasurementScaleId: Record<string, string>,
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    try {
      const measurementScaleSubComponents = await manager.find(
        MeasurementScaleSubComponent,
      );

      const entities: AssessmentMeasurementScaleSubComponent[] = [];
      const repository = manager.getRepository(
        AssessmentMeasurementScaleSubComponent,
      );
      measurementScaleSubComponents.forEach(
        ({ description, translations, subComponentId, measurementScaleId }) => {
          const subCompId = templateSubComponentId[subComponentId] ?? null;
          const scaleId =
            templateMeasurementScaleId[measurementScaleId] ?? null;

          if (subCompId && scaleId) {
            entities.push(
              repository.create({
                subComponentId: subCompId,
                measurementScaleId: scaleId,
                description,
                translations,
              }),
            );
          }
        },
      );

      await repository.insert(entities);

      return entities;
    } catch (err) {
      this.loggerService.error(
        `Failed to create assessment measurement scale sub-components for subComponentId`,
        err.stack || err,
      );
      throw new BadRequestException(
        'Failed to create assessment measurement scale sub-components',
      );
    }
  }

  async findAll(
    query: FindAllAssessmentMeasurementScaleSubComponentDto,
  ): Promise<FindAllResponseDto<AssessmentMeasurementScaleSubComponent>> {
    return new QueryService<AssessmentMeasurementScaleSubComponent>(
      this.assessmentMeasurementScaleSubComponentRepository,
    )
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(
    subComponentId: string,
    measurementScaleId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException(`Sub-component ${subComponentId} not found`);
    }

    const measurementScaleSubComponent =
      await this.assessmentMeasurementScaleSubComponentRepository.findOne({
        where: { subComponentId, measurementScaleId },
        relations: ['measurementScale'],
      });

    if (!measurementScaleSubComponent) {
      throw new NotFoundException(
        `Measurement scale ${measurementScaleId} not found for sub-component ${subComponentId}`,
      );
    }

    return measurementScaleSubComponent;
  }

  async update(
    subComponentId: string,
    measurementScaleId: string,
    payload: AssessmentMeasurementScaleSubComponentDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    try {
      const measurementScaleSubComponent = await this.findOne(
        subComponentId,
        measurementScaleId,
      );

      const updatedEntity = {
        ...measurementScaleSubComponent,
        description:
          payload.description ?? measurementScaleSubComponent.description,
        translations:
          payload.translations ?? measurementScaleSubComponent.translations,
      };

      await this.assessmentMeasurementScaleSubComponentRepository.update(
        { subComponentId, measurementScaleId },
        updatedEntity,
      );

      return updatedEntity;
    } catch (err) {
      this.loggerService.error(
        `Failed to update assessment measurement scale sub-component for subComponentId: ${subComponentId}, measurementScaleId: ${measurementScaleId}`,
        err.stack || err,
      );
      throw err instanceof NotFoundException
        ? err
        : new BadRequestException(
            'Failed to update assessment measurement scale sub-component',
          );
    }
  }
}
