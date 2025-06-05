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
  MeasurementScaleSubComponent,
} from '@database/entities';
import { AssessmentMeasurementScaleSubComponentDto } from '../dtos';

@Injectable()
export class AssessmentMeasurementScaleSubComponentService {
  private readonly loggerService = new Logger(
    AssessmentMeasurementScaleSubComponentService.name,
  );

  constructor(
    @InjectRepository(AssessmentMeasurementScaleSubComponent)
    private readonly assessmentMeasurementScaleSubComponentRepository: Repository<AssessmentMeasurementScaleSubComponent>,
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
    subComponentId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    try {
      return await this.assessmentMeasurementScaleSubComponentRepository.find({
        relations: { measurementScale: true },
        where: { subComponentId },
      });
    } catch (err) {
      this.loggerService.error(
        `Failed to retrieve assessment measurement scale sub-components for subComponentId: ${subComponentId}`,
        err.stack || err,
      );
      throw new BadRequestException(
        'Failed to retrieve assessment measurement scale sub-components',
      );
    }
  }

  async findOne(
    subComponentId: string,
    measurementScaleId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    try {
      const measurementScaleSubComponent =
        await this.assessmentMeasurementScaleSubComponentRepository.findOne({
          relations: { measurementScale: true },
          where: { subComponentId, measurementScaleId },
        });

      if (!measurementScaleSubComponent) {
        throw new NotFoundException(
          'Assessment measurement scale sub-component not found',
        );
      }

      return measurementScaleSubComponent;
    } catch (err) {
      this.loggerService.error(
        `Failed to retrieve assessment measurement scale sub-component for subComponentId: ${subComponentId}, measurementScaleId: ${measurementScaleId}`,
        err.stack || err,
      );
      throw err instanceof NotFoundException
        ? err
        : new BadRequestException(
            'Failed to retrieve assessment measurement scale sub-component',
          );
    }
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