import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AssessmentMeasurementScale } from '@africa-cdc/database/entities';
import { AssessmentMeasurementScaleDto } from '../dtos';

@Injectable()
export class AssessmentMeasurementScaleService {
  private readonly logger = new Logger(AssessmentMeasurementScaleService.name);

  constructor(
    @InjectRepository(AssessmentMeasurementScale)
    private readonly assessmentMeasurementScaleRepository: Repository<AssessmentMeasurementScale>,
  ) {}

  async findAll(assessmentId: string): Promise<AssessmentMeasurementScale[]> {
    return this.assessmentMeasurementScaleRepository.find({
      where: { assessmentId },
    });
  }

  async findOne(
    assessmentId: string,
    id: string,
  ): Promise<AssessmentMeasurementScale> {
    const measurementScale =
      await this.assessmentMeasurementScaleRepository.findOne({
        where: { id, assessmentId },
      });
    if (!measurementScale) {
      throw new NotFoundException('Assessment measurement scale not found');
    }
    return measurementScale;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentMeasurementScaleDto,
  ): Promise<AssessmentMeasurementScale> {
    const measurementScale = await this.findOne(assessmentId, id);

    try {
      const entity = {
        name: payload.name,
        description: payload.description,
        color: payload.color,
        rate: payload.rate,
        translations: payload.translations,
      };
      
      await this.assessmentMeasurementScaleRepository.update({ id }, entity);

      return { ...measurementScale, ...entity };
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
