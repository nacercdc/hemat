import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AssessmentDomain, Domain } from '@africa-cdc/database/entities';
import { AssessmentDomainDto } from '../dtos';
import { UUID } from '@africa-cdc/shared';

@Injectable()
export class AssessmentDomainService {
  private readonly loggerService = new Logger(AssessmentDomainService.name);

  constructor(
    @InjectRepository(AssessmentDomain)
    private readonly assessmentDomainRepository: Repository<AssessmentDomain>,
  ) {}

  async create(
    manager: EntityManager,
    assessmentId: string,
  ): Promise<{
    domains: AssessmentDomain[];
    templateDomainId: Record<string, string>;
  }> {
    const domains = await manager.find(Domain, {
      where: { isActive: true },
    });

    const assessmentDomains: AssessmentDomain[] = [];
    const templateDomainId: Record<string, string> = {};
    domains.forEach(({ id, code, name, description, translations }) => {
      const domain = manager.create(AssessmentDomain, {
        id: UUID.v4(),
        assessmentId,
        code,
        name,
        description,
        translations,
      });

      templateDomainId[id] = domain.id;
      assessmentDomains.push(domain);
    });

    this.loggerService.debug('templateDomainId', templateDomainId);
    await manager.insert(AssessmentDomain, assessmentDomains);

    return { domains: assessmentDomains, templateDomainId };
  }

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
      this.loggerService.error(
        `Failed to update assessment domain: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment domain');
    }
  }
}
