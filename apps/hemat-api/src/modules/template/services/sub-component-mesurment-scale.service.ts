import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  SubComponent,
  MeasurementScale,
  MeasurementScaleSubComponent,
} from '../../../database/entities';
import {
  SubComponentMeasurementScaleDto,
  UpdateSubComponentMeasurementScaleDto,
  BatchUpdateSubComponentMeasurementScaleDto,
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

      await this.measurementScaleSubComponentRepository.insert({
        subComponentId: subComponentId,
        measurementScaleId: payload.measurementScaleId,
        description: payload.description,
        translations: payload.translations,
      });

      const savedEntity =
        await this.measurementScaleSubComponentRepository.findOne({
          where: {
            subComponentId: subComponentId,
            measurementScaleId: payload.measurementScaleId,
          },
        });

      this.logger.log(
        `Created relationship between SubComponent ${subComponentId} and MeasurementScale ${payload.measurementScaleId}`,
      );
      return savedEntity!;
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

      if (!payload.description && !payload.translations) {
        this.logger.error('No fields provided for update');
        throw new BadRequestException(
          'measurementScaleSubComponent.exception.noFieldsProvided',
        );
      }

      await this.measurementScaleSubComponentRepository.update(
        { subComponentId, measurementScaleId },
        {
          ...(payload.description && { description: payload.description }),
          ...(payload.translations && { translations: payload.translations }),
        },
      );

      const updatedEntity =
        await this.measurementScaleSubComponentRepository.findOne({
          where: {
            subComponentId: subComponentId,
            measurementScaleId: measurementScaleId,
          },
        });

      this.logger.log(
        `Updated relationship between SubComponent ${subComponentId} and MeasurementScale ${measurementScaleId}`,
      );
      return updatedEntity!;
    } catch (err) {
      this.logger.error('update:', err);
      throw new BadRequestException(
        'Failed to update measurement scale sub-component.',
      );
    }
  }

  async batchCreate(
    subComponentId: string,
    payloads: SubComponentMeasurementScaleDto[],
  ): Promise<MeasurementScaleSubComponent[]> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException('subComponent.exception.notFound');
    }

    const measurementScaleIds = payloads.map(p => p.measurementScaleId);
    const foundScales = await this.measurementScaleRepository.findBy({
      id: In(measurementScaleIds),
    });
    const foundScaleIds = new Set(foundScales.map(s => s.id));
    const missingScaleIds = measurementScaleIds.filter(id => !foundScaleIds.has(id));
    if (missingScaleIds.length > 0) {
      throw new NotFoundException(`measurementScale.exception.notFound: ${missingScaleIds.join(', ')}`);
    }

    const existingRelations = await this.measurementScaleSubComponentRepository.find({
      where: {
        subComponentId,
        measurementScaleId: In(measurementScaleIds),
      },
    });
    if (existingRelations.length > 0) {
      const existingIds = existingRelations.map(r => r.measurementScaleId);
      throw new BadRequestException(
        `measurementScaleSubComponent.exception.alreadyExists: ${existingIds.join(', ')}`
      );
    }

    const insertData = payloads.map(payload => ({
      subComponentId,
      measurementScaleId: payload.measurementScaleId,
      description: payload.description,
      translations: payload.translations,
    }));

    await this.measurementScaleSubComponentRepository.insert(insertData);

    const createdEntities =
      await this.measurementScaleSubComponentRepository.find({
        where: {
          subComponentId,
          measurementScaleId: In(measurementScaleIds),
        },
      });

    return createdEntities;
  }

  async batchUpdate(
    subComponentId: string,
    payloads: BatchUpdateSubComponentMeasurementScaleDto[],
  ): Promise<MeasurementScaleSubComponent[]> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException('subComponent.exception.notFound');
    }

    const measurementScaleIds = payloads.map(p => p.measurementScaleId);
    const foundScales = await this.measurementScaleRepository.findBy({
      id: In(measurementScaleIds),
    });
    const foundScaleIds = new Set(foundScales.map(s => s.id));
    const missingScaleIds = measurementScaleIds.filter(id => !foundScaleIds.has(id));
    if (missingScaleIds.length > 0) {
      throw new NotFoundException(`measurementScale.exception.notFound: ${missingScaleIds.join(', ')}`);
    }

    // 3. Check all relations in one query
    const existingRelations = await this.measurementScaleSubComponentRepository.find({
      where: {
        subComponentId,
        measurementScaleId: In(measurementScaleIds),
      },
    });
    const existingIds = new Set(existingRelations.map(r => r.measurementScaleId));
    const missingRelationIds = measurementScaleIds.filter(id => !existingIds.has(id));
    if (missingRelationIds.length > 0) {
      throw new NotFoundException(`measurementScaleSubComponent.exception.notFound: ${missingRelationIds.join(', ')}`);
    }

    await Promise.all(payloads.map(payload =>
      this.measurementScaleSubComponentRepository.update(
        { subComponentId, measurementScaleId: payload.measurementScaleId },
        {
          ...(payload.description && { description: payload.description }),
          ...(payload.translations && { translations: payload.translations }),
        },
      )
    ));

    const updatedEntities =
      await this.measurementScaleSubComponentRepository.find({
        where: {
          subComponentId,
          measurementScaleId: In(measurementScaleIds),
        },
      });

    return updatedEntities;
  }
}