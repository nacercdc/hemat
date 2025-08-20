import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../../../database/entities/domain.entity';
import { Assessment } from '../../../database/entities/assessment.entity';
import { AssessmentStatus } from '../../../shared/enums/assesement.enum';
import { DashboardQueryDto } from '../dtos/dashboard-query.dto';
import { Country } from '../../../database/entities/country.entity';
import { Component, SubComponent } from '@database/entities';

interface SubComponentRate {
  id: string;
  name: string;
  description: string;
  averagePrimaryRate: number;
  averageRoadmapRate: number;
}

interface SubComponentAfricaRate {
  id: string;
  name: string;
  description: string;
  africaAveragePrimaryRate: number;
}

interface DomainRate {
  id: string;
  name: string;
  averagePrimaryRate: number;
  averageRoadmapRate: number;
}

interface DomainAfricaRate {
  id: string;
  name: string;
  africaAveragePrimaryRate: number;
  africaAverageRoadmapRate: number;
}
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
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

  async getActiveComponentsCount(): Promise<{ count: number }> {
    const count = await this.componentRepository.count({
      where: { isActive: true },
    });
    return { count };
  }

  async getActiveSubComponentsCount(): Promise<{ count: number }> {
    const count = await this.subComponentRepository.count({
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
    const currentYear = new Date().getFullYear();
    const years = query.years || (query.year ? [query.year] : [currentYear]);

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
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    return qb
      .select('templateDomain.id', 'id')
      .addSelect('templateDomain.name', 'name')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateDomain.id')
      .addGroupBy('templateDomain.name')
      .execute();
  }

  async getAverageComponentRatesByTemplateDomain(
    templateDomainId: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const years = query.years || (query.year ? [query.year] : [currentYear]);

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
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    return qb
      .select('templateComponent.id', 'id')
      .addSelect('templateComponent.name', 'name')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.componentId = assessmentComponent.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateComponent.id')
      .addGroupBy('templateComponent.name')
      .execute();
  }

  async getAverageSubComponentRatesByTemplateComponent(
    templateComponentId: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const years = query.years || (query.year ? [query.year] : [currentYear]);

    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.components', 'assessmentComponent')
      .leftJoin('assessmentComponent.templateComponent', 'templateComponent')
      .leftJoin('assessmentComponent.subComponents', 'subComponent')
      .leftJoin('subComponent.templateSubComponent', 'templateSubComponent')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('templateComponent.deletedAt IS NULL')
      .andWhere('subComponent.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('answers.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('templateComponent.id = :templateComponentId', {
        templateComponentId,
      })
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    return qb
      .select('templateSubComponent.id', 'id')
      .addSelect('templateSubComponent.name', 'name')
      .addSelect('templateSubComponent.description', 'description')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.subComponentId = subComponent.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateSubComponent.id')
      .addGroupBy('templateSubComponent.name')
      .addGroupBy('templateSubComponent.description')
      .execute();
  }

  async getAverageDomainRatesByTemplateForCountry(
    countryCode: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const years = query.years || (query.year ? [query.year] : [currentYear]);

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
      .andWhere('assessment.countryCode = :countryCode', { countryCode })
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    return qb
      .select('templateDomain.id', 'id')
      .addSelect('templateDomain.name', 'name')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateDomain.id')
      .addGroupBy('templateDomain.name')
      .execute();
  }

  async getAverageComponentRatesByTemplateDomainForCountry(
    templateDomainId: string,
    countryCode: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const years = query.years || (query.year ? [query.year] : [currentYear]);

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
      .andWhere('assessment.countryCode = :countryCode', { countryCode })
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    return qb
      .select('templateComponent.id', 'id')
      .addSelect('templateComponent.name', 'name')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.componentId = assessmentComponent.id THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRate',
      )
      .groupBy('templateComponent.id')
      .addGroupBy('templateComponent.name')
      .execute();
  }

  async getAverageSubComponentRatesByTemplateComponentForCountry(
    templateComponentId: string,
    countryCode: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const years = query.years || (query.year ? [query.year] : [currentYear]);

    let qb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.components', 'assessmentComponent')
      .leftJoin('assessmentComponent.templateComponent', 'templateComponent')
      .leftJoin('assessmentComponent.subComponents', 'subComponent')
      .leftJoin('subComponent.templateSubComponent', 'templateSubComponent')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('templateComponent.deletedAt IS NULL')
      .andWhere('subComponent.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('templateComponent.id = :templateComponentId', {
        templateComponentId,
      })
      .andWhere('assessment.countryCode = :countryCode', { countryCode })
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    const countryResults: SubComponentRate[] = await qb
      .select('templateSubComponent.id', 'id')
      .addSelect('templateSubComponent.name', 'name')
      .addSelect('templateSubComponent.description', 'description')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.subComponentId = subComponent.id AND answers.isPrimary = true THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averagePrimaryRate',
      )
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.subComponentId = subComponent.id AND answers.isPrimary = false THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRoadmapRate',
      )
      .groupBy('templateSubComponent.id')
      .addGroupBy('templateSubComponent.name')
      .addGroupBy('templateSubComponent.description')
      .execute();

    const africanSubregions = [
      'Eastern Africa',
      'Western Africa',
      'Middle Africa',
      'Northern Africa',
      'Southern Africa',
    ];
    let africaQb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.country', 'country')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.components', 'assessmentComponent')
      .leftJoin('assessmentComponent.templateComponent', 'templateComponent')
      .leftJoin('assessmentComponent.subComponents', 'subComponent')
      .leftJoin('subComponent.templateSubComponent', 'templateSubComponent')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('assessmentComponent.deletedAt IS NULL')
      .andWhere('templateComponent.deletedAt IS NULL')
      .andWhere('subComponent.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('templateComponent.id = :templateComponentId', {
        templateComponentId,
      })
      .andWhere('country.subregion IN (:...africanSubregions)', {
        africanSubregions,
      })
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    console.log('Applied year filter for Africa:', years);

    const africaResults: SubComponentAfricaRate[] = await africaQb
      .select('templateSubComponent.id', 'id')
      .addSelect('templateSubComponent.name', 'name')
      .addSelect('templateSubComponent.description', 'description')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.subComponentId = subComponent.id AND answers.isPrimary = true THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'africaAveragePrimaryRate',
      )
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.subComponentId = subComponent.id AND answers.isPrimary = false THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'africaAverageRoadmapRate',
      )
      .groupBy('templateSubComponent.id')
      .addGroupBy('templateSubComponent.name')
      .addGroupBy('templateSubComponent.description')
      .execute();

    const merged = countryResults.map((countryItem: SubComponentRate) => {
      const africaItem = africaResults.find(
        (a: SubComponentAfricaRate) => a.id === countryItem.id,
      ) || {
        africaAveragePrimaryRate: 0,
        africaAverageRoadmapRate: 0,
      };
      return {
        id: countryItem.id,
        name: countryItem.name,
        description: countryItem.description,
        averagePrimaryRate: countryItem.averagePrimaryRate,
        averageRoadmapRate: countryItem.averageRoadmapRate,
        africaAveragePrimaryRate: africaItem.africaAveragePrimaryRate || 0,
      };
    });

    return merged;
  }

  async getCountriesWithSubregionAndAssessmentStatus(query?: {
    subregion?: string;
    assessmentStatus?: AssessmentStatus;
    countryCode?: string;
  }): Promise<any[]> {
    // Get all countries
    let countriesQuery = this.domainRepository.manager
      .getRepository(Country)
      .createQueryBuilder('country');

    // Apply filters
    if (query?.subregion) {
      countriesQuery = countriesQuery.andWhere(
        'country.subregion = :subregion',
        { subregion: query.subregion },
      );
    }
    if (query?.countryCode) {
      countriesQuery = countriesQuery.andWhere('country.code = :countryCode', {
        countryCode: query.countryCode,
      });
    }

    const countries = await countriesQuery.getMany();

    // For each country, get the latest assessment status (if any)
    let assessmentsQuery = this.assessmentRepository
      .createQueryBuilder('assessment')
      .select([
        'assessment.countryCode',
        'assessment.status',
        'assessment.createdAt',
      ])
      .orderBy('assessment.createdAt', 'DESC');

    if (query?.assessmentStatus) {
      assessmentsQuery = assessmentsQuery.andWhere(
        'assessment.status = :status',
        { status: query.assessmentStatus },
      );
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

  async getAverageDomainRatesForAllCountries(
    query: DashboardQueryDto & { domainId?: string; countryCode?: string },
  ): Promise<any[]> {
    const currentYear = new Date().getFullYear(); // 2025
    const years = query.years || (query.year ? [query.year] : [currentYear]);

    let qb = this.countryRepository
      .createQueryBuilder('country')
      .leftJoin(
        'assessments',
        'assessments',
        'assessments.countryCode = country.code AND assessments.deletedAt IS NULL AND EXTRACT(YEAR FROM assessments.startDate) IN (:...years)',
        { years },
      )
      .leftJoin(
        'assessments.domains',
        'assessmentDomains',
        'assessmentDomains.deletedAt IS NULL',
      )
      .leftJoin(
        'assessmentDomains.templateDomain',
        'templateDomain',
        'templateDomain.deletedAt IS NULL',
      )
      .leftJoin(
        'assessments.answers',
        'answers',
        'answers.deletedAt IS NULL AND answers.isPrimary = :isPrimary',
        { isPrimary: true },
      )
      .leftJoin(
        'answers.assessmentSubComponentAnswers',
        'subComponentAnswers',
        'subComponentAnswers.deletedAt IS NULL',
      )
      .leftJoin(
        'subComponentAnswers.measurementScale',
        'measurementScale',
        'measurementScale.deletedAt IS NULL',
      );

    if (query.countryCode) {
      qb = qb.andWhere('country.code = :countryCode', {
        countryCode: query.countryCode,
      });
    }

    return qb
      .select('country.code', 'countryCode')
      .addSelect(
        query.domainId
          ? 'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.domainId = :domainId THEN measurementScale.rate END))::int, 0)'
          : 'COALESCE(ROUND(AVG(measurementScale.rate))::int, 0)',
        'averageRate',
      )
      .setParameter('domainId', query.domainId)
      .groupBy('country.code')
      .orderBy('country.code', 'ASC')
      .execute();
  }
  async getAverageDomainRatesByTemplateForCountryAndAfrica(
    countryCode: string,
    query: DashboardQueryDto,
  ): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const years = query.years || (query.year ? [query.year] : [currentYear]);

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
      .andWhere('templateDomain.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('assessment.countryCode = :countryCode', { countryCode })
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    const countryResults: DomainRate[] = await qb
      .select('templateDomain.id', 'id')
      .addSelect('templateDomain.name', 'name')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id AND answers.isPrimary = true THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averagePrimaryRate',
      )
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id AND answers.isPrimary = false THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'averageRoadmapRate',
      )
      .groupBy('templateDomain.id')
      .addGroupBy('templateDomain.name')
      .execute();

    const africanSubregions = [
      'Eastern Africa',
      'Western Africa',
      'Middle Africa',
      'Northern Africa',
      'Southern Africa',
    ];
    let africaQb = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoin('assessment.country', 'country')
      .leftJoin('assessment.domains', 'assessmentDomains')
      .leftJoin('assessmentDomains.templateDomain', 'templateDomain')
      .leftJoin('assessment.answers', 'answers')
      .leftJoin('answers.assessmentSubComponentAnswers', 'subComponentAnswers')
      .leftJoin('subComponentAnswers.measurementScale', 'measurementScale')
      .where('assessment.deletedAt IS NULL')
      .andWhere('assessmentDomains.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .andWhere('templateDomain.deletedAt IS NULL')
      .andWhere('subComponentAnswers.deletedAt IS NULL')
      .andWhere('measurementScale.deletedAt IS NULL')
      .andWhere('country.subregion IN (:...africanSubregions)', {
        africanSubregions,
      })
      .andWhere('EXTRACT(YEAR FROM assessment.startDate) IN (:...years)', {
        years,
      });

    const africaResults: DomainAfricaRate[] = await africaQb
      .select('templateDomain.id', 'id')
      .addSelect('templateDomain.name', 'name')
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id AND answers.isPrimary = true THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'africaAveragePrimaryRate',
      )
      .addSelect(
        'COALESCE(ROUND(AVG(CASE WHEN subComponentAnswers.domainId = assessmentDomains.id AND answers.isPrimary = false THEN measurementScale.rate ELSE NULL END))::int, 0)',
        'africaAverageRoadmapRate',
      )
      .groupBy('templateDomain.id')
      .addGroupBy('templateDomain.name')
      .execute();

    const merged = countryResults.map((countryItem: DomainRate) => {
      const africaItem = africaResults.find(
        (a: DomainAfricaRate) => a.id === countryItem.id,
      ) || {
        id: countryItem.id,
        name: countryItem.name,
        africaAveragePrimaryRate: 0,
        africaAverageRoadmapRate: 0,
      };
      return {
        id: countryItem.id,
        name: countryItem.name,
        averagePrimaryRate: countryItem.averagePrimaryRate,
        averageRoadmapRate: countryItem.averageRoadmapRate,
        africaAveragePrimaryRate: africaItem.africaAveragePrimaryRate || 0,
        africaAverageRoadmapRate: africaItem.africaAverageRoadmapRate || 0,
      };
    });

    const africaOnlyDomains = africaResults
      .filter(
        (africaItem) =>
          !countryResults.some(
            (countryItem) => countryItem.id === africaItem.id,
          ),
      )
      .map((africaItem) => ({
        id: africaItem.id,
        name: africaItem.name,
        averagePrimaryRate: 0,
        averageRoadmapRate: 0,
        africaAveragePrimaryRate: africaItem.africaAveragePrimaryRate || 0,
        africaAverageRoadmapRate: africaItem.africaAverageRoadmapRate || 0,
      }));

    return [...merged, ...africaOnlyDomains];
  }
}