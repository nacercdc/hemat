import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../../../database/entities/domain.entity';
import { Assessment } from '../../../database/entities/assessment.entity';
import { AssessmentStatus } from '../../../shared/enums/assesement.enum';

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
} 