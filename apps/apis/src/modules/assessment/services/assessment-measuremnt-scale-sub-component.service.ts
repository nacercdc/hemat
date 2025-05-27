import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  AssessmentMeasurementScaleSubComponent,
  AssessmentSubComponent,
} from '@africa-cdc/database/entities';
import { AssessmentMeasurementScaleSubComponentDto } from '../dtos';

@Injectable()
export class AssessmentMeasurementScaleSubComponentService {
  private readonly logger = new Logger(
    AssessmentMeasurementScaleSubComponentService.name,
  );

  constructor(
    @InjectRepository(AssessmentMeasurementScaleSubComponent)
    private readonly assessmentMeasurementScaleSubComponentRepository: Repository<AssessmentMeasurementScaleSubComponent>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
  ) {}

  async findAll(
    assessmentId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    const subComponents = await this.assessmentSubComponentRepository.find({
      where: { assessmentId },
    });
    const subComponentIds = subComponents.map((sc) => sc.id);
    return this.assessmentMeasurementScaleSubComponentRepository.find({
      where: { subComponentId: In(subComponentIds) },
      relations: ['measurementScale'],
    });
  }

  async findOne(id: string): Promise<AssessmentMeasurementScaleSubComponent> {
    const measurementScaleSubComponent =
      await this.assessmentMeasurementScaleSubComponentRepository.findOne({
        where: { id },
        relations: ['measurementScale'],
      });
    if (!measurementScaleSubComponent) {
      throw new NotFoundException(
        'Assessment measurement scale sub-component not found',
      );
    }
    return measurementScaleSubComponent;
  }

  async update(
    id: string,
    payload: AssessmentMeasurementScaleSubComponentDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const measurementScaleSubComponent = await this.findOne(id);
    try {
      const entity = {
        description: payload.description,
        translations: payload.translations,
        subComponentId: payload.subComponentId,
        measurementScaleId: payload.measurementScaleId,
      };
      await this.assessmentMeasurementScaleSubComponentRepository.update(
        { id },
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
