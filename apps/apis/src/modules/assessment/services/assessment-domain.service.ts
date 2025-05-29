import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentDomain } from '@africa-cdc/database/entities';
import { AssessmentDomainDto } from '../dtos';

@Injectable()
export class AssessmentDomainService {
  private readonly logger = new Logger(AssessmentDomainService.name);

  constructor(
    @InjectRepository(AssessmentDomain)
    private readonly assessmentDomainRepository: Repository<AssessmentDomain>,
  ) {}

  async findAll(assessmentId: string): Promise<AssessmentDomain[]> {
    return this.assessmentDomainRepository.find({
      where: { assessmentId },
    });
  }

  async findOne(assessmentId: string, id: string): Promise<AssessmentDomain> {
    const domain = await this.assessmentDomainRepository.findOne({
      where: { id, assessmentId },
    });
    if (!domain) {
      throw new NotFoundException('Assessment domain not found');
    }
    return domain;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentDomainDto,
  ): Promise<AssessmentDomain> {
    const domain = await this.findOne(assessmentId, id);
    try {
      const entity = {
        code: payload.code,
        name: payload.name,
        description: payload.description,
        translations: payload.translations,
      };
      await this.assessmentDomainRepository.update(
        { id, assessmentId },
        entity,
      );

      return { ...domain, ...entity };
    } catch (err) {
      this.logger.error(
        `Failed to update assessment domain: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment domain');
    }
  }
}
