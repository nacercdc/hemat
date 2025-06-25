import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, IsNull } from 'typeorm';
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
  ): Promise<FindAllResponseDto<AssessmentDomainWithCounts>> {
    const qb = this.assessmentDomainRepository
      .createQueryBuilder('domain')
      .leftJoin('domain.components', 'component')
      .leftJoin('component.subComponents', 'subComponent')
      .select([
        'domain.*',
        'CAST(COUNT(DISTINCT component.id) AS INTEGER) as "componentsCount"',
        'CAST(COUNT(DISTINCT subComponent.id) AS INTEGER) as "subComponentsCount"',
      ])
      .where('domain.assessmentId = :assessmentId', {
        assessmentId: query.assessmentId,
      })
      .groupBy('domain.id');

    query.search &&
      qb.andWhere('(domain.code ILIKE :search OR domain.name ILIKE :search)', {
        search: `%${query.search}%`,
      });

    const sortFields = query.ascending?.length
      ? query.ascending
      : query.descending?.length
        ? query.descending
        : ['createdAt'];
    const sortOrder = query.ascending?.length ? 'ASC' : 'DESC';

    sortFields.forEach((field) => qb.addOrderBy(`domain.${field}`, sortOrder));

    const [domains, total] = await Promise.all([
      qb.skip(query.skip).take(query.take).getRawMany(),
      qb.getCount(),
    ]);

    return {
      data: domains,
      total,
    };
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
      qb.andWhere('component.code ILIKE :search OR component.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const sortFields = query.ascending?.length
      ? query.ascending
      : query.descending?.length
        ? query.descending
        : ['createdAt'];
    const sortOrder = query.ascending?.length ? 'ASC' : 'DESC';
    sortFields.forEach((field) => qb.addOrderBy(`component.${field}`, sortOrder));

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
          description: getTranslated(component, language, 'description', component.description),
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
   * Fetch all domains for an assessment, including progress for each member/group/role.
   */
  async findAllWithProgress(assessmentId: string, language?: string) {
    // 1. Get all domains for the assessment
    const domains = await this.assessmentDomainRepository.find({
      where: { assessmentId },
      relations: ['components', 'components.subComponents'],
    });

    // 2. Get all members for the assessment (include group relation)
    const members = await this.assessmentMemberRepository.find({
      where: { assessmentId },
      relations: ['group'],
    });

    // 3. Get all answers for the assessment
    const answers = await this.answerRepository.find({
      where: { assessmentId },
    });

    // 4. Get all subcomponent answers for the assessment
    const subComponentAnswers = await this.subComponentAnswerRepository.find();

    // 5. Build group map
    const groupMap: Record<
      string,
      { groupId: string; groupName: string; members: any[] }
    > = {};
    for (const member of members) {
      const groupId = member.groupId ? String(member.groupId) : 'nogroup';
      if (!groupMap[groupId]) {
        groupMap[groupId] = {
          groupId,
          groupName: member.group ? member.group.name : '',
          members: [],
        };
      }
      groupMap[groupId].members.push({
        userId: member.userId,
        role: member.role,
      });
    }

    // 6. For each group, build domains progress
    const data = Object.values(groupMap).map((group) => {
      const groupMembers = members.filter(
        (m) => (m.groupId ? String(m.groupId) : 'nogroup') === group.groupId,
      );
      const domainsProgress = domains.map((domain) => {
        const domainName = getTranslated(domain, language, 'name', domain.name);
        const domainDescription = getTranslated(
          domain,
          language,
          'description',
          domain.description,
        );
        const components = domain.components || [];
        const subComponents = components.flatMap((c: any) =>
          Array.isArray(c.subComponents) ? c.subComponents : [],
        );
        const subComponentIds = subComponents.map((sc: any) => sc.id);
        const componentsCount = components.length;
        const subComponentsCount = subComponentIds.length;

        // Get all group answers for this group and domain (isPrimary: false)
        const groupAnswerIds = answers
          .filter(
            (a) =>
              (a.groupId ? String(a.groupId) : 'nogroup') === group.groupId &&
              a.isPrimary === false,
          )
          .map((a) => a.id);

        // Get all subcomponent answers for those answers, for subcomponents in this domain
        const filledSubComponentIds = new Set(
          subComponentAnswers
            .filter(
              (sca) =>
                groupAnswerIds.includes(sca.answerId) &&
                subComponentIds.includes(sca.subComponentId),
            )
            .map((sca) => sca.subComponentId),
        );

        const answeredSubComponents = filledSubComponentIds.size;
        const totalSubComponents = subComponentsCount;
        const percentage =
          totalSubComponents > 0
            ? Math.round((answeredSubComponents / totalSubComponents) * 100)
            : 0;
        return {
          id: domain.id,
          name: domainName,
          description: domainDescription,
          componentsCount,
          subComponentsCount,
          answeredSubComponents,
          totalSubComponents,
          percentage,
        };
      });
      return {
        groupId: group.groupId,
        groupName: group.groupName,
        domains: domainsProgress,
      };
    });

    return {
      data,
      total: data.length,
    };
  }

  /**
   * Get assessment-level (primary) progress for each domain (isPrimary === true, groupId === null)
   */
  async findPrimaryProgress(assessmentId: string, language?: string) {
    // 1. Get all domains for the assessment
    const domains = await this.assessmentDomainRepository.find({
      where: { assessmentId },
      relations: ['components', 'components.subComponents'],
    });

    // 2. Get all answers for the assessment where isPrimary === true and groupId is null
    const primaryAnswers = await this.answerRepository.find({
      where: { assessmentId, isPrimary: true, groupId: IsNull() },
    });

    // If there are no primary answers, return all zeros
    if (primaryAnswers.length === 0) {
      const data = domains.map((domain) => {
        const components = domain.components || [];
        const subComponents = components.flatMap(
          (c: any) => c.subComponents || [],
        );
        const componentsCount = components.length;
        const subComponentsCount = subComponents.length;
        return {
          id: domain.id,
          name: getTranslated(domain, language, 'name', domain.name),
          description: getTranslated(domain, language, 'description', domain.description),
          componentsCount,
          subComponentsCount,
          answeredSubComponents: 0,
          totalSubComponents: subComponentsCount,
          percentage: 0,
        };
      });
      return { data, total: data.length };
    }

    // 3. Get all subcomponent answers for the assessment
    const subComponentAnswers = await this.subComponentAnswerRepository.find();

    // 4. For each domain, calculate progress (only for the primary user's answers)
    // Assume only one primary user per assessment
    const primaryUserId = primaryAnswers[0].userId;
    const primaryAnswerIds = primaryAnswers
      .filter((a) => a.userId === primaryUserId)
      .map((a) => a.id);

    const data = domains.map((domain) => {
      const components = domain.components || [];
      const subComponents = components.flatMap(
        (c: any) => c.subComponents || [],
      );
      const subComponentIds = subComponents.map((sc: any) => sc.id);
      const componentsCount = components.length;
      const subComponentsCount = subComponentIds.length;

      // Only count subcomponent answers by the primary user
      const filledSubComponentIds = new Set(
        subComponentAnswers
          .filter(
            (sca) =>
              primaryAnswerIds.includes(sca.answerId) &&
              subComponentIds.includes(sca.subComponentId),
          )
          .map((sca) => sca.subComponentId),
      );

      const answeredSubComponents = filledSubComponentIds.size;
      const totalSubComponents = subComponentsCount;
      const percentage =
        totalSubComponents > 0
          ? Math.round((answeredSubComponents / totalSubComponents) * 100)
          : 0;
      return {
        id: domain.id,
        name: getTranslated(domain, language, 'name', domain.name),
        description: getTranslated(domain, language, 'description', domain.description),
        componentsCount,
        subComponentsCount,
        answeredSubComponents,
        totalSubComponents,
        percentage,
      };
    });
    return {
      data,
      total: data.length,
    };
  }

  /**
   * Get group-level progress for each domain for a specific groupId
   */
  async findGroupProgress(assessmentId: string, groupId: string, language?: string) {
    // 1. Get all domains for the assessment
    const domains = await this.assessmentDomainRepository.find({
      where: { assessmentId },
      relations: ['components', 'components.subComponents'],
    });

    // 2. Get all answers for the assessment for this group (isPrimary === false)
    const groupAnswers = await this.answerRepository.find({
      where: { assessmentId, groupId, isPrimary: false },
    });

    // 3. Get all subcomponent answers for the assessment
    const subComponentAnswers = await this.subComponentAnswerRepository.find();

    // 4. For each domain, calculate progress
    const data = domains.map((domain) => {
      const components = domain.components || [];
      const subComponents = components.flatMap(
        (c: any) => c.subComponents || [],
      );
      const subComponentIds = subComponents.map((sc: any) => sc.id);
      const componentsCount = components.length;
      const subComponentsCount = subComponentIds.length;

      // Get all subcomponent answers for group answers, for subcomponents in this domain
      const groupAnswerIds = groupAnswers.map((a) => a.id);
      const filledSubComponentIds = new Set(
        subComponentAnswers
          .filter(
            (sca) =>
              groupAnswerIds.includes(sca.answerId) &&
              subComponentIds.includes(sca.subComponentId),
          )
          .map((sca) => sca.subComponentId),
      );

      const answeredSubComponents = filledSubComponentIds.size;
      const totalSubComponents = subComponentsCount;
      const percentage =
        totalSubComponents > 0
          ? Math.round((answeredSubComponents / totalSubComponents) * 100)
          : 0;
      return {
        id: domain.id,
        name: getTranslated(domain, language, 'name', domain.name),
        description: getTranslated(domain, language, 'description', domain.description),
        componentsCount,
        subComponentsCount,
        answeredSubComponents,
        totalSubComponents,
        percentage,
      };
    });
    return {
      data,
      total: data.length,
    };
  }
}
