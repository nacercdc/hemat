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

  async getProgress(
    assessmentId: string,
    userId: string,
    language: string = 'en',
    options: ProgressQueryOptions = {},
  ): Promise<AssessmentGroupProgress[]> {
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

    const domainMap = new Map(
      domains.map((domain) => [domain.domainId, domain]),
    );

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

    answerQuery.andWhere('answer.isPrimary = false');

    const answers: GroupDomainAnswerCount[] = await answerQuery.execute();

    const groupMap = new Map<string, AssessmentGroupProgress>();


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
      group.domains.sort((a, b) => a.name.localeCompare(b.name));
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
        .addSelect('COUNT(subComponent.id)::int', 'subComponentCount')
        .groupBy('domain.id')
        .addGroupBy('domain.name')
        .addGroupBy('domain.translations')
        .execute();

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

  async getDomainsByGroup(
    assessmentId: string,
    groupId: string,
    language: string = 'en',
  ) {
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
    opts?: { groupId?: string; isPrimary?: boolean }
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

    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      components: (domain.components || []).map((component) => ({
        id: component.id,
        name: component.name,
        description: component.description,
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
              name: subComponent.name,
              description: subComponent.description,
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
            name: subComponent.name,
            description: subComponent.description,
            answer: {
              id: answer.id,
              measurementScale: answer.measurementScale
                ? {
                    id: answer.measurementScale.id,
                    name: answer.measurementScale.name,
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

  async getDomainWithAnswers(assessmentId: string, domainId: string) {
    return this.getDomainWithAnswersBase(assessmentId, domainId);
  }

  async getDomainWithAnswersByGroup(assessmentId: string, domainId: string, groupId: string) {
    return this.getDomainWithAnswersBase(assessmentId, domainId, { groupId });
  }

  async getDomainWithPrimaryAnswers(assessmentId: string, domainId: string) {
    return this.getDomainWithAnswersBase(assessmentId, domainId, { isPrimary: true });
  }
}
