import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CrudService } from '../../../shared/services';
import { Assessment, User, Country } from '../../../database/entities';
import { ASSESSMENT_FIELD_CONFIG } from '../config/assessment-field-config';
import { AssessmentCreateRequestDto } from '../dtos';
import { AssessmentDomainService } from './assessment-domain.service';
import { AssessmentComponentService } from './assessment-component.service';
import { AssessmentSubComponentService } from './assessment-sub-component.service';
import { AssessmentMeasurementScaleService } from './assessment-measuremnt-scale.service';
import { AssessmentMeasurementScaleSubComponentService } from './assessment-measuremnt-scale-sub-component.service';
import { AssessmentUtilityService } from '../utils';

@Injectable()
export class AssessmentService extends CrudService<Assessment> {
  private readonly loggerService = new Logger(AssessmentService.name);
  protected selectable = ASSESSMENT_FIELD_CONFIG.selectableFields;
  protected searchable = ASSESSMENT_FIELD_CONFIG.searchableFields;
  protected filterable = ASSESSMENT_FIELD_CONFIG.filterableFields;
  protected sortable = ASSESSMENT_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    private readonly dataSource: DataSource,
    private readonly assessmentUtilityService: AssessmentUtilityService,
    private readonly assessmentDomainService: AssessmentDomainService,
    private readonly assessmentComponentService: AssessmentComponentService,
    private readonly assessmentSubComponentService: AssessmentSubComponentService,
    private readonly assessmentMeasurementScaleService: AssessmentMeasurementScaleService,
    private readonly assessmentMeasurementScaleSubComponentService: AssessmentMeasurementScaleSubComponentService,
  ) {
    super(assessmentRepository);
  }

  async create(payload: AssessmentCreateRequestDto): Promise<Assessment> {
    try {
      await this.assessmentUtilityService.validateUser(payload.userId);
      await this.assessmentUtilityService.validateCountry(payload.countryCode);
      await this.assessmentUtilityService.validateLanguages(payload.languages);

      if (new Date(payload.endDate) < new Date(payload.startDate)) {
        throw new BadRequestException('End date cannot be before start date');
      }

      const savedAssessment = await this.dataSource.transaction(
        async (manager) => {
          const assessment = manager.create(Assessment, payload);
          await manager.insert(Assessment, assessment);
          const { domains, templateDomainId } =
            await this.assessmentDomainService.create(manager, assessment.id);

          const { components, templateComponentId } =
            await this.assessmentComponentService.create(
              manager,
              assessment.id,
              templateDomainId,
            );

          const { subComponents, templateSubComponentId } =
            await this.assessmentSubComponentService.create(
              manager,
              assessment.id,
              templateComponentId,
            );

          const { measurementScales, templateMeasurementScaleId } =
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

      const fullAssessment = await this.assessmentRepository.findOne({
        where: { id: savedAssessment.id },
        relations: { country: true, user: true },
      });

      if (!fullAssessment) {
        throw new BadRequestException('Failed to retrieve created assessment');
      }

      this.loggerService.log(
        `Successfully created assessment with ID: ${fullAssessment.id}`,
      );
      return fullAssessment;
    } catch (err) {
      this.loggerService.error(
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
}