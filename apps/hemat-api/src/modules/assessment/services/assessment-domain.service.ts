import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository} from 'typeorm';
import {
  AssessmentComponent,
  AssessmentDomain,
  Domain,
  AssessmentMember,
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
import { CompressionUtil } from '@shared/utils/compression.util';

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
        templateDomainId: id,
      });
      templateDomainId[id] = domain.id;
      assessmentDomains.push(domain);
    });

    try {
      await manager.insert(AssessmentDomain, assessmentDomains);
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
  ): Promise<FindAllResponseDto<any>> {
    const domain = await this.assessmentDomainRepository.findOne({
      where: { id },
    });
    if (!domain) throw new NotFoundException(`Domain ${id} not found.`);

    const qb = this.assessmentComponentRepository
      .createQueryBuilder('component')
      .leftJoin(
        'component.subComponents',
        'subComponent',
        'subComponent.deletedAt IS NULL',
      )
      .leftJoin(
        'assessment_sub_component_answers',
        'filled',
        'filled.subComponentId = subComponent.id AND filled.deletedAt IS NULL',
      )
      .select([
        'component',
        'COUNT(DISTINCT filled.subComponentId) AS "filledSubComponentsCount"',
        'COUNT(DISTINCT subComponent.id) AS "totalSubComponents"',
      ])
      .where('component.domainId = :domainId', { domainId: id })
      .andWhere('component.deletedAt IS NULL')
      .groupBy('component.id');

    if (query.search) {
      qb.andWhere(
        '(component.code ILIKE :search OR component.name ILIKE :search)',
        {
          search: `%${query.search}%`,
        },
      );
    }

    const [rows, total] = await Promise.all([
      qb.skip(query.skip).take(query.take).getRawAndEntities(),
      qb.getCount(),
    ]);

    const language = query.language;
    const data = rows.entities.map((component, idx) => {
      const raw = rows.raw[idx];
      const total = +raw.totalSubComponents || 0;
      const filled = +raw.filledSubComponentsCount || 0;
      return {
        ...component,
        name: language
          ? getTranslated(component, language, 'name', component.name)
          : component.name,
        description: language
          ? getTranslated(
              component,
              language,
              'description',
              component.description,
            )
          : component.description,
        totalSubComponents: total,
        filledSubComponentsCount: filled,
        filledPercentage: total ? Math.round((filled / total) * 100) : 0,
      };
    });

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

  // Helper: Fetch all domains for the assessment with subcomponent counts
  private async getAssessmentDomainsWithCounts(assessmentId: string, language: string): Promise<DomainSubComponentCount[]> {
    // FIX: Count unique subcomponents for the domain (across all components)
    return this.assessmentDomainRepository
      .createQueryBuilder('domain')
      .where('domain.assessmentId = :assessmentId', { assessmentId })
      .leftJoin('domain.components', 'component')
      .leftJoin('component.subComponents', 'subComponent')
      .select('domain.id', 'domainId')
      .addSelect(`COALESCE(domain.translations->'${language}'->>'name', domain.name)`, 'domainName')
      .addSelect('COUNT(DISTINCT subComponent.id)::int', 'subComponentCount')
      .groupBy('domain.id')
      .addGroupBy('domain.name')
      .addGroupBy('domain.translations')
      .execute() as Promise<DomainSubComponentCount[]>;
  }

  // Helper: Fetch all group/domain/answer counts for the assessment
  private async getGroupDomainAnswerCounts(
    assessmentId: string,
    language: string,
    groupIds?: string[],
    includePrimary?: boolean
  ): Promise<GroupDomainAnswerCount[]> {
    // Extra debug: log all subcomponent answers being counted
    const answerQuery = this.assessmentRepository
      .createQueryBuilder('assessment')
      .where('assessment.id = :assessmentId', { assessmentId })
      .leftJoin('assessment.domains', 'domain')
      .leftJoin('assessment.groups', 'group')
      .leftJoin('assessment.answers', 'answer')
      .leftJoin('answer.assessmentSubComponentAnswers', 'subComponentAnswer')
      .leftJoin('subComponentAnswer.subComponent', 'subComponent')
      .leftJoin('subComponent.component', 'component')
      .select('domain.id', 'domainId')
      .addSelect(`COALESCE(domain.translations->'${language}'->>'name', domain.name)`, 'domainName')
      .addSelect('group.id', 'groupId')
      .addSelect('group.name', 'groupName')
      .addSelect('COUNT(DISTINCT CASE WHEN component.domainId = domain.id AND subComponentAnswer.deletedAt IS NULL AND answer.deletedAt IS NULL THEN subComponentAnswer.subComponentId END)::int', 'answerCount')
      .groupBy('domain.id')
      .addGroupBy('group.id')
      .addGroupBy('domain.name')
      .addGroupBy('domain.translations');

    if (groupIds?.length) {
      let ids = [...groupIds];
      if (includePrimary) {
        const primaryGroupId = await this.assessmentMemberRepository
          .findOne({ where: { assessmentId, role: MemberRole.PRIMARY }, select: ['groupId'] })
          .then((member) => member?.groupId);
        if (primaryGroupId) ids.push(primaryGroupId);
      }
      answerQuery.andWhere('group.id IN (:...ids)', { ids });
    }
    answerQuery.andWhere('answer.isPrimary = false');

    // LOGGING: Print all subcomponent answers being counted for debugging
    const domainIdList = groupIds && groupIds.length
      ? groupIds.map(id => `'${id}'`).join(',')
      : `(SELECT id FROM assessment_domains WHERE assessmentId = '${assessmentId}')`;
    const debugQuery = `
      SELECT sca.subComponentId, sca.id AS subComponentAnswerId, sca.deletedAt, a.groupId, a.isPrimary, a.deletedAt AS answerDeletedAt, c.domainId, sca.answerId
      FROM assessment_sub_component_answers sca
      JOIN answers a ON a.id = sca."answerId"
      JOIN assessment_sub_components sc ON sc.id = sca.subComponentId
      JOIN assessment_components c ON c.id = sc.componentId
      WHERE c.domainId IN ${domainIdList}
        AND a.isPrimary = false
        AND sca.deletedAt IS NULL
        AND a.deletedAt IS NULL;
    `;
    // eslint-disable-next-line no-console
    console.log('[PROGRESS DEBUG] Executing debug query:', debugQuery);
    try {
      const rawAnswers = await this.assessmentRepository.manager.query(debugQuery);
      // eslint-disable-next-line no-console
      console.log('[PROGRESS DEBUG] Raw filled subcomponent answers:', rawAnswers);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PROGRESS DEBUG] Error executing debug query:', err);
    }

    return answerQuery.execute() as Promise<GroupDomainAnswerCount[]>;
  }

  async getProgress(
    assessmentId: string,
    userId: string,
    language: string = 'en',
    options: ProgressQueryOptions = {},
  ): Promise<AssessmentGroupProgress[]> {
    // 1. Fetch all domains for the assessment
    const domains: DomainSubComponentCount[] = await this.getAssessmentDomainsWithCounts(assessmentId, language);
    const domainMap = new Map<string, DomainSubComponentCount>(domains.map((d: DomainSubComponentCount) => [d.domainId, d]));

    // 2. Fetch all group/domain/answer counts
    const answers: GroupDomainAnswerCount[] = await this.getGroupDomainAnswerCounts(
      assessmentId,
      language,
      options.filterByGroupIds,
      options.includePrimary,
    );

    // 3. Build group progress from answers
    const groupMap = new Map<string, AssessmentGroupProgress>();
    const groupDomainAnswered = new Map<string, Set<string>>();
    answers.forEach(({ domainId, domainName, groupId, groupName, answerCount }: GroupDomainAnswerCount) => {
      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, { id: groupId, name: groupName, domains: [] });
      }
      if (!groupDomainAnswered.has(groupId)) {
        groupDomainAnswered.set(groupId, new Set());
      }
      groupDomainAnswered.get(groupId)!.add(domainId);
      const group = groupMap.get(groupId)!;
      const domain = domainMap.get(domainId);
      if (domain) {
        // LOGGING: Print numerator and denominator for debugging
        const numerator = answerCount;
        const denominator = domain.subComponentCount;
        this.logger.log(`[PROGRESS DEBUG] Group: ${groupName || groupId}, Domain: ${domainName || domainId}, Filled: ${numerator}, Total: ${denominator}, Percentage: ${denominator > 0 ? (numerator * 100) / denominator : 0}`);
        group.domains.push({
          id: domainId,
          name: domainName,
          percentage: denominator > 0 ? (numerator * 100) / denominator : 0,
        });
      }
    });

    // 4. If filtering by a single group, restrict to only attached domains
    if (options.filterByGroupIds?.length === 1) {
      const groupId = options.filterByGroupIds[0];
      const group = await this.assessmentRepository.manager.getRepository('AssessmentGroup').findOne({
        where: { id: groupId, assessmentId },
        relations: ['domains'],
      });
      if (!group) throw new NotFoundException('Group not found');
      const allowedDomainIds = (group.domains || []).map((d: AssessmentDomain) => d.id);
      for (const [domainId] of domainMap) {
        if (!allowedDomainIds.includes(domainId)) {
          domainMap.delete(domainId);
        }
      }
      for (const [gId, answeredSet] of groupDomainAnswered.entries()) {
        for (const domainId of Array.from(answeredSet)) {
          if (!allowedDomainIds.includes(domainId)) {
            answeredSet.delete(domainId);
          }
        }
      }
    }

    // Fetch all group-domain relations in one query for efficiency
    let groupDomainMap: Map<string, Set<string>> = new Map();
    const allGroups = await this.assessmentRepository.manager.getRepository('AssessmentGroup').find({
      where: { assessmentId },
      relations: ['domains'],
    });
    for (const group of allGroups) {
      groupDomainMap.set(
        group.id,
        new Set((group.domains || []).map((d: AssessmentDomain) => d.id))
      );
    }

    // 5. Add missing domains (with 0%) for each group, only for attached domains
    for (const [groupId, group] of groupMap.entries()) {
      const answeredDomains = groupDomainAnswered.get(groupId) || new Set<string>();
      Array.from(domainMap.values()).forEach(({ domainId, domainName }: DomainSubComponentCount) => {
        if (!answeredDomains.has(domainId)) {
          group.domains.push({ id: domainId, name: domainName, percentage: 0 });
        }
      });
      group.domains.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Filter domains for each group to only those attached to the group
    for (const group of groupMap.values()) {
      const allowedDomainIds = groupDomainMap.get(group.id) || new Set();
      group.domains = group.domains.filter(domain => allowedDomainIds.has(domain.id));
    }

    // 6. Only return filtered group(s) for team-leader/member, else all
    if (options.filterByGroupIds?.length) {
      return Array.from(groupMap.values()).filter(g => options.filterByGroupIds!.includes(g.id));
    }
    return Array.from(groupMap.values());
  }

  async getProgressPrimary(
    assessmentId: string,
    language: string = 'en',
  ): Promise<AssessmentPrimaryProgress> {
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
        // FIX: Count unique subcomponents for the domain
        .addSelect('COUNT(DISTINCT subComponent.id)::int', 'subComponentCount')
        .groupBy('domain.id')
        .addGroupBy('domain.name')
        .addGroupBy('domain.translations')
        .execute();

    // FIX: Only count unique, non-deleted subcomponents with a primary answer in the correct domain
    const primaryAnswers: DomainAnswerCount[] =
      await this.assessmentDomainRepository
        .createQueryBuilder('domain')
        .where('domain.assessmentId = :assessmentId', { assessmentId })
        .leftJoin('domain.components', 'component')
        .leftJoin('component.subComponents', 'subComponent')
        .leftJoin('subComponent.answers', 'subComponentAnswer')
        .leftJoin('subComponentAnswer.answer', 'answer')
        .andWhere('answer.isPrimary = :isPrimary', { isPrimary: true })
        .andWhere('subComponentAnswer.deletedAt IS NULL')
        .andWhere('answer.deletedAt IS NULL')
        .select('domain.id', 'domainId')
        .addSelect('COUNT(DISTINCT subComponentAnswer.subComponentId)::int', 'answerCount')
        .groupBy('domain.id')
        .execute();

    const answerMap = new Map(
      primaryAnswers.map((answer) => [answer.domainId, answer.answerCount]),
    );

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

  async getDomains(assessmentId: string, language: string = 'en') {
    // This returns all domains for the specified assessment.
    return this.assessmentDomainRepository
      .createQueryBuilder('domain')
      .where('domain.assessmentId = :assessmentId', { assessmentId })
      .leftJoin('domain.components', 'component', 'component.assessmentId = :assessmentId', { assessmentId })
      .leftJoin('component.subComponents', 'subComponent', 'subComponent.assessmentId = :assessmentId', { assessmentId })
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

  // Helper to check domain existence
  private async findDomainOrThrow(assessmentId: string, domainId: string) {
    const domain = await this.assessmentDomainRepository.findOne({
      where: { id: domainId, assessmentId },
      relations: ['components', 'components.subComponents'],
    });
    if (!domain) throw new NotFoundException('Domain or assessment not found');
    return domain;
  }

  // Helper to fetch domain with answers, by group or primary
  private async getDomainWithAnswersBase(
    assessmentId: string,
    domainId: string,
    opts?: { groupId?: string; isPrimary?: boolean },
    language: string = 'en',
  ) {
    const domainEntity = await this.findDomainOrThrow(assessmentId, domainId);

    let query = this.assessmentDomainRepository
      .createQueryBuilder('domain')
      .leftJoinAndSelect('domain.components', 'component')
      .leftJoinAndSelect('component.subComponents', 'subComponent')
      .leftJoinAndSelect(
        'subComponent.answers',
        'subcomponentanswer',
        'subcomponentanswer.domainId = :domainId AND subcomponentanswer.deletedAt IS NULL',
        { domainId }
      )
      .leftJoinAndSelect('subcomponentanswer.answer', 'answer')
      .leftJoinAndSelect('subcomponentanswer.measurementScale', 'measurementscale')
      .where('domain.id = :domainId', { domainId })
      .andWhere('domain.assessmentId = :assessmentId', { assessmentId });

    if (opts?.groupId) {
      query = query.andWhere('answer.groupId = :groupId', { groupId: opts.groupId });
    }
    if (opts?.isPrimary !== undefined) {
      query = query.andWhere('answer.isPrimary = :isPrimary', { isPrimary: opts.isPrimary });
    }
    query = query.andWhere('answer.assessmentId = :assessmentId', { assessmentId });

    const rows = await query.getMany();
    const domain = rows.length > 0 ? rows[0] : domainEntity;

    // Use translations if available
    const getTranslated = (obj: any, key: string, fallback: string) => {
      if (obj.translations && obj.translations[language] && obj.translations[language][key]) {
        return obj.translations[language][key];
      }
      return fallback;
    };

    return {
      id: domain.id,
      name: getTranslated(domain, 'name', domain.name),
      description: getTranslated(domain, 'description', domain.description),
      components: (domain.components || []).map((component) => ({
        id: component.id,
        name: getTranslated(component, 'name', component.name),
        description: getTranslated(component, 'description', component.description),
        subComponents: (Array.isArray(component.subComponents) ? component.subComponents : component.subComponents ? [component.subComponents] : []).map((subComponent) => {
          const answer = Array.isArray(subComponent.answers)
            ? subComponent.answers.find((a: any) =>
                a.answer &&
                a.answer.assessmentId === assessmentId &&
                (opts?.groupId ? a.answer.groupId === opts.groupId : true) &&
                (opts?.isPrimary !== undefined ? a.answer.isPrimary === opts.isPrimary : true)
              )
            : (subComponent.answers &&
                subComponent.answers.answer &&
                subComponent.answers.answer.assessmentId === assessmentId &&
                (opts?.groupId ? subComponent.answers.answer.groupId === opts.groupId : true) &&
                (opts?.isPrimary !== undefined ? subComponent.answers.answer.isPrimary === opts.isPrimary : true)
                ? subComponent.answers
                : null);

          if (!answer)
            return {
              id: subComponent.id,
              name: getTranslated(subComponent, 'name', subComponent.name),
              description: getTranslated(subComponent, 'description', subComponent.description),
              answer: null,
            };

          const evidenceCompressed = CompressionUtil.compressText(answer.evidence, {
            minSizeToCompress: 1000,
            logCompression: true,
          });
          const referenceCompressed = CompressionUtil.compressText(answer.reference, {
            minSizeToCompress: 1000,
            logCompression: true,
          });

          return {
            id: subComponent.id,
            name: getTranslated(subComponent, 'name', subComponent.name),
            description: getTranslated(subComponent, 'description', subComponent.description),
            answer: {
              id: answer.id,
              measurementScale: answer.measurementScale
                ? {
                    id: answer.measurementScale.id,
                    name: answer.measurementScale.translations && answer.measurementScale.translations[language] && answer.measurementScale.translations[language].name
                      ? answer.measurementScale.translations[language].name
                      : answer.measurementScale.name,
                    rate: answer.measurementScale.rate,
                  }
                : null,
              evidence: evidenceCompressed.data,
              reference: referenceCompressed.data,
              notes: answer.notes,
              isCompressed: evidenceCompressed.isCompressed || referenceCompressed.isCompressed,
            },
          };
        }),
      })),
    };
  }

  async getDomainWithAnswers(assessmentId: string, domainId: string, language: string = 'en') {
    return this.getDomainWithAnswersBase(assessmentId, domainId, undefined, language);
  }

  async getDomainWithAnswersByGroup(assessmentId: string, domainId: string, groupId: string, language: string = 'en') {
    return this.getDomainWithAnswersBase(assessmentId, domainId, { groupId }, language);
  }

  async getDomainWithPrimaryAnswers(assessmentId: string, domainId: string, language: string = 'en') {
    return this.getDomainWithAnswersBase(assessmentId, domainId, { isPrimary: true }, language);
  }

  /**
   * Utility: Check if a group has at least one domain attached
   */
  async ensureGroupHasDomains(groupId: string, assessmentId: string) {
    const group = await this.assessmentRepository.manager.getRepository('AssessmentGroup').findOne({
      where: { id: groupId, assessmentId },
      relations: ['domains'],
    });
    if (!group || !group.domains || group.domains.length === 0) {
      throw new ForbiddenException(
        'This group does not have any domains assigned.',
      );
    }
    return group;
  }
}
