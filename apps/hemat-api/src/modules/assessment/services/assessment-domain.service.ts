import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, IsNull, In } from 'typeorm';
import {
  AssessmentComponent,
  AssessmentDomain,
  Domain,
  AssessmentMember,
  Answer,
  AssessmentSubComponent,
  AssessmentSubComponentAnswer,
  Assessment,
} from '@database/entities';
import { UUID } from '@shared/helpers';
import { Filter, QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import {
  AssessmentDomainDto,
  FindAllAssessmentComponentDto,
  FindAllAssessmentDomainDto,
} from '../dtos';
import { getTranslated } from '@shared/helpers/translation.helper';
import { Request } from 'express';
import { MemberRole } from '@shared/enums';
import { AuthDto } from '@shared/modules';
import { groupBy } from 'rxjs';

interface AssessmentDomainWithCounts extends AssessmentDomain {
  componentsCount: number;
  subComponentsCount: number;
}

@Injectable()
export class AssessmentDomainService {
  private readonly logger = new Logger(AssessmentDomainService.name);

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentDomain)
    private readonly assessmentDomainRepository: Repository<AssessmentDomain>,
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
    @InjectRepository(AssessmentMember)
    private readonly assessmentMemberRepository: Repository<AssessmentMember>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(AssessmentSubComponentAnswer)
    private readonly subComponentAnswerRepository: Repository<AssessmentSubComponentAnswer>,
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

    try {
      await manager.insert(AssessmentDomain, assessmentDomains);
      this.logger.debug('templateDomainId', templateDomainId);
      return { domains: assessmentDomains, templateDomainId };
    } catch (err) {
      this.logger.error('create:', err);
      throw new BadRequestException('Failed to create assessment domains.');
    }
  }

  async findAll(
    query: FindAllAssessmentDomainDto & { assessmentId: string },
  ): Promise<FindAllResponseDto<AssessmentDomain>> {
    return new QueryService<AssessmentDomain>(this.assessmentDomainRepository)
      .filter(
        [{ field: 'assessmentId', operator: '=', value: query.assessmentId }],
        { fields: ['code', 'name'], value: query.search },
      )
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(assessmentId: string, id: string): Promise<AssessmentDomain> {
    const domain = await this.assessmentDomainRepository.findOne({
      where: { id, assessmentId },
    });

    if (!domain) {
      throw new NotFoundException(`Assessment domain ${id} not found.`);
    }

    return domain;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentDomainDto,
  ): Promise<AssessmentDomain> {
    return this.assessmentDomainRepository.manager.transaction(
      async (manager) => {
        const domain = await this.findOne(assessmentId, id);

        const entity = {
          code: payload.code,
          name: payload.name,
          description: payload.description,
          translations: payload.translations,
        };

        try {
          await manager.update(AssessmentDomain, { id, assessmentId }, entity);
          return { ...domain, ...entity };
        } catch (err) {
          this.logger.error(`update: ${err.message}`, err.stack);
          throw new BadRequestException('Failed to update assessment domain.');
        }
      },
    );
  }

  async findComponents(
    id: string,
    query: FindAllAssessmentComponentDto & { language?: string },
  ): Promise<FindAllResponseDto<AssessmentComponent>> {
    const domain = await this.assessmentDomainRepository.findOne({
      where: { id },
    });
    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    // Only fetch components for this domainId
    const qb = this.assessmentComponentRepository
      .createQueryBuilder('component')
      .where('component.domainId = :domainId', { domainId: id });

    if (query.search) {
      qb.andWhere(
        'component.code ILIKE :search OR component.name ILIKE :search',
        {
          search: `%${query.search}%`,
        },
      );
    }

    const sortFields = query.ascending?.length
      ? query.ascending
      : query.descending?.length
        ? query.descending
        : ['createdAt'];
    const sortOrder = query.ascending?.length ? 'ASC' : 'DESC';
    sortFields.forEach((field) =>
      qb.addOrderBy(`component.${field}`, sortOrder),
    );

    const [components, total] = await Promise.all([
      qb.skip(query.skip).take(query.take).getMany(),
      qb.getCount(),
    ]);

    // Add translation if language param is provided
    const language = query.language;
    const data = language
      ? components.map((component) => ({
          ...component,
          name: getTranslated(component, language, 'name', component.name),
          description: getTranslated(
            component,
            language,
            'description',
            component.description,
          ),
        }))
      : components;

    return {
      data,
      total,
    };
  }

  private filters(
    query: FindAllAssessmentDomainDto & { assessmentId?: string },
  ): Filter[] {
    const filters: Filter[] = [];
    if (typeof query.isActive === 'boolean') {
      filters.push({
        field: 'isActive',
        operator: '=',
        value: query.isActive,
      });
    }
    if (query.assessmentId) {
      filters.push({
        field: 'assessmentId',
        operator: '=',
        value: query.assessmentId,
      });
    }
    return filters;
  }

  /**
   * Returns domain progress for an assessment.
   * - If both isPrimary and groupId are provided, returns both primary and group progress.
   * - If groupId is 'all', returns progress for all groups.
   * - If only isPrimary is 'true', returns only primary progress.
   * - If only groupId is provided, returns only that group's progress.
   * - If neither is provided, returns both primary and all groups progress.
   *
   * @param assessmentId The assessment ID
   * @param opts Options: isPrimary, groupId, language
   */
  async getProgress(
    assessmentId: string,
    userId: string,
    language: string = 'en',
  ) {
    
    type AssessmentDomainWithProgress = {
      id: string;
      name: string;
      percentage: number;
    };

    type AssessmentGroupDomain = {
      id: string;
      name: string;
      domains: AssessmentDomainWithProgress[];
    };

    type AnswerCountResult = {
      domainId: string;
      domainName: string;
      groupId: string;
      groupName: string;
      count: number;
    };

    const domains: { domainId: string; count: number }[] =
      await this.assessmentDomainRepository
        .createQueryBuilder('domain')
        .where('domain.assessmentId = :assessmentId', { assessmentId })
        .leftJoin('domain.components', 'component')
        .leftJoin('component.subComponents', 'subComponent')
        .select('domain.id', 'domainId')
        .addSelect('COUNT(subComponent.id)::int as count')
        .groupBy('domain.id')
        .execute();

    const answers: AnswerCountResult[] = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .where('assessment.id = :assessmentId', { assessmentId })
      .leftJoin('assessment.domains', 'domain')
      .leftJoin('assessment.groups', 'group')
      .leftJoin('assessment.answers', 'answer')
      .leftJoin('answer.assessmentSubComponentAnswers', 'subComponentAnswer')
      .select('domain.id', 'domainId')
      .addSelect('domain.name', 'domainName')
      .addSelect('group.id', 'groupId')
      .addSelect('group.name', 'groupName')
      .addSelect('COUNT(subComponentAnswer.id)::int as count')
      .groupBy('domain.id')
      .addGroupBy('group.id')
      .execute();

    const groups: Record<
      string,
      {
        id: string;
        name: string;
        domains: Record<string, AssessmentDomainWithProgress>;
      }
    > = {};

    answers.forEach((answer) => {
      if (!groups[answer.groupId]) {
        groups[answer.groupId] = {
          id: answer.groupId,
          name: answer.groupName,
          domains: {},
        };
      }

      domains.forEach(({ domainId, count }) => {
        groups[answer.groupId].domains[domainId] = {
          id: domainId,
          name: answer.domainName,
          percentage: (answer.count * 100) / count,
        };
      });
    });

    return Object.values(groups).map((group) => ({
      id: group.id,
      name: group.name,
      domains: Object.values(group.domains),
    }));
  }
}
