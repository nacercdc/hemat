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
  MeasurementScale,
  AssessmentMeasurementScale,
  AssessmentMeasurementScaleSubComponent,
} from '../../../database/entities';
import { ASSESSMENT_FIELD_CONFIG } from '../config/assessment-field-config';
import { AssessmentCreateRequestDto } from '../dtos';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(MeasurementScale)
    private readonly measurementScaleRepository: Repository<MeasurementScale>,
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

      const country = await this.countryRepository.findOne({
        where: { code: payload.countryCode },
      });
      if (!country) {
        throw new BadRequestException('Country not found');
      }

      const savedAssessment = await this.dataSource.transaction(
        async (manager) => {
          // Create Assessment
          const assessment = manager.create(Assessment, {
            userId: payload.userId,
            name: payload.name,
            description: payload.description,
            countryCode: payload.countryCode,
            date: payload.date,
          });

          await manager.insert(Assessment, assessment);

          // Create AssessmentDomains
          const domains = await manager.find(Domain, {
            where: { isActive: true },
            select: { id: true, code: true, name: true, description: true },
          });

          const assessmentDomains: AssessmentDomain[] = [];
          const templateDomainId: Record<string, string> = {};
          domains.forEach(({ id, code, name, description }) => {
            const domain = manager.create(AssessmentDomain, {
              code,
              name,
              description,
              assessmentId: assessment.id,
              translations: {
                code: { en: code },
                name: { en: name },
                description: { en: description },
              },
            });
            assessmentDomains.push(domain);
          });

          const insertedDomains = await manager.insert(
            AssessmentDomain,
            assessmentDomains,
          );
          insertedDomains.generatedMaps.forEach((generated, index) => {
            templateDomainId[domains[index].id] = generated.id as string;
          });

          Logger.debug('templateDomainId', templateDomainId);

          // Create AssessmentComponents
          const components = await manager.find(Component, {
            where: { isActive: true },
            select: {
              id: true,
              code: true,
              name: true,
              description: true,
              domainId: true,
            },
          });

          const assessmentComponents: AssessmentComponent[] = [];
          const templateComponentId: Record<string, string> = {};
          components.forEach(({ id, code, name, description, domainId }) => {
            const parentId = templateDomainId[domainId] ?? null;

            if (parentId) {
              const component = manager.create(AssessmentComponent, {
                code,
                name,
                description,
                assessmentId: assessment.id,
                domainId: parentId,
                translations: {
                  code: { en: code },
                  name: { en: name },
                  description: { en: description },
                },
              });
              assessmentComponents.push(component);
            }
          });

          const insertedComponents = await manager.insert(
            AssessmentComponent,
            assessmentComponents,
          );
          insertedComponents.generatedMaps.forEach((generated, index) => {
            templateComponentId[components[index].id] = generated.id as string;
          });

          Logger.debug('templateComponentId', templateComponentId);

          // Create AssessmentSubComponents
          const subComponents = await manager.find(SubComponent, {
            where: { isActive: true },
            select: {
              id: true,
              code: true,
              name: true,
              description: true,
              componentId: true,
            },
            relations: { measurementScales: { measurementScale: true } },
          });

          const assessmentSubComponents: AssessmentSubComponent[] = [];
          const templateSubComponentId: Record<string, string> = {};
          subComponents.forEach(
            ({ id, code, name, description, componentId }) => {
              const parentId = templateComponentId[componentId] ?? null;

              if (parentId) {
                const subComponent = manager.create(AssessmentSubComponent, {
                  code,
                  name,
                  description,
                  assessmentId: assessment.id,
                  componentId: parentId,
                  translations: {
                    code: { en: code },
                    name: { en: name },
                    description: { en: description },
                  },
                });
                assessmentSubComponents.push(subComponent);
              }
            },
          );

          const insertedSubComponents = await manager.insert(
            AssessmentSubComponent,
            assessmentSubComponents,
          );
          insertedSubComponents.generatedMaps.forEach((generated, index) => {
            templateSubComponentId[subComponents[index].id] =
              generated.id as string;
          });

          Logger.debug('templateSubComponentId', templateSubComponentId);

          // Create AssessmentMeasurementScales
          const measurementScales = await manager.find(MeasurementScale, {
            select: {
              id: true,
              name: true,
              description: true,
              color: true,
              rate: true,
            },
          });

          const assessmentMeasurementScales: AssessmentMeasurementScale[] = [];
          const templateMeasurementScaleId: Record<string, string> = {};
          measurementScales.forEach(
            ({ id, name, description, color, rate }) => {
              const measurementScale = manager.create(
                AssessmentMeasurementScale,
                {
                  name,
                  description,
                  color,
                  rate,
                  assessmentId: assessment.id,
                  translations: {
                    name: { en: name },
                    description: { en: description },
                  },
                },
              );
              assessmentMeasurementScales.push(measurementScale);
            },
          );

          const insertedMeasurementScales = await manager.insert(
            AssessmentMeasurementScale,
            assessmentMeasurementScales,
          );
          insertedMeasurementScales.generatedMaps.forEach(
            (generated, index) => {
              templateMeasurementScaleId[measurementScales[index].id] =
                generated.id as string;
            },
          );

          Logger.debug(
            'templateMeasurementScaleId',
            templateMeasurementScaleId,
          );

          // Create AssessmentMeasurementScaleSubComponents
          const measurementScaleSubComponents: AssessmentMeasurementScaleSubComponent[] =
            [];
          subComponents.forEach(
            ({ id: subComponentId, measurementScales: ms }) => {
              const assessmentSubComponentId =
                templateSubComponentId[subComponentId];
              if (assessmentSubComponentId && ms?.length) {
                ms.forEach(({ measurementScale }) => {
                  const assessmentMeasurementScaleId =
                    templateMeasurementScaleId[measurementScale.id];
                  if (assessmentMeasurementScaleId) {
                    const measurementScaleSubComponent = manager.create(
                      AssessmentMeasurementScaleSubComponent,
                      {
                        subComponentId: assessmentSubComponentId,
                        measurementScaleId: assessmentMeasurementScaleId,
                        description: `Measurement scale for ${measurementScale.name}`,
                        translations: {
                          description: {
                            en: `Measurement scale for ${measurementScale.name}`,
                          },
                        },
                      },
                    );
                    measurementScaleSubComponents.push(
                      measurementScaleSubComponent,
                    );
                  }
                });
              }
            },
          );

          await manager.insert(
            AssessmentMeasurementScaleSubComponent,
            measurementScaleSubComponents,
          );

          return assessment;
        },
      );

      const fullAssessment = await this.assessmentRepository.findOne({
        where: { id: savedAssessment.id },
      });

      if (!fullAssessment) {
        throw new BadRequestException('Failed to retrieve created assessment');
      }

      return fullAssessment;
    } catch (err) {
      this.loggerService.error('Failed to create assessment', err.stack || err);
      Logger.error(err);
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