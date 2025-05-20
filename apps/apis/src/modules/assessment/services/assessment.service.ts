import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CrudService } from '../../../shared/services';
import {
  User,
  Country,
  Assessment,
  Domain,
  Component,
  SubComponent,
  AssessmentDomain,
  AssessmentComponent,
  AssessmentSubComponent,
} from '../../../database/entities';
import { ASSESSMENT_FIELD_CONFIG } from '../config/assessment-field-config';
import { AssessmentCreateRequestDto } from '../dtos';

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
    private readonly dataSource: DataSource,
  ) {
    super(assessmentRepository);
  }

  async create(payload: AssessmentCreateRequestDto): Promise<Assessment> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // const country = await this.countryRepository.findOne({
      //   where: { code: payload.countryCode },
      // });
      // if (!country) {
      //   throw new BadRequestException('Country not found');
      // }

      const savedAssessment = await this.dataSource.transaction(
        async (manager) => {
          const assessment = manager.create(Assessment, {
            userId: payload.userId,
            name: payload.name,
            description: payload.description,
            countryCode: payload.countryCode,
            date: payload.date,
          });

          await manager.insert(Assessment, assessment);

          const domains = await manager.find(Domain, {
            where: { isActive: true },
            select: { code: true, name: true, description: true },
          });

          const assessmentDomains = domains.map(({ code, name, description }) =>
            manager.create(AssessmentDomain, {
              code,
              name,
              description,
              assessmentId: assessment.id,
              translations: {
                code: { en: code },
                name: { en: name },
                description: { en: description },
              },
            }),
          );
          await manager.insert(AssessmentDomain, assessmentDomains);

          const components = await manager.find(Component, {
            where: { isActive: true },
            select: { code: true, name: true, description: true },
          });

          const assessmentComponents = components.map(
            ({ code, name, description }) =>
              manager.create(AssessmentComponent, {
                code,
                name,
                description,
                assessmentId: assessment.id,
                translations: {
                  code: { en: code },
                  name: { en: name },
                  description: { en: description },
                },
              }),
          );

          await manager.insert(AssessmentComponent, assessmentComponents);

          const subComponents = await manager.find(SubComponent, {
            where: { isActive: true },
            select: { code: true, name: true, description: true },
            relations: { measurementScales: { measurementScale: true } },
          });

          const assessmentSubComponents = subComponents.map(
            ({ code, name, description }) =>
              manager.create(AssessmentSubComponent, {
                code,
                name,
                description,
                assessmentId: assessment.id,
                translations: {
                  code: { en: code },
                  name: { en: name },
                  description: { en: description },
                },
              }),
          );

          await manager.insert(AssessmentSubComponent, assessmentSubComponents);

          return assessment;
        },
      );

      this.loggerService.log(
        `Assessment created successfully: ${savedAssessment.id}`,
      );

      // Fetch full assessment with relations
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
      if (err.code === '23505') {
        throw new BadRequestException(
          'Assessment with this name already exists',
        );
      }
      throw new BadRequestException(
        'Failed to create assessment: ' + (err.message || err),
      );
    }
  }
}
