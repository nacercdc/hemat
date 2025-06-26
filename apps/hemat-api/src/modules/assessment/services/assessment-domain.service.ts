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

interface AssessmentDomainWithCounts extends AssessmentDomain {
  componentsCount: number;
  subComponentsCount: number;
}

@Injectable()
export class AssessmentDomainService {
  private readonly logger = new Logger(AssessmentDomainService.name);

  constructor(
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
    opts: { language?: string; page?: number; pageSize?: number },
    userId: string,
    req: any, // request object to access assessmentRole and assessmentGroupId
  ) {
    // 1. Get the user's role and group from the guard
    const role = req.assessmentRole;
    const groupId = req.assessmentGroupId;

    // 2. Fetch all domains and build a map for quick lookup
    const domains = await this.assessmentDomainRepository.find({
      where: { assessmentId },
      relations: ['components', 'components.subComponents'],
    });
    const domainMeta = domains.map((domain) => {
      const subComponentsCount = Array.isArray(domain.components)
        ? domain.components.reduce(
            (sum, c) => sum + (Array.isArray(c.subComponents) ? c.subComponents.length : 0),
            0,
          )
        : 0;
      return {
        id: domain.id,
        name: getTranslated(domain, opts.language, 'name', domain.name),
        description: getTranslated(domain, opts.language, 'description', domain.description),
        componentsCount: Array.isArray(domain.components) ? domain.components.length : 0,
        subComponentsCount,
      };
    });

    // Fetch all groups for the assessment (for primary views)
    const allGroups = (role === MemberRole.PRIMARY)
      ? await this.assessmentMemberRepository
          .createQueryBuilder('member')
          .select('member.groupId')
          .where('member.assessmentId = :assessmentId', { assessmentId })
          .andWhere('member.groupId IS NOT NULL')
          .groupBy('member.groupId')
          .getRawMany()
      : [];
    const groupIdsAll = allGroups.map(g => g.member_groupId);

    // 3. Build answer filters
    let answerFilters: any[] = [
      { assessmentId, isPrimary: true, groupId: null }, // always fetch primary
    ];
    if (role === MemberRole.PRIMARY) {
      answerFilters.push({ assessmentId, isPrimary: false }); // all groups
    } else if (groupId) {
      answerFilters.push({ assessmentId, isPrimary: false, groupId }); // only their group
    }

    // 4. Fetch all relevant answers and subcomponent answers
    const answers = await this.answerRepository.find({ where: answerFilters });
    const answerIdsByType: Record<string, string[]> = {};
    for (const ans of answers) {
      if (ans.isPrimary) {
        answerIdsByType.primary = answerIdsByType.primary || [];
        answerIdsByType.primary.push(ans.id);
      } else if (ans.groupId) {
        answerIdsByType[ans.groupId] = answerIdsByType[ans.groupId] || [];
        answerIdsByType[ans.groupId].push(ans.id);
      }
    }
    const allAnswerIds = Object.values(answerIdsByType).flat();
    const subComponentAnswers = allAnswerIds.length
      ? await this.subComponentAnswerRepository.find({ where: { answerId: In(allAnswerIds) } })
      : [];

    // 5. Helper to build progress for a set of answerIds, with pagination
    const buildProgress = (answerIds: string[]) => {
      const domainToSubCompSet: Record<string, Set<string>> = {};
      for (const sca of subComponentAnswers) {
        if (!answerIds.includes(sca.answerId)) continue;
        if (!domainToSubCompSet[sca.domainId]) domainToSubCompSet[sca.domainId] = new Set();
        domainToSubCompSet[sca.domainId].add(sca.subComponentId);
      }
      let data = domainMeta.map((meta) => {
        const answered = domainToSubCompSet[meta.id]?.size || 0;
        return {
          ...meta,
          answeredSubComponents: answered,
          totalSubComponents: meta.subComponentsCount,
          percentage: meta.subComponentsCount > 0
            ? Math.round((answered / meta.subComponentsCount) * 100)
            : 0,
        };
      });
      const total = data.length;
      const page = opts.page && opts.page > 0 ? opts.page : 1;
      const pageSize = opts.pageSize && opts.pageSize > 0 ? opts.pageSize : total;
      data = data.slice((page - 1) * pageSize, page * pageSize);
      return { data, total };
    };

    // 6. Build response
    const res: any = {};
    res.primary = buildProgress(answerIdsByType.primary || []);
    if (role === MemberRole.PRIMARY) {
      res.groups = {};
      for (const gid of groupIdsAll) {
        res.groups[gid] = buildProgress(answerIdsByType[gid] || []);
      }
    } else if (groupId) {
      res.group = buildProgress(answerIdsByType[groupId] || []);
    }
    return res;
  }
}
