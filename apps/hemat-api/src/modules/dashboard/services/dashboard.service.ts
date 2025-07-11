import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../../../database/entities/domain.entity';
import { Assessment } from '../../../database/entities/assessment.entity';
import { AssessmentStatus } from '../../../shared/enums/assesement.enum';
import { AssessmentDomain } from '../../../database/entities/assessment-domain.entity';
import { AssessmentSubComponentAnswer } from '../../../database/entities/assessment-sub-component-answer.entity';
import { AssessmentMeasurementScale } from '../../../database/entities/assessment-measurement-scale.entity';
import { EntityManager } from 'typeorm';
import { AssessmentComponent } from '../../../database/entities/assessment-component.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    private readonly entityManager: EntityManager, // Inject EntityManager
  ) {}

  async getActiveCountriesCount(): Promise<{ count: number }> {
    const usedCountries = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .select('assessment.countryCode')
      .groupBy('assessment.countryCode')
      .getRawMany();
    return { count: usedCountries.length };
  }

  async getActiveDomainsCount(): Promise<{ count: number }> {
    const count = await this.domainRepository.count({ where: { isActive: true } });
    return { count };
  }

  async getCompletedAssessmentCountriesCount(): Promise<{ count: number }> {
    const completedAssessments = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .select('assessment.countryCode')
      .where('assessment.status = :status', { status: AssessmentStatus.COMPLETED })
      .groupBy('assessment.countryCode')
      .getRawMany();
    return { count: completedAssessments.length };
  }

  /**
   * Get the average measurement scale rate for each template domain across all assessments.
   * Returns: [{ templateDomainId, templateDomainName, assessmentDomainCount, averageRate }]
   */
  async getAverageDomainRatesByTemplate(): Promise<any[]> {
    // Step 1: Get all template domain IDs and names
    const templateDomains = await this.entityManager
      .createQueryBuilder(AssessmentDomain, 'assessmentDomain')
      .select('assessmentDomain.templateDomainId', 'templateDomainId')
      .addSelect('MIN(assessmentDomain.name)', 'templateDomainName')
      .addSelect('COUNT(DISTINCT assessmentDomain.id)', 'assessmentDomainCount')
      .where('assessmentDomain.templateDomainId IS NOT NULL')
      .andWhere('assessmentDomain.deletedAt IS NULL')
      .groupBy('assessmentDomain.templateDomainId')
      .getRawMany();

    // Step 2: For each template domain, calculate the average measurement scale rate
    const results = [];
    for (const templateDomain of templateDomains) {
      // Find all assessment domains for this template domain
      const assessmentDomains = await this.entityManager
        .createQueryBuilder(AssessmentDomain, 'assessmentDomain')
        .select('assessmentDomain.id', 'assessmentDomainId')
        .where('assessmentDomain.templateDomainId = :templateDomainId', { templateDomainId: templateDomain.templateDomainId })
        .andWhere('assessmentDomain.deletedAt IS NULL')
        .getRawMany();
      const assessmentDomainIds = assessmentDomains.map((d) => d.assessmentDomainId);
      if (assessmentDomainIds.length === 0) {
        results.push({ ...templateDomain, averageRate: null, subComponentCount: 0, answerCount: 0, rateCount: 0 });
        continue;
      }
      // Find all subcomponents for these assessment domains
      const subComponentIds = await this.entityManager
        .createQueryBuilder(AssessmentComponent, 'component')
        .leftJoin('component.subComponents', 'subComponent', 'subComponent.deletedAt IS NULL')
        .select('subComponent.id', 'subComponentId')
        .where('component.domainId IN (:...assessmentDomainIds)', { assessmentDomainIds })
        .andWhere('component.deletedAt IS NULL')
        .getRawMany();
      const subComponentIdList = subComponentIds.map((s) => s.subComponentId).filter(Boolean);
      if (subComponentIdList.length === 0) {
        results.push({ ...templateDomain, averageRate: null, subComponentCount: 0, answerCount: 0, rateCount: 0 });
        continue;
      }
      // Find all answers for these subcomponents (only isPrimary = true on answer table)
      const answerRates = await this.entityManager
        .createQueryBuilder('assessment_sub_component_answers', 'subComponentAnswer')
        .leftJoin('assessment_measurement_scale', 'scale', 'scale.id = subComponentAnswer.measurementScaleId AND scale.deletedAt IS NULL')
        .leftJoin('answers', 'ans', 'ans.id = subComponentAnswer.answerId AND ans.deletedAt IS NULL')
        .select(['subComponentAnswer.id AS answerId', 'scale.rate AS rate'])
        .where('subComponentAnswer.subComponentId IN (:...subComponentIdList)', { subComponentIdList })
        .andWhere('subComponentAnswer.deletedAt IS NULL')
        .andWhere('ans.isPrimary = true')
        .getRawMany();
      const rates = answerRates.map((a) => Number(a.rate)).filter((r) => !isNaN(r));
      const averageRate = rates.length > 0 ? rates.reduce((sum, r) => sum + r, 0) / rates.length : null;
      results.push({
        templateDomainId: templateDomain.templateDomainId,
        templateDomainName: templateDomain.templateDomainName,
        assessmentDomainCount: Number(templateDomain.assessmentDomainCount),
        subComponentCount: subComponentIdList.length,
        answerCount: answerRates.length,
        rateCount: rates.length,
        averageRate: averageRate !== null ? Number(averageRate.toFixed(2)) : null,
      });
    }
    return results;
  }

  /**
   * Get the average measurement scale rate for each template component under a template domain across all assessments.
   * Returns: [{ templateComponentId, templateComponentName, assessmentComponentCount, subComponentCount, answerCount, rateCount, averageRate }]
   */
  async getAverageComponentRatesByTemplateDomain(templateDomainId: string): Promise<any[]> {
    // Step 1: Get all template components for the given template domain
    const templateComponents = await this.entityManager
      .createQueryBuilder(AssessmentComponent, 'assessmentComponent')
      .select('assessmentComponent.templateComponentId', 'templateComponentId')
      .addSelect('MIN(assessmentComponent.name)', 'templateComponentName')
      .addSelect('COUNT(DISTINCT assessmentComponent.id)', 'assessmentComponentCount')
      .where('assessmentComponent.templateComponentId IS NOT NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('assessmentComponent.domainId IN ' +
        '(SELECT id FROM "assessment-domains" WHERE "templateDomainId" = :templateDomainId AND "deletedAt" IS NULL)',
        { templateDomainId })
      .groupBy('assessmentComponent.templateComponentId')
      .getRawMany();

    const results = [];
    for (const templateComponent of templateComponents) {
      // Find all assessment components for this template component
      const assessmentComponents = await this.entityManager
        .createQueryBuilder(AssessmentComponent, 'assessmentComponent')
        .select('assessmentComponent.id', 'assessmentComponentId')
        .where('assessmentComponent.templateComponentId = :templateComponentId', { templateComponentId: templateComponent.templateComponentId })
        .andWhere('assessmentComponent.deletedAt IS NULL')
        .getRawMany();
      const assessmentComponentIds = assessmentComponents.map((c) => c.assessmentComponentId);
      if (assessmentComponentIds.length === 0) {
        results.push({ ...templateComponent, averageRate: null, subComponentCount: 0, answerCount: 0, rateCount: 0 });
        continue;
      }
      // Find all subcomponents for these assessment components
      const subComponentIds = await this.entityManager
        .createQueryBuilder('assessment_sub_components', 'subComponent')
        .select('subComponent.id', 'subComponentId')
        .where('subComponent.componentId IN (:...assessmentComponentIds)', { assessmentComponentIds })
        .andWhere('subComponent.deletedAt IS NULL')
        .getRawMany();
      const subComponentIdList = subComponentIds.map((s) => s.subComponentId).filter(Boolean);
      if (subComponentIdList.length === 0) {
        results.push({ ...templateComponent, averageRate: null, subComponentCount: 0, answerCount: 0, rateCount: 0 });
        continue;
      }
      // Find all answers for these subcomponents (only isPrimary = true on answer table)
      const answerRates = await this.entityManager
        .createQueryBuilder('assessment_sub_component_answers', 'subComponentAnswer')
        .leftJoin('assessment_measurement_scale', 'scale', 'scale.id = subComponentAnswer.measurementScaleId AND scale.deletedAt IS NULL')
        .leftJoin('answers', 'ans', 'ans.id = subComponentAnswer.answerId AND ans.deletedAt IS NULL')
        .select(['subComponentAnswer.id AS answerId', 'scale.rate AS rate'])
        .where('subComponentAnswer.subComponentId IN (:...subComponentIdList)', { subComponentIdList })
        .andWhere('subComponentAnswer.deletedAt IS NULL')
        .andWhere('ans.isPrimary = true')
        .getRawMany();
      const rates = answerRates.map((a) => Number(a.rate)).filter((r) => !isNaN(r));
      const averageRate = rates.length > 0 ? rates.reduce((sum, r) => sum + r, 0) / rates.length : null;
      results.push({
        templateComponentId: templateComponent.templateComponentId,
        templateComponentName: templateComponent.templateComponentName,
        assessmentComponentCount: Number(templateComponent.assessmentComponentCount),
        subComponentCount: subComponentIdList.length,
        answerCount: answerRates.length,
        rateCount: rates.length,
        averageRate: averageRate !== null ? Number(averageRate.toFixed(2)) : null,
      });
    }
    return results;
  }

  /**
   * Get the average measurement scale rate for each template subcomponent under a template component across all assessments.
   * Returns: [{ templateSubComponentId, templateSubComponentName, templateSubComponentDescription, assessmentSubComponentCount, measurementScales, answerCount, rateCount, averageRate }]
   */
  async getAverageSubComponentRatesByTemplateComponent(templateComponentId: string): Promise<any[]> {
    // Step 1: Get all template subcomponents for the given template component
    const templateSubComponents = await this.entityManager
      .createQueryBuilder('assessment_sub_components', 'subComponent')
      .select('subComponent.templateSubComponentId', 'templateSubComponentId')
      .addSelect('MIN(subComponent.name)', 'templateSubComponentName')
      .addSelect('MIN(subComponent.description)', 'templateSubComponentDescription')
      .addSelect('COUNT(DISTINCT subComponent.id)', 'assessmentSubComponentCount')
      .where('subComponent.templateSubComponentId IS NOT NULL')
      .andWhere('subComponent.deletedAt IS NULL')
      .andWhere('subComponent.componentId IN ' +
        '(SELECT id FROM "assessment-components" WHERE "templateComponentId" = :templateComponentId AND "deletedAt" IS NULL)',
        { templateComponentId })
      .groupBy('subComponent.templateSubComponentId')
      .getRawMany();

    const results = [];
    for (const templateSubComponent of templateSubComponents) {
      // Find all assessment subcomponents for this template subcomponent
      const assessmentSubComponents = await this.entityManager
        .createQueryBuilder('assessment_sub_components', 'subComponent')
        .select('subComponent.id', 'assessmentSubComponentId')
        .where('subComponent.templateSubComponentId = :templateSubComponentId', { templateSubComponentId: templateSubComponent.templateSubComponentId })
        .andWhere('subComponent.deletedAt IS NULL')
        .getRawMany();
      const assessmentSubComponentIds = assessmentSubComponents.map((s) => s.assessmentSubComponentId);
      if (assessmentSubComponentIds.length === 0) {
        results.push({ ...templateSubComponent, averageRate: null, measurementScales: [], answerCount: 0, rateCount: 0 });
        continue;
      }
      // Get measurement scales for this template subcomponent (from the first assessment subcomponent found)
      let measurementScales = [];
      if (assessmentSubComponentIds.length > 0) {
        measurementScales = await this.entityManager
          .createQueryBuilder('assessment_measurement_scale_sub_components', 'msSub')
          .leftJoin('assessment_measurement_scale', 'ms', 'ms.id = msSub.measurementScaleId AND ms.deletedAt IS NULL')
          .select(['ms.id AS id', 'ms.name AS name', 'ms.rate AS rate'])
          .where('msSub.subComponentId = :subComponentId', { subComponentId: assessmentSubComponentIds[0] })
          .andWhere('msSub.deletedAt IS NULL')
          .getRawMany();
      }
      // Find all answers for these subcomponents (only isPrimary = true on answer table)
      const answerRates = await this.entityManager
        .createQueryBuilder('assessment_sub_component_answers', 'subComponentAnswer')
        .leftJoin('assessment_measurement_scale', 'scale', 'scale.id = subComponentAnswer.measurementScaleId AND scale.deletedAt IS NULL')
        .leftJoin('answers', 'ans', 'ans.id = subComponentAnswer.answerId AND ans.deletedAt IS NULL')
        .select(['subComponentAnswer.id AS answerId', 'scale.rate AS rate'])
        .where('subComponentAnswer.subComponentId IN (:...assessmentSubComponentIds)', { assessmentSubComponentIds })
        .andWhere('subComponentAnswer.deletedAt IS NULL')
        .andWhere('ans.isPrimary = true')
        .getRawMany();
      const rates = answerRates.map((a) => Number(a.rate)).filter((r) => !isNaN(r));
      const averageRate = rates.length > 0 ? rates.reduce((sum, r) => sum + r, 0) / rates.length : null;
      results.push({
        templateSubComponentId: templateSubComponent.templateSubComponentId,
        templateSubComponentName: templateSubComponent.templateSubComponentName,
        templateSubComponentDescription: templateSubComponent.templateSubComponentDescription,
        assessmentSubComponentCount: Number(templateSubComponent.assessmentSubComponentCount),
        measurementScales,
        answerCount: answerRates.length,
        rateCount: rates.length,
        averageRate: averageRate !== null ? Number(averageRate.toFixed(2)) : null,
      });
    }
    return results;
  }
} 