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
import { QueryService } from '@shared/services';
import {
  SubComponentMeasurementScaleDto,
  FindAllSubComponentMeasurementScaleDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';

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
}
