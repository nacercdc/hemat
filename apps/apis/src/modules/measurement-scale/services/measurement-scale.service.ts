import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeasurementScale } from '@database/entities';
import { QueryService } from '@shared/services';
import {
  FindAllMeasurementScaleDto,
  MeasurementScaleCreateRequestDto,
  MeasurementScaleUpdateRequestDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';

@Injectable()
export class MeasurementScaleService {
  private readonly logger = new Logger(MeasurementScaleService.name);

  constructor(
    @InjectRepository(MeasurementScale)
    private readonly measurementScaleRepository: Repository<MeasurementScale>,
  ) {}

  async findAll(
    query: FindAllMeasurementScaleDto,
  ): Promise<FindAllResponseDto<MeasurementScale>> {
    try {
      return await new QueryService<MeasurementScale>(
        this.measurementScaleRepository,
      )
        .filter([], { fields: ['name', 'rate'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findAll:', err);
      throw new BadRequestException('Failed to fetch measurement scales.');
    }
  }

  async findOne(id: string): Promise<MeasurementScale> {
    const measurementScale = await this.measurementScaleRepository.findOne({
      where: { id },
    });

    if (!measurementScale) {
      throw new NotFoundException(`Measurement scale ${id} not found.`);
    }

    return measurementScale;
  }

  async create(
    payload: MeasurementScaleCreateRequestDto,
  ): Promise<MeasurementScale> {
    const measurementScale = this.measurementScaleRepository.create(payload);
    return await this.measurementScaleRepository.save(measurementScale);
  }

  async update(
    id: string,
    payload: MeasurementScaleUpdateRequestDto,
  ): Promise<MeasurementScale> {
    const measurementScale = await this.measurementScaleRepository.findOne({
      where: { id },
    });

    if (!measurementScale) {
      throw new NotFoundException(`Measurement scale ${id} not found.`);
    }

    Object.assign(measurementScale, payload);
    return await this.measurementScaleRepository.save(measurementScale);
  }

  async delete(id: string): Promise<MeasurementScale> {
    const measurementScale = await this.measurementScaleRepository.findOne({
      where: { id },
    });

    if (!measurementScale) {
      throw new NotFoundException(`Measurement scale ${id} not found.`);
    }

    return await this.measurementScaleRepository.softRemove(measurementScale);
  }

  async restore(id: string): Promise<MeasurementScale> {
    const measurementScale = await this.measurementScaleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!measurementScale) {
      throw new NotFoundException(`Measurement scale ${id} not found.`);
    }

    return await this.measurementScaleRepository.recover(measurementScale);
  }
}
