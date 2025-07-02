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
} from '../dtos';
import { FindAllAssessmentMeasurementScaleSubComponentDto } from '../dtos';
import { getTranslated } from '@shared/helpers/translation.helper';

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
    query: FindAllAssessmentMeasurementScaleSubComponentDto & {
      language?: string;
    },
  ): Promise<FindAllResponseDto<AssessmentMeasurementScaleSubComponentDto>> {
    const queryBuilder = this.assessmentMeasurementScaleSubComponentRepository.createQueryBuilder('assessmentMeasurementScaleSubComponent');

    if (query.include?.includes('measurementScale')) {
      queryBuilder.leftJoinAndSelect('assessmentMeasurementScaleSubComponent.measurementScale', 'measurementScale');
    }

    queryBuilder.where('assessmentMeasurementScaleSubComponent.subComponentId = :subComponentId', { 
      subComponentId: query.subComponentId 
    });

    const [data, total] = await queryBuilder.getManyAndCount();

    const language = query.language;
    const translatedData = language
      ? data.map((component) => ({
          ...component,
          description: getTranslated(
            component,
            language,
            'description',
            component.description,
          ),
        }))
      : data;

    return {
      data: translatedData,
      total
    };
  }

  async findOne(
    subComponentId: string,
    measurementScaleId: string,
    language?: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const measurementScale =
      await this.assessmentMeasurementScaleSubComponentRepository.findOne({
        where: {
          subComponentId,
          measurementScaleId,
        },
        relations: {
          measurementScale: true,
        },
      });

    if (!measurementScale) {
      throw new NotFoundException(
        `Measurement scale with ID ${measurementScaleId} not found for sub-component ${subComponentId}`,
      );
    }

    // Apply translations if language is specified
    if (language) {
      return {
        ...measurementScale,
        description: getTranslated(measurementScale, language, 'description', measurementScale.description),
      };
    }

    return measurementScale;
  }

  async update(
    subComponentId: string,
    measurementScaleId: string,
    payload: AssessmentMeasurementScaleSubComponentUpdateDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const existingMeasurementScale = await this.findOne(
      subComponentId,
      measurementScaleId,
    );

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

  async batchUpdate(
    subComponentId: string,
    payloads: import('../dtos/assessment-measurement-scale-sub-component.dto').BatchUpdateAssessmentMeasurementScaleSubComponentDto[],
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    const updatedEntities: AssessmentMeasurementScaleSubComponent[] = [];
    for (const payload of payloads) {
      const updated = await this.update(
        subComponentId,
        payload.measurementScaleId,
        payload,
      );
      updatedEntities.push(updated);
    }
    return updatedEntities;
  }
}
