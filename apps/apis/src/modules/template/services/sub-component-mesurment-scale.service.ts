import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SubComponent,
  MeasurementScale,
  MeasurementScaleSubComponent,
} from '../../../database/entities';
import { SUB_COMPONENT_FIELD_CONFIG } from '../config/sub-component-field-config';
import { SubComponentMeasurementScaleDto } from '../dtos';

@Injectable()
export class SubComponentMeasurementScaleService {
  private readonly loggerService = new Logger(
    SubComponentMeasurementScaleService.name,
  );
  protected includes = SUB_COMPONENT_FIELD_CONFIG.includeRelations;
  protected selectable = SUB_COMPONENT_FIELD_CONFIG.selectableFields;
  protected searchable = SUB_COMPONENT_FIELD_CONFIG.searchableFields;
  protected filterable = SUB_COMPONENT_FIELD_CONFIG.filterableFields;
  protected sortable = SUB_COMPONENT_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    @InjectRepository(MeasurementScale)
    private readonly measurementScaleRepository: Repository<MeasurementScale>,
    @InjectRepository(MeasurementScaleSubComponent)
    private readonly measurementScaleSubComponentRepository: Repository<MeasurementScaleSubComponent>,
  ) {}

  /**
   * Retrieve all measurement scales associated with a sub-component.
   * @param subComponentId - The ID of the sub-component.
   * @returns An array of MeasurementScaleSubComponent entities.
   */
  async findAll(
    subComponentId: string,
  ): Promise<MeasurementScaleSubComponent[]> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id: subComponentId },
      relations: ['measurementScales', 'measurementScales.measurementScale'],
    });

    if (!subComponent) {
      this.loggerService.error(
        `SubComponent with ID ${subComponentId} not found`,
      );
      throw new NotFoundException('subComponent.exception.notFound');
    }

    return subComponent.measurementScales || [];
  }

  /**
   * Associate a measurement scale with a sub-component.
   * @param subComponentId - The ID of the sub-component.
   * @param payload - The DTO containing measurementScaleId and description.
   * @returns The created MeasurementScaleSubComponent entity.
   */
  async create(
    subComponentId: string,
    payload: SubComponentMeasurementScaleDto,
  ): Promise<MeasurementScaleSubComponent> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      this.loggerService.error(
        `SubComponent with ID ${subComponentId} not found`,
      );
      throw new NotFoundException('subComponent.exception.notFound');
    }

    const measurementScale = await this.measurementScaleRepository.findOne({
      where: { id: payload.measurementScaleId },
    });
    if (!measurementScale) {
      this.loggerService.error(
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
      this.loggerService.error(
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
        subComponent,
        measurementScale,
      });

    try {
      await this.measurementScaleSubComponentRepository.save(
        measurementScaleSubComponent,
      );
      this.loggerService.log(
        `Created relationship between SubComponent ${subComponentId} and MeasurementScale ${payload.measurementScaleId}`,
      );
      return measurementScaleSubComponent;
    } catch (error) {
      this.loggerService.error(
        'Failed to create measurement scale sub-component:',
        error,
      );
      throw new BadRequestException(
        'measurementScaleSubComponent.exception.failedToCreate',
      );
    }
  }
}
