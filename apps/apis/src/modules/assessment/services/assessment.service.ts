import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CrudService } from '../../../shared/services';
import { Assessment, User, Country } from '../../../database/entities';
import { ASSESSMENT_FIELD_CONFIG } from '../config/assessment-field-config';
import { AssessmentCreateRequestDto } from '../dtos';
import { AssessmentDomainCopyService } from './assessment-domain-copy.service';

@Injectable()
export class AssessmentService extends CrudService<Assessment> {
  private readonly loggerService = new Logger(AssessmentService.name);
  protected includes = ASSESSMENT_FIELD_CONFIG.includeRelations;
  protected selectable = ASSESSMENT_FIELD_CONFIG.selectableFields;
  protected searchable = ASSESSMENT_FIELD_CONFIG.searchableFields;
  protected filterable = ASSESSMENT_FIELD_CONFIG.filterableFields;
  protected sortable = ASSESSMENT_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly assessmentDomainCopyService: AssessmentDomainCopyService,
    private readonly dataSource: DataSource,
  ) {
    super(assessmentRepository);
  }

  async create(payload: AssessmentCreateRequestDto): Promise<Assessment> {
    try {
      // Validate userId
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Validate countryCode
      const country = await this.countryRepository.findOne({
        where: { code: payload.countryCode },
      });
      if (!country) {
        throw new BadRequestException('Country not found');
      }

      // Create Assessment using transaction
      const savedAssessment = await this.dataSource.transaction(
        async (manager) => {
          // Create Assessment without domainId initially
          const assessment = new Assessment();
          assessment.userId = payload.userId;
          assessment.name = payload.name;
          assessment.description = payload.description;
          assessment.countryCode = payload.countryCode;
          assessment.date = new Date(payload.date);

          await manager.save(Assessment, assessment);

          // Copy Domain to AssessmentDomain and link it
          const assessmentDomain =
            await this.assessmentDomainCopyService.copyDomainToAssessmentDomain(
              payload.templateDomainId,
              assessment.id,
            );

          // Update Assessment with domainId
          assessment.domianId = assessmentDomain.id;
          await manager.save(Assessment, assessment);

          return assessment;
        },
      );

      this.loggerService.log(
        `Assessment created successfully: ${savedAssessment.id}`,
      );

      // Return the full assessment with relations
      const fullAssessment = await this.assessmentRepository.findOne({
        where: { id: savedAssessment.id },
        relations: this.includes,
      });

      if (!fullAssessment) {
        throw new BadRequestException('Failed to retrieve created assessment');
      }

      return fullAssessment;
    } catch (err) {
      this.loggerService.error('Failed to create assessment', err.stack || err);
      throw new BadRequestException(
        'Failed to create assessment: ' + (err.message || err),
      );
    }
  }
}
