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
import { MemberRole } from '@shared/enums';
import {
  AssessmentDomainProgress,
  AssessmentGroupProgress,
  AssessmentPrimaryProgress,
  DomainSubComponentCount,
  DomainAnswerCount,
  GroupDomainAnswerCount,
  ProgressQueryOptions,
} from '../types/assessment-progress.type';

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
    const domains = await manager.find(Domain, { where: { isActive: true } });

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

    const qb = this.assessmentComponentRepository
      .createQueryBuilder('component')
      .where('component.domainId = :domainId', { domainId: id });

    if (query.search) {
      qb.andWhere(
        'component.code ILIKE :search OR component.name ILIKE :search',
        { search: `%${query.search}%` },
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

    return { data, total };
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

  async getProgress(
    assessmentId: string,
    userId: string,
    language: string = 'en',
    options: ProgressQueryOptions = {},
  ): Promise<AssessmentGroupProgress[]> {
    // Fetch all domains with their subcomponent counts and names
    const domains: DomainSubComponentCount[] =
      await this.assessmentDomainRepository
        .createQueryBuilder('domain')
        .where('domain.assessmentId = :assessmentId', { assessmentId })
        .leftJoin('domain.components', 'component')
        .leftJoin('component.subComponents', 'subComponent')
        .select('domain.id', 'domainId')
        .addSelect(
          `COALESCE(domain.translations->'${language}'->>'name', domain.name)`,
          'domainName',
        )
        .addSelect('COUNT(subComponent.id)::int', 'subComponentCount')
        .groupBy('domain.id')
        .addGroupBy('domain.name')
        .addGroupBy('domain.translations')
        .execute();

    // Create a map for quick domain lookup
    const domainMap = new Map(
      domains.map((domain) => [domain.domainId, domain]),
    );

    // Build the base query for answers
    const answerQuery = this.assessmentRepository
      .createQueryBuilder('assessment')
      .where('assessment.id = :assessmentId', { assessmentId })
      .leftJoin('assessment.domains', 'domain')
      .leftJoin('assessment.groups', 'group')
      .leftJoin('assessment.answers', 'answer')
      .leftJoin('answer.assessmentSubComponentAnswers', 'subComponentAnswer')
      .select('domain.id', 'domainId')
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'name', domain.name)`,
        'domainName',
      )
      .addSelect('group.id', 'groupId')
      .addSelect('group.name', 'groupName')
      .addSelect(
        'COUNT(CASE WHEN subComponentAnswer.domainId = domain.id THEN 1 END)::int',
        'answerCount',
      )
      .groupBy('domain.id')
      .addGroupBy('group.id')
      .addGroupBy('domain.name')
      .addGroupBy('domain.translations');

    // Apply group filtering if provided
    if (options.filterByGroupIds?.length) {
      let groupIds = [...options.filterByGroupIds];

      if (options.includePrimary) {
        const primaryGroupId = await this.assessmentMemberRepository
          .findOne({
            where: { assessmentId, role: MemberRole.PRIMARY },
            select: ['groupId'],
          })
          .then((member) => member?.groupId);

        if (primaryGroupId) {
          groupIds.push(primaryGroupId);
        }
      }

      answerQuery.andWhere('group.id IN (:...groupIds)', { groupIds });
    }

    // Only include group answers (not primary answers)
    answerQuery.andWhere('answer.isPrimary = false');

    const answers: GroupDomainAnswerCount[] = await answerQuery.execute();

    // Build response with optimized data processing
    const groupMap = new Map<string, AssessmentGroupProgress>();

    // Map to track which domains have answers for each group
    const groupDomainAnswered = new Map<string, Set<string>>();

    answers.forEach(
      ({ domainId, domainName, groupId, groupName, answerCount }) => {
        if (!groupMap.has(groupId)) {
          groupMap.set(groupId, {
            id: groupId,
            name: groupName,
            domains: [],
          });
        }
        if (!groupDomainAnswered.has(groupId)) {
          groupDomainAnswered.set(groupId, new Set());
        }
        groupDomainAnswered.get(groupId)!.add(domainId);

        const group = groupMap.get(groupId)!;
        const domain = domainMap.get(domainId);

        if (domain) {
          group.domains.push({
            id: domainId,
            name: domainName,
            percentage:
              domain.subComponentCount > 0
                ? (answerCount * 100) / domain.subComponentCount
                : 0,
          });
        }
      },
    );

    // For each group, ensure all domains are present, and set percentage 0 for domains with no answers
    for (const [groupId, group] of groupMap.entries()) {
      const answeredDomains = groupDomainAnswered.get(groupId) || new Set();
      domains.forEach(({ domainId, domainName, subComponentCount }) => {
        if (!answeredDomains.has(domainId)) {
          group.domains.push({
            id: domainId,
            name: domainName,
            percentage: 0,
          });
        }
      });
      // Optionally, sort domains by name or id if needed
      group.domains.sort((a, b) => a.name.localeCompare(b.name));
    }

    return Array.from(groupMap.values());
  }

  async getProgressPrimary(
    assessmentId: string,
    language: string = 'en',
  ): Promise<AssessmentPrimaryProgress> {
    // Fetch all domains with their subcomponent counts and names
    const domains: DomainSubComponentCount[] =
      await this.assessmentDomainRepository
        .createQueryBuilder('domain')
        .where('domain.assessmentId = :assessmentId', { assessmentId })
        .leftJoin('domain.components', 'component')
        .leftJoin('component.subComponents', 'subComponent')
        .select('domain.id', 'domainId')
        .addSelect(
          `COALESCE(domain.translations->'${language}'->>'name', domain.name)`,
          'domainName',
        )
        .addSelect('COUNT(subComponent.id)::int', 'subComponentCount')
        .groupBy('domain.id')
        .addGroupBy('domain.name')
        .addGroupBy('domain.translations')
        .execute();

    // Fetch primary answers grouped by domain
    const primaryAnswers: DomainAnswerCount[] = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .where('assessment.id = :assessmentId', { assessmentId })
      .leftJoin('assessment.domains', 'domain')
      .leftJoin('assessment.answers', 'answer')
      .leftJoin('answer.assessmentSubComponentAnswers', 'subComponentAnswer')
      .where('answer.isPrimary = :isPrimary', { isPrimary: true })
      .select('domain.id', 'domainId')
      .addSelect('COUNT(subComponentAnswer.id)::int', 'answerCount')
      .groupBy('domain.id')
      .execute();

    // Create a map for quick answer lookup
    const answerMap = new Map(
      primaryAnswers.map((answer) => [answer.domainId, answer.answerCount]),
    );

    // Build response with optimized data processing
    const domainProgress: AssessmentDomainProgress[] = domains.map(
      ({ domainId, domainName, subComponentCount }) => {
        const answeredCount = answerMap.get(domainId) || 0;

        return {
          id: domainId,
          name: domainName,
          percentage:
            subComponentCount > 0
              ? (answeredCount * 100) / subComponentCount
              : 0,
        };
      },
    );

    return {
      assessmentId,
      domains: domainProgress,
    };
  }

  async getDomains(language: string = 'en') {
    return this.assessmentDomainRepository
      .createQueryBuilder('domain')
      .leftJoin('domain.components', 'component')
      .leftJoin('component.subComponents', 'subComponent')
      .select('domain.id', 'id')
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'code', domain.code)`,
        'code',
      )
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'name', domain.name)`,
        'name',
      )
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'description', domain.description)`,
        'description',
      )
      .addSelect('COUNT(component.id)::int as componentsCount')
      .addSelect('COUNT(subComponent.id)::int as subComponentsCount')
      .groupBy('domain.id')
      .execute();
  }

  async getDomainsByGroup(assessmentId: string, groupId: string, language: string = 'en') {
    return this.assessmentDomainRepository
      .createQueryBuilder('domain')
      .leftJoin('domain.components', 'component')
      .leftJoin('component.subComponents', 'subComponent')
      .leftJoin('subComponent.answers', 'answer')
      .where('domain.assessmentId = :assessmentId', { assessmentId })
      .andWhere('answer.groupId = :groupId', { groupId })
      .select('domain.id', 'id')
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'code', domain.code)`,
        'code',
      )
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'name', domain.name)`,
        'name',
      )
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'description', domain.description)`,
        'description',
      )
      .addSelect('COUNT(DISTINCT component.id)::int as componentsCount')
      .addSelect('COUNT(DISTINCT subComponent.id)::int as subComponentsCount')
      .groupBy('domain.id')
      .execute();
  }
}
