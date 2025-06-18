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
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import {
  AssessmentMeasurementScaleSubComponentDto,
  AssessmentMeasurementScaleSubComponentUpdateDto,
  FindAllAssessmentMeasurementScaleSubComponentDto,
} from '../dtos';

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
  ): Promise<FindAllResponseDto<AssessmentMeasurementScaleSubComponentDto>> {
    const result = await new QueryService<AssessmentMeasurementScaleSubComponent>(
      this.assessmentMeasurementScaleSubComponentRepository,
    ).getManyAndCount();

    return {
      data: result.data,
      total: result.total,
    };
  }

  async findOne(
    subComponentId: string,
    measurementScaleId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const measurementScale = await this.assessmentMeasurementScaleSubComponentRepository.findOne({
      where: {
        subComponentId,
        measurementScaleId,
      },
    });

    if (!measurementScale) {
      throw new NotFoundException(
        `Measurement scale with ID ${measurementScaleId} not found for sub-component ${subComponentId}`,
      );
    }

    return measurementScale;
  }

  async update(
    subComponentId: string,
    measurementScaleId: string,
    payload: AssessmentMeasurementScaleSubComponentUpdateDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const existingMeasurementScale = await this.findOne(subComponentId, measurementScaleId);

    try {
      const entity = {
        description: payload.description,
        translations: payload.translations,
      };

      await this.assessmentMeasurementScaleSubComponentRepository.update(
        {
          subComponentId,
          measurementScaleId,
        },
        entity,
      );

      return {
        ...existingMeasurementScale,
        ...entity,
      };
    } catch (error) {
      this.loggerService.error(
        `Failed to update measurement scale ${measurementScaleId} for sub-component ${subComponentId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to update measurement scale');
    }
  }
}
