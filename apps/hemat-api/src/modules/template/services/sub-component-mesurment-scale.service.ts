import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SubComponent,
  MeasurementScale,
  MeasurementScaleSubComponent,
} from '../../../database/entities';
import {
  SubComponentMeasurementScaleDto,
  UpdateSubComponentMeasurementScaleDto,
  FindAllSubComponentMeasurementScaleDto,
} from '../dtos';

@Injectable()
export class SubComponentMeasurementScaleService {
  private readonly logger = new Logger(
    SubComponentMeasurementScaleService.name,
  );

  constructor(
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    @InjectRepository(MeasurementScale)
    private readonly measurementScaleRepository: Repository<MeasurementScale>,
    @InjectRepository(MeasurementScaleSubComponent)
    private readonly measurementScaleSubComponentRepository: Repository<MeasurementScaleSubComponent>,
  ) {}

  async create(
    subComponentId: string,
    payload: SubComponentMeasurementScaleDto,
  ): Promise<MeasurementScaleSubComponent> {
    try {
      const subComponent = await this.subComponentRepository.findOne({
        where: { id: subComponentId },
      });
      if (!subComponent) {
        this.logger.error(`SubComponent with ID ${subComponentId} not found`);
        throw new NotFoundException('subComponent.exception.notFound');
      }

      const measurementScale = await this.measurementScaleRepository.findOne({
        where: { id: payload.measurementScaleId },
      });
      if (!measurementScale) {
        this.logger.error(
          `MeasurementScale with ID ${payload.measurementScaleId} not found`,
        );
        throw new NotFoundException('measurementScale.exception.notFound');
      }

      const existingRelation =
        await this.measurementScaleSubComponentRepository.findOne({
          where: {
            subComponentId: subComponentId,
            measurementScaleId: payload.measurementScaleId,
          },
        });
      if (existingRelation) {
        this.logger.error(
          `Relationship between SubComponent ${subComponentId} and MeasurementScale ${payload.measurementScaleId} already exists`,
        );
        throw new BadRequestException(
          'measurementScaleSubComponent.exception.alreadyExists',
        );
      }

      const measurementScaleSubComponent =
        this.measurementScaleSubComponentRepository.create({
          subComponentId: subComponentId,
          measurementScaleId: payload.measurementScaleId,
          description: payload.description,
          translations: payload.translations,
          subComponent,
          measurementScale,
        });

      const savedEntity =
        await this.measurementScaleSubComponentRepository.save(
          measurementScaleSubComponent,
        );
      this.logger.log(
        `Created relationship between SubComponent ${subComponentId} and MeasurementScale ${payload.measurementScaleId}`,
      );
      return savedEntity;
    } catch (err) {
      this.logger.error('create:', err);
      throw new BadRequestException(
        'Failed to create measurement scale sub-component.',
      );
    }
  }

  async update(
    subComponentId: string,
    measurementScaleId: string,
    payload: UpdateSubComponentMeasurementScaleDto,
  ): Promise<MeasurementScaleSubComponent> {
    try {
      const relation =
        await this.measurementScaleSubComponentRepository.findOne({
          where: {
            subComponentId: subComponentId,
            measurementScaleId: measurementScaleId,
          },
        });
      if (!relation) {
        this.logger.error(
          `Relationship between SubComponent ${subComponentId} and MeasurementScale ${measurementScaleId} not found`,
        );
        throw new NotFoundException(
          'measurementScaleSubComponent.exception.notFound',
        );
      }

      const subComponent = await this.subComponentRepository.findOne({
        where: { id: subComponentId },
      });
      if (!subComponent) {
        this.logger.error(`SubComponent with ID ${subComponentId} not found`);
        throw new NotFoundException('subComponent.exception.notFound');
      }

      const measurementScale = await this.measurementScaleRepository.findOne({
        where: { id: measurementScaleId },
      });
      if (!measurementScale) {
        this.logger.error(
          `MeasurementScale with ID ${measurementScaleId} not found`,
        );
        throw new NotFoundException('measurementScale.exception.notFound');
      }

      if (!payload.description && !payload.translations) {
        this.logger.error('No fields provided for update');
        throw new BadRequestException(
          'measurementScaleSubComponent.exception.noFieldsProvided',
        );
      }

      if (payload.description) {
        relation.description = payload.description;
      }
      if (payload.translations) {
        relation.translations = payload.translations;
      }
      relation.subComponent = subComponent;
      relation.measurementScale = measurementScale;

      const updatedEntity =
        await this.measurementScaleSubComponentRepository.save(relation);
      this.logger.log(
        `Updated relationship between SubComponent ${subComponentId} and MeasurementScale ${measurementScaleId}`,
      );
      return updatedEntity;
    } catch (err) {
      this.logger.error('update:', err);
      throw new BadRequestException(
        'Failed to update measurement scale sub-component.',
      );
    }
  }
}