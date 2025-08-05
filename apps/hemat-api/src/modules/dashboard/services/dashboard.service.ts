import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../../../database/entities/domain.entity';
import { Assessment } from '../../../database/entities/assessment.entity';
import { AssessmentStatus } from '../../../shared/enums/assesement.enum';
import { DashboardQueryDto } from '../dtos/dashboard-query.dto';
import { Country } from '../../../database/entities/country.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
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
    const count = await this.domainRepository.count({
      where: { isActive: true },
    });
    return { count };
  }

  async getCompletedAssessmentCountriesCount(): Promise<{ count: number }> {
    const completedAssessments = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .select('assessment.countryCode')
      .where('assessment.status = :status', {
        status: AssessmentStatus.COMPLETED,
      })
      .groupBy('assessment.countryCode')
      .getRawMany();
    return { count: completedAssessments.length };
  }

  async getAverageDomainRatesByTemplate(
    query: DashboardQueryDto,
  ): Promise<any[]> {
    // Handle both single year and multiple years
    const years = query.years || (query.year ? [query.year] : undefined);
    
    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.templateDomain', 'templateDomain')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('answers.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('templateDomain.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL');
    if (years && years.length > 0) {
      qb = qb.andWhere(
        'EXTRACT(YEAR FROM assessment.startDate) IN (:...years)',
        { years },
      );
      console.log('Applied year filter:', years);
    } else {
      console.log('No year filter applied');
    }
    return qb
      .select('templateDomain.id', 'id')
      .addSelect('templateDomain.name', 'name')
      .addSelect('subComponentAnswers.domainId', 'domainId')
      .addSelect(
        'COALESCE((AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateDomain.id')
      .addGroupBy('templateDomain.name')
      .addGroupBy('subComponentAnswers.domainId')
      .execute();
  }

  async getAverageComponentRatesByTemplateDomain(
    templateDomainId: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    // Handle both single year and multiple years
    const years = query.years || (query.year ? [query.year] : undefined);
    
    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.templateDomain', 'templateDomain')
      .leftJoin('assessmentDomains.components', 'assessmentComponent')
      .leftJoin('assessmentComponent.templateComponent', 'templateComponent')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('answers.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('templateDomain.deletedAt IS NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('templateComponent.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('templateDomain.id = :templateDomainId', { templateDomainId });
    if (years && years.length > 0) {
      qb = qb.andWhere(
        'EXTRACT(YEAR FROM assessment.startDate) IN (:...years)',
        { years },
      );
    }
    return qb
      .select('templateComponent.id', 'id')
      .addSelect('templateComponent.name', 'name')
      .addSelect('assessmentComponent.id', 'componentId')
      .addSelect(
        'COALESCE((AVG(CASE WHEN subComponentAnswers.componentId = assessmentComponent.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateComponent.id')
      .addGroupBy('templateComponent.name')
      .addGroupBy('assessmentComponent.id')
      .execute();
  }

  async getAverageSubComponentRatesByTemplateComponent(
    templateComponentId: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    // Handle both single year and multiple years
    const years = query.years || (query.year ? [query.year] : undefined);
    
    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.components', 'assessmentComponent')
      .leftJoin('assessmentComponent.subComponents', 'subComponent')
      .leftJoin('subComponent.templateSubComponent', 'templateSubComponent')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('subComponent.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('answers.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('assessmentComponent.id = :templateComponentId', {
        templateComponentId,
      });
    if (years && years.length > 0) {
      qb = qb.andWhere(
        'EXTRACT(YEAR FROM assessment.startDate) IN (:...years)',
        { years },
      );
    }
    return qb
      .select('COALESCE(templateSubComponent.id, subComponent.id)', 'id')
      .addSelect(
        'COALESCE(templateSubComponent.name, subComponent.name)',
        'name',
      )
      .addSelect(
        'COALESCE(templateSubComponent.description, subComponent.description)',
        'description',
      )
      .addSelect('subComponent.id', 'subComponentId')
      .addSelect(
        'COALESCE((AVG(CASE WHEN subComponentAnswers.subComponentId = subComponent.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateSubComponent.id')
      .addGroupBy('templateSubComponent.name')
      .addGroupBy('templateSubComponent.description')
      .addGroupBy('subComponent.id')
      .addGroupBy('subComponent.name')
      .addGroupBy('subComponent.description')
      .execute();
  }

  async getAverageDomainRatesByTemplateForCountry(
    countryCode: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    // Handle both single year and multiple years
    const years = query.years || (query.year ? [query.year] : undefined);
    
    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.templateDomain', 'templateDomain')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('answers.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('templateDomain.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('assessment.countryCode = :countryCode', { countryCode });
    if (years && years.length > 0) {
      qb = qb.andWhere(
        'EXTRACT(YEAR FROM assessment.startDate) IN (:...years)',
        { years },
      );
    }
    return qb
      .select('templateDomain.id', 'id')
      .addSelect('templateDomain.name', 'name')
      .addSelect('subComponentAnswers.domainId', 'domainId')
      .addSelect(
        'COALESCE((AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateDomain.id')
      .addGroupBy('templateDomain.name')
      .addGroupBy('subComponentAnswers.domainId')
      .execute();
  }

  async getAverageComponentRatesByTemplateDomainForCountry(
    templateDomainId: string,
    countryCode: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    // Handle both single year and multiple years
    const years = query.years || (query.year ? [query.year] : undefined);
    
    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.templateDomain', 'templateDomain')
      .leftJoin('assessmentDomains.components', 'assessmentComponent')
      .leftJoin('assessmentComponent.templateComponent', 'templateComponent')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('answers.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('templateDomain.deletedAt IS NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('templateComponent.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('templateDomain.id = :templateDomainId', { templateDomainId })
      .andWhere('assessment.countryCode = :countryCode', { countryCode });
    if (years && years.length > 0) {
      qb = qb.andWhere(
        'EXTRACT(YEAR FROM assessment.startDate) IN (:...years)',
        { years },
      );
    }
    return qb
      .select('templateComponent.id', 'id')
      .addSelect('templateComponent.name', 'name')
      .addSelect('assessmentComponent.id', 'componentId')
      .addSelect(
        'COALESCE((AVG(CASE WHEN subComponentAnswers.componentId = assessmentComponent.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateComponent.id')
      .addGroupBy('templateComponent.name')
      .addGroupBy('assessmentComponent.id')
      .execute();
  }

  async getAverageSubComponentRatesByTemplateComponentForCountry(
    templateComponentId: string,
    countryCode: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    // Handle both single year and multiple years
    const years = query.years || (query.year ? [query.year] : undefined);
    
    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.components', 'assessmentComponent')
      .leftJoin('assessmentComponent.subComponents', 'subComponent')
      .leftJoin('subComponent.templateSubComponent', 'templateSubComponent')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('subComponent.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('answers.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('assessmentComponent.id = :templateComponentId', {
        templateComponentId,
      })
      .andWhere('assessment.countryCode = :countryCode', { countryCode });
    if (years && years.length > 0) {
      qb = qb.andWhere(
        'EXTRACT(YEAR FROM assessment.startDate) IN (:...years)',
        { years },
      );
    }
    return qb
      .select('COALESCE(templateSubComponent.id, subComponent.id)', 'id')
      .addSelect(
        'COALESCE(templateSubComponent.name, subComponent.name)',
        'name',
      )
      .addSelect(
        'COALESCE(templateSubComponent.description, subComponent.description)',
        'description',
      )
      .addSelect('subComponent.id', 'subComponentId')
      .addSelect(
        'COALESCE((AVG(CASE WHEN subComponentAnswers.subComponentId = subComponent.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateSubComponent.id')
      .addGroupBy('templateSubComponent.name')
      .addGroupBy('templateSubComponent.description')
      .addGroupBy('subComponent.id')
      .addGroupBy('subComponent.name')
      .addGroupBy('subComponent.description')
      .execute();
  }

  async getCountriesWithSubregionAndAssessmentStatus(
    query?: {
      subregion?: string;
      assessmentStatus?: AssessmentStatus;
      countryCode?: string;
    }
  ): Promise<any[]> {
    // Get all countries
    let countriesQuery = this.domainRepository.manager.getRepository(Country).createQueryBuilder('country');
    
    // Apply filters
    if (query?.subregion) {
      countriesQuery = countriesQuery.andWhere('country.subregion = :subregion', { subregion: query.subregion });
    }
    if (query?.countryCode) {
      countriesQuery = countriesQuery.andWhere('country.code = :countryCode', { countryCode: query.countryCode });
    }
    
    const countries = await countriesQuery.getMany();
    
    // For each country, get the latest assessment status (if any)
    let assessmentsQuery = this.assessmentRepository.createQueryBuilder('assessment')
      .select(['assessment.countryCode', 'assessment.status', 'assessment.createdAt'])
      .orderBy('assessment.createdAt', 'DESC');
    
    if (query?.assessmentStatus) {
      assessmentsQuery = assessmentsQuery.andWhere('assessment.status = :status', { status: query.assessmentStatus });
    }
    
    const assessments = await assessmentsQuery.getMany();
    
    // Map country code to latest assessment status
    const latestStatusMap = new Map<string, AssessmentStatus>();
    for (const assessment of assessments) {
      if (!latestStatusMap.has(assessment.countryCode)) {
        latestStatusMap.set(assessment.countryCode, assessment.status);
      }
    }
    
    return countries.map((country) => ({
      code: country.code,
      subregion: country.subregion,
      assessmentStatus: latestStatusMap.get(country.code) || null,
    }));
  }
} 