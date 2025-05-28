import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AssessmentMeasurementScaleSubComponent } from '@africa-cdc/database/entities';
import { AssessmentMeasurementScaleSubComponentDto } from '../dtos';

@Injectable()
export class AssessmentMeasurementScaleSubComponentService {
  private readonly logger = new Logger(
    AssessmentMeasurementScaleSubComponentService.name,
  );

  constructor(
    @InjectRepository(AssessmentMeasurementScaleSubComponent)
    private readonly assessmentMeasurementScaleSubComponentRepository: Repository<AssessmentMeasurementScaleSubComponent>,
  ) {}

  async findAll(
    subComponentId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    return this.assessmentMeasurementScaleSubComponentRepository.find({
      relations: { measurementScale: true },
      where: { subComponentId },
    });
  }

  async findOne(
    subComponentId: string,
    measurementScaleId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
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
  }

  async update(
    subComponentId: string,
    measurementScaleId: string,
    payload: AssessmentMeasurementScaleSubComponentDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const measurementScaleSubComponent = await this.findOne(
      subComponentId,
      measurementScaleId,
    );
    try {
      const entity = {
        description: payload.description,
        translations: payload.translations,
      };
      await this.assessmentMeasurementScaleSubComponentRepository.update(
        { subComponentId, measurementScaleId },
        entity,
      );

      return { ...measurementScaleSubComponent, ...entity };
    } catch (err) {
      this.logger.error(
        `Failed to update assessment measurement scale sub-component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to update assessment measurement scale sub-component',
      );
    }
  }
}
