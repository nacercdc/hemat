import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Assessment } from '@database/entities';
import { QueryService } from '@shared/services';
import {
  FindAllAssessmentDto,
  FindOneAssessmentDto,
  AssessmentCreateRequestDto,
  AssessmentUpdateRequestDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { AssessmentDomainService } from './assessment-domain.service';
import { AssessmentComponentService } from './assessment-component.service';
import { AssessmentSubComponentService } from './assessment-sub-component.service';
import { AssessmentMeasurementScaleService } from './assessment-measuremnt-scale.service';
import { AssessmentMeasurementScaleSubComponentService } from './assessment-measuremnt-scale-sub-component.service';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    private readonly dataSource: DataSource,
    private readonly assessmentDomainService: AssessmentDomainService,
    private readonly assessmentComponentService: AssessmentComponentService,
    private readonly assessmentSubComponentService: AssessmentSubComponentService,
    private readonly assessmentMeasurementScaleService: AssessmentMeasurementScaleService,
    private readonly assessmentMeasurementScaleSubComponentService: AssessmentMeasurementScaleSubComponentService,
  ) {}

  async findAll(
    query: FindAllAssessmentDto,
  ): Promise<FindAllResponseDto<Assessment>> {
    return await new QueryService<Assessment>(this.assessmentRepository)
      .join(query.include)
      .filter([], { fields: ['name'], value: query.search })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(id: string, query: FindOneAssessmentDto): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: query.include,
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found.`);
    }

    return assessment;
  }

  async create(payload: AssessmentCreateRequestDto): Promise<Assessment> {
    try {
      if (new Date(payload.endDate) < new Date(payload.startDate)) {
        throw new BadRequestException('End date cannot be before start date');
      }

      const savedAssessment = await this.dataSource.transaction(
        async (manager) => {
          const assessment = manager.create(Assessment, payload);
          await manager.insert(Assessment, assessment);
          const { templateDomainId } =
            await this.assessmentDomainService.create(manager, assessment.id);

          const { templateComponentId } =
            await this.assessmentComponentService.create(
              manager,
              assessment.id,
              templateDomainId,
            );

          const { templateSubComponentId } =
            await this.assessmentSubComponentService.create(
              manager,
              assessment.id,
              templateComponentId,
            );

          const { templateMeasurementScaleId } =
            await this.assessmentMeasurementScaleService.create(
              manager,
              assessment.id,
            );

          await this.assessmentMeasurementScaleSubComponentService.create(
            manager,
            templateSubComponentId,
            templateMeasurementScaleId,
          );

          return assessment;
        },
      );

      return savedAssessment;
    } catch (err) {
      this.logger.error(
        `Failed to create assessment: ${err.message}`,
        err.stack,
      );
      if (err.code === '23505') {
        throw new BadRequestException(
          'Assessment with this name already exists',
        );
      }
      throw new BadRequestException(
        `Failed to create assessment: ${err.message}`,
      );
    }
  }

  async update(
    id: string,
    payload: AssessmentUpdateRequestDto,
  ): Promise<Assessment> {
    return this.dataSource.transaction(async (manager) => {
      const assessment = await manager.getRepository(Assessment).findOne({
        where: { id },
        relations: ['user', 'country'],
      });

      if (!assessment) {
        throw new NotFoundException(`Assessment ${id} not found.`);
      }

      return await manager.getRepository(Assessment).save(assessment);
    });
  }

  async delete(id: string): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found.`);
    }

    return await this.assessmentRepository.softRemove(assessment);
  }

  async restore(id: string): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found.`);
    }

    return await this.assessmentRepository.recover(assessment);
  }
}
