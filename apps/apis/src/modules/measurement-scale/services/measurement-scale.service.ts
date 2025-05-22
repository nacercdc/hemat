import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CrudService } from '../../../shared/services';
import { MeasurementScale } from '../../../database/entities';
import { MEASUREMENT_SCALE_FIELD_CONFIG } from '../configs';
import {
  MeasurementScaleCreateRequestDto,
  MeasurementScaleUpdateRequestDto,
} from '../dtos';

@Injectable()
export class MeasurementScaleService extends CrudService<MeasurementScale> {
  private readonly loggerService = new Logger(MeasurementScaleService.name);
  protected includes = MEASUREMENT_SCALE_FIELD_CONFIG.includeRelations;
  protected selectable = MEASUREMENT_SCALE_FIELD_CONFIG.selectableFields;
  protected searchable = MEASUREMENT_SCALE_FIELD_CONFIG.searchableFields;
  protected filterable = MEASUREMENT_SCALE_FIELD_CONFIG.filterableFields;
  protected sortable = MEASUREMENT_SCALE_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(MeasurementScale)
    private readonly measurementScaleRepository: Repository<MeasurementScale>,
  ) {
    super(measurementScaleRepository);
  }

  async create(
    payload: MeasurementScaleCreateRequestDto,
  ): Promise<MeasurementScale> {
    const measurementScale = this.measurementScaleRepository.create(payload);
    await this.measurementScaleRepository
      .save(measurementScale)
      .catch((err) => {
        this.loggerService.error('create:', err);
        throw new BadRequestException(
          'measurement.exception.failedToCreateMeasurementScale',
        );
      });
    return measurementScale;
  }

  async update(
    where: FindOptionsWhere<MeasurementScale>,
    payload: MeasurementScaleUpdateRequestDto,
  ): Promise<MeasurementScale> {
    const measurementScale = await this.findOrFail({ where }).catch((err) => {
      this.loggerService.error('update:', err);
      throw new BadRequestException(
        'measurement.exception.measurementScaleNotFound',
      );
    });
    await this.measurementScaleRepository
      .update(measurementScale.id, payload)
      .catch((err) => {
        this.loggerService.error('update:', err);
        throw new BadRequestException(
          'measurement.exception.failedToUpdateMeasurementScale',
        );
      });
    return this.measurementScaleRepository.findOneOrFail({
      where: { id: measurementScale.id },
    });
  }

  async delete(
    where: FindOptionsWhere<MeasurementScale>,
  ): Promise<MeasurementScale> {
    const measurementScale = await this.findOrFail({ where });
    await this.measurementScaleRepository
      .softRemove(measurementScale)
      .catch((err) => {
        this.loggerService.error('delete:', err);
        throw new BadRequestException(
          'measurement.exception.failedToDeleteMeasurementScale',
        );
      });
    return measurementScale;
  }

  async restore(
    where: FindOptionsWhere<MeasurementScale>,
  ): Promise<MeasurementScale> {
    const measurementScale = await this.findOrFail({
      where,
      withDeleted: true,
    });
    await this.measurementScaleRepository
      .recover(measurementScale)
      .catch((err) => {
        this.loggerService.error('restore:', err);
        throw new BadRequestException(
          'measurement.exception.failedToRestoreMeasurementScale',
        );
      });
    return measurementScale;
  }
}
