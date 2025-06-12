import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';
import {
  AssessmentMeasurementScale,
  MeasurementScale,
} from '@database/entities';
import { UUID } from '@shared/helpers';
import { FindAllResponseDto } from '@shared/dtos';
import { QueryService } from '@shared/services';
import {
  AssessmentMeasurementScaleDto,
  FindAllAssessmentMeasurementScaleDto,
} from '..';

@Injectable()
export class AssessmentMeasurementScaleService {
  private readonly loggerService = new Logger(
    AssessmentMeasurementScaleService.name,
  );

  constructor(
    @InjectRepository(AssessmentMeasurementScale)
    private readonly assessmentMeasurementScaleRepository: Repository<AssessmentMeasurementScale>,
  ) {}

  async create(
    manager: EntityManager,
    assessmentId: string,
  ): Promise<{
    measurementScales: AssessmentMeasurementScale[];
    templateMeasurementScaleId: Record<string, string>;
  }> {
    const measurementScales = await manager.find(MeasurementScale);

    const assessmentMeasurementScales: AssessmentMeasurementScale[] = [];
    const templateMeasurementScaleId: Record<string, string> = {};
    measurementScales.forEach(
      ({ id, name, description, translations, color, rate }) => {
        const measurementScale = manager.create(AssessmentMeasurementScale, {
          id: UUID.v4(),
          name,
          description,
          color,
          rate,
          assessmentId,
          translations,
        });
        templateMeasurementScaleId[id] = measurementScale.id;
        assessmentMeasurementScales.push(measurementScale);
      },
    );

    this.loggerService.debug(
      'templateMeasurementScaleId',
      templateMeasurementScaleId,
    );
    await manager.insert(
      AssessmentMeasurementScale,
      assessmentMeasurementScales,
    );

    return {
      measurementScales: assessmentMeasurementScales,
      templateMeasurementScaleId,
    };
  }

  async findAll(
    query: FindAllAssessmentMeasurementScaleDto & { assessmentId: string },
  ): Promise<FindAllResponseDto<AssessmentMeasurementScale>> {
    return new QueryService<AssessmentMeasurementScale>(
      this.assessmentMeasurementScaleRepository,
    )
      .filter(
        [{ field: 'assessmentId', operator: '=', value: query.assessmentId }],
        {
          fields: ['name'],
          value: query.search,
        },
      )
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
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
      throw new NotFoundException(
        `Assessment measurement scale ${id} not found.`,
      );
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
      this.loggerService.error(
        `Failed to update assessment measurement scale: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        `Failed to update assessment measurement scale: ${err.message}`,
      );
    }
  }
}
