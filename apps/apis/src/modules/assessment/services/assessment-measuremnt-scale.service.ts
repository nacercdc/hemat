import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  AssessmentMeasurementScale,
  AssessmentSubComponent,
  AssessmentMeasurementScaleSubComponent,
} from '@africa-cdc/database/entities';
import { AssessmentMeasurementScaleDto } from '../dtos';

@Injectable()
export class AssessmentMeasurementScaleService {
  private readonly logger = new Logger(AssessmentMeasurementScaleService.name);

  constructor(
    @InjectRepository(AssessmentMeasurementScale)
    private readonly assessmentMeasurementScaleRepository: Repository<AssessmentMeasurementScale>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentMeasurementScaleSubComponent)
    private readonly assessmentMeasurementScaleSubComponentRepository: Repository<AssessmentMeasurementScaleSubComponent>,
  ) {}

  async findAll(subComponentId: string): Promise<AssessmentMeasurementScale[]> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException('Assessment sub-component not found');
    }
    const measurementScaleSubComponents =
      await this.assessmentMeasurementScaleSubComponentRepository.find({
        where: { subComponentId },
      });
    const measurementScaleIds = measurementScaleSubComponents.map(
      (ms) => ms.measurementScaleId,
    );
    return this.assessmentMeasurementScaleRepository.find({
      where: { id: In(measurementScaleIds) },
    });
  }

  async findOne(
    subComponentId: string,
    id: string,
  ): Promise<AssessmentMeasurementScale> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException('Assessment sub-component not found');
    }
    const association =
      await this.assessmentMeasurementScaleSubComponentRepository.findOne({
        where: { subComponentId, measurementScaleId: id },
      });
    if (!association) {
      throw new BadRequestException(
        'Measurement scale is not associated with the specified sub-component',
      );
    }
    const measurementScale =
      await this.assessmentMeasurementScaleRepository.findOne({
        where: { id },
      });
    if (!measurementScale) {
      throw new NotFoundException('Assessment measurement scale not found');
    }
    return measurementScale;
  }

  async update(
    subComponentId: string,
    id: string,
    payload: AssessmentMeasurementScaleDto,
  ): Promise<AssessmentMeasurementScale> {
    // Validate sub-component and association via findOne
    await this.findOne(subComponentId, id);

    try {
      const entity = {
        name: payload.name,
        description: payload.description,
        color: payload.color,
        rate: payload.rate,
        translations: payload.translations,
      };
      await this.assessmentMeasurementScaleRepository.update({ id }, entity);

      // Fetch updated record to ensure accuracy
      const updatedMeasurementScale = await this.findOne(subComponentId, id);
      return updatedMeasurementScale;
    } catch (err) {
      this.logger.error(
        `Failed to update assessment measurement scale: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        `Failed to update assessment measurement scale: ${err.message}`,
      );
    }
  }
}
