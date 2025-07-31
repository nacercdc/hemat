import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  Answer,
  AssessmentSubComponent,
  AssessmentSubComponentAnswer,
  SubComponent,
  AssessmentSubComponentRoadmap,
  Roadmap,
} from '@database/entities';
import { UUID } from '@shared/helpers';
import { Filter, QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import {
  AssessmentSubComponentDto,
  FindAllAssessmentAnswerDto,
  FindAllAssessmentSubComponentDto,
  FindOneAssessmentSubComponentDto,
  FindOnePrimaryAssessmentAnswerDto,
} from '../dtos';
import { MemberRole } from '@shared/enums';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { Media, FileUploadService } from '@etm/server-media-upload';

@Injectable()
export class AssessmentSubComponentService {
  private readonly loggerService = new Logger(
    AssessmentSubComponentService.name,
  );

  constructor(
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentSubComponentAnswer)
    private subComponentAnswerRepository: Repository<AssessmentSubComponentAnswer>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(AssessmentSubComponentRoadmap)
    private subComponentRoadmapRepository: Repository<AssessmentSubComponentRoadmap>,
    @InjectRepository(Roadmap)
    private readonly roadmapRepository: Repository<Roadmap>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(
    manager: EntityManager,
    assessmentId: string,
    templateComponentId: Record<string, string>,
  ): Promise<{
    subComponents: AssessmentSubComponent[];
    templateSubComponentId: Record<string, string>;
  }> {
    const subComponents = await manager.find(SubComponent, {
      where: { isActive: true },
      relations: { measurementScales: { measurementScale: true } },
    });

    const assessmentSubComponents: AssessmentSubComponent[] = [];
    const templateSubComponentId: Record<string, string> = {};
    subComponents.forEach(
      ({ id, code, name, description, componentId, translations }) => {
        const parentId = templateComponentId[componentId] ?? null;

        if (parentId) {
          const subComponent = manager.create(AssessmentSubComponent, {
            id: UUID.v4(),
            code,
            name,
            description,
            assessmentId,
            componentId: parentId,
            translations,
            templateSubComponentId: id,
          });
          templateSubComponentId[id] = subComponent.id;
          assessmentSubComponents.push(subComponent);
        }
      },
    );

    await manager.insert(AssessmentSubComponent, assessmentSubComponents);

    return { subComponents: assessmentSubComponents, templateSubComponentId };
  }
  async findAll(
    query: FindAllAssessmentSubComponentDto & { assessmentId: string },
  ): Promise<FindAllResponseDto<AssessmentSubComponent>> {
    return new QueryService<AssessmentSubComponent>(
      this.assessmentSubComponentRepository,
    )
      .join(query.include)
      .filter(this.filters(query), {
        fields: ['code', 'name'],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }
  async findOne(
    assessmentId: string,
    id: string,
    query: FindOneAssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id, assessmentId },
      relations: query.include,
    });

    if (!subComponent) {
      throw new NotFoundException(`Assessment sub-component ${id} not found.`);
    }

    return subComponent;
  }
  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.findOne(assessmentId, id, {
      include: ['measurementScales'],
    });
    try {
      const entity = {
        code: payload.code,
        name: payload.name,
        description: payload.description,
        translations: payload.translations,
      };
      await this.assessmentSubComponentRepository.update(
        { id, assessmentId },
        entity,
      );

      return { ...subComponent, ...entity };
    } catch (err) {
      this.loggerService.error(
        `Failed to update assessment sub-component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to update assessment sub-component',
      );
    }
  }
  async findPrimaryAnswer(
    subComponentId: string,
    userId: string,
    query: FindOnePrimaryAssessmentAnswerDto,
  ): Promise<AssessmentSubComponentAnswer> {
    const qb = this.subComponentAnswerRepository.createQueryBuilder('sca');
    if (query.include?.includes('answer')) {
      qb.leftJoinAndSelect('sca.answer', 'answer');
    } else {
      qb.innerJoin('sca.answer', 'answer');
    }
    if (query.include?.includes('measurementScale')) {
      qb.leftJoinAndSelect('sca.measurementScale', 'measurementScale');
    }
    if (query.include?.includes('subComponent')) {
      qb.leftJoinAndSelect('sca.subComponent', 'subComponent');
    }
    qb.where('sca.subComponentId = :subComponentId', { subComponentId })
      .andWhere('sca.deletedAt IS NULL')
      .andWhere('answer.deletedAt IS NULL')
      .andWhere('answer.userId = :userId', { userId })
      .andWhere('answer.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('answer.groupId IS NULL'); // ENFORCE: only true primary answers

    const result = await qb.getOne();
    if (!result) {
      throw new NotFoundException(
        'No primary answer found for this sub-component',
      );
    }
    return result;
  }

  async getSubComponentAnswer(
    assessmentId: string,
    subComponentId: string,
    user: AssessmentAbilityDto,
    query: FindAllAssessmentAnswerDto,
  ): Promise<AssessmentSubComponentAnswer> {
    const qb = this.subComponentAnswerRepository
      .createQueryBuilder('sca')
      .innerJoin('sca.answer', 'answer')
      .where('sca.subComponentId = :subComponentId', { subComponentId })
      .andWhere('answer.assessmentId = :assessmentId', { assessmentId })
      .andWhere('sca.deletedAt IS NULL')
      .andWhere('answer.deletedAt IS NULL');

    if (query.include?.includes('measurementScale')) {
      qb.leftJoinAndSelect('sca.measurementScale', 'measurementScale');
    }

    if (user.assessmentRole === MemberRole.TEAM_LEADER) {
      // For TEAM_LEADER, return the latest answer for the group (not user-specific)
      qb.andWhere('answer.groupId = :groupId', { groupId: user.assessmentGroupId });
      qb.andWhere('answer.isPrimary = false'); // ENFORCE: only group answers
      qb.orderBy('sca.createdAt', 'DESC').addOrderBy('sca.id', 'DESC');
      const result = await qb.getOne();
      if (!result) {
        throw new NotFoundException('No group answer found for this sub-component');
      }
      return result;
    } else if (user.assessmentRole === MemberRole.PRIMARY) {
      // If PRIMARY and acting as a team leader (has assessmentGroupId), return group answer
      if (user.assessmentGroupId) {
        qb.andWhere('answer.groupId = :groupId', { groupId: user.assessmentGroupId });
        qb.andWhere('answer.isPrimary = false'); // ENFORCE: only group answers
      } else {
        // Otherwise, return primary answer
        qb.andWhere('answer.userId = :userId', { userId: user.id });
        qb.andWhere('answer.isPrimary = true');
        qb.andWhere('answer.groupId IS NULL'); // ENFORCE: only true primary answers
      }
      qb.orderBy('sca.createdAt', 'DESC').addOrderBy('sca.id', 'DESC');
      const result = await qb.getOne();
      if (!result) {
        throw new NotFoundException('No answer found for this sub-component');
      }
      return result;
    } else if (user.isAdmin) {
      // For ADMIN, return the latest group answer if groupId is present, else primary
      if (user.assessmentGroupId) {
        qb.andWhere('answer.groupId = :groupId', { groupId: user.assessmentGroupId });
        qb.andWhere('answer.isPrimary = false');
      } else {
        qb.andWhere('answer.isPrimary = true');
        qb.andWhere('answer.groupId IS NULL'); // ENFORCE: only true primary answers
      }
      qb.orderBy('sca.createdAt', 'DESC').addOrderBy('sca.id', 'DESC');
      const result = await qb.getOne();
      if (!result) {
        throw new NotFoundException('No answer found for this sub-component');
      }
      return result;
    }

    throw new NotFoundException('No answer found for this sub-component');
  }

  private filters(
    query: FindAllAssessmentSubComponentDto & { assessmentId?: string },
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

  async getFilledStatusByAssessment(
    assessmentId: string,
    user: any,
  ): Promise<{ ids: string[]; latest: any | null }> {
    const qb = this.subComponentAnswerRepository
      .createQueryBuilder('assessment_sub_component_answers')
      .innerJoinAndSelect(
        'assessment_sub_component_answers.subComponent',
        'assessment_sub_components',
      )
      .innerJoin('assessment_sub_component_answers.answer', 'answers')
      .where('answers.assessmentId = :assessmentId', { assessmentId })
      .andWhere('assessment_sub_component_answers.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL');

    const all = await qb
      .select([
        'assessment_sub_component_answers.subComponentId',
        'assessment_sub_components.code',
      ])
      .getRawMany();

    const uniqueMap = new Map<string, string>();
    for (const row of all) {
      if (!uniqueMap.has(row.assessment_sub_component_answers_subComponentId)) {
        uniqueMap.set(
          row.assessment_sub_component_answers_subComponentId,
          row.assessment_sub_components_code,
        );
      }
    }
    const ids = Array.from(uniqueMap.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id]) => id);

    const latest = await this.subComponentAnswerRepository
      .createQueryBuilder('assessment_sub_component_answers')
      .innerJoinAndSelect(
        'assessment_sub_component_answers.subComponent',
        'assessment_sub_components',
      )
      .innerJoin('assessment_sub_component_answers.answer', 'answers')
      .where('answers.assessmentId = :assessmentId', { assessmentId })
      .andWhere('assessment_sub_component_answers.deletedAt IS NULL')
      .andWhere('answers.deletedAt IS NULL')
      .orderBy('assessment_sub_component_answers.createdAt', 'DESC')
      .addOrderBy('assessment_sub_component_answers.id', 'DESC')
      .limit(1)
      .getOne();

    let latestResult: any = null;
    if (latest) {
      latestResult = {
        ...latest,
        subComponentId: latest.subComponentId,
        componentId: latest.componentId,
        subComponent: latest.subComponent,
      };
    }
    return { ids, latest: latestResult };
  }

  async findAllPrimaryAnswers(
    assessmentId: string,
  ): Promise<AssessmentSubComponentAnswer[]> {
    return this.subComponentAnswerRepository
      .createQueryBuilder('sca')
      .innerJoin('sca.answer', 'answer')
      .where('answer.assessmentId = :assessmentId', { assessmentId })
      .andWhere('answer.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('sca.deletedAt IS NULL')
      .andWhere('answer.deletedAt IS NULL')
      .getMany();
  }

  async getSubComponentRoadmapAnswer(
    assessmentId: string,
    subComponentId: string,
    user: AssessmentAbilityDto,
  ): Promise<AssessmentSubComponentRoadmap & { documentUrl?: string | null }> {
    // Find the user's primary roadmap for this assessment
    const roadmap = await this.roadmapRepository.findOne({
      where: { assessmentId, userId: user.id, isPrimary: true },
    });
    if (!roadmap) throw new NotFoundException('No roadmap found for user');

    // Find the roadmap answer for this sub-component
    const roadmapAnswer = await this.subComponentRoadmapRepository.findOne({
      where: { roadmapId: roadmap.id, subComponentId },
    });

    if (!roadmapAnswer)
      throw new NotFoundException('No roadmap answer for this sub-component');
    
    // Get the document URL if any documents exist
    const medias = await this.fileUploadService.getByEntity(
      'assessment_sub_component_roadmaps',
      roadmapAnswer.id,
    );

    const documentUrl = medias.length > 0 ? medias[0].url : null;
    
    return { ...roadmapAnswer, documentUrl };
  }

  /**
   * Calculate and update the averageRate for all answers in an assessment.
   * This should be called after answers are created/updated.
   */
  async updateAverageRatesForAssessment(assessmentId: string): Promise<void> {
    // Get all answers for this assessment
    const answers = await this.answerRepository.find({
      where: { assessmentId },
    });
    for (const answer of answers) {
      // Use a single aggregate query to compute the average rate for this answer
      const result = await this.subComponentAnswerRepository
        .createQueryBuilder('sca')
        .leftJoin('sca.measurementScale', 'ms')
        .select('AVG(ms.rate)', 'avg')
        .where('sca.answerId = :answerId', { answerId: answer.id })
        .getRawOne();
      const averageRate =
        result && result.avg !== null ? Number(result.avg) : undefined;
      await this.answerRepository.update(answer.id, { averageRate });
    }
  }

  /**
   * Get the averageRate for a given answerId
   */
  async getAverageRateForAnswer(answerId: string): Promise<number | null> {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
    });
    return answer?.averageRate ?? null;
  }

  /**
   * Efficiently update the averageRate for a single answerId
   */
  async updateAverageRateForAnswer(answerId: string): Promise<void> {
    const result = await this.subComponentAnswerRepository
      .createQueryBuilder('sca')
      .leftJoin('sca.measurementScale', 'ms')
      .select('AVG(ms.rate)', 'avg')
      .where('sca.answerId = :answerId', { answerId })
      .getRawOne();
    const averageRate =
      result && result.avg !== null ? Number(result.avg) : undefined;
    await this.answerRepository.update(answerId, { averageRate });
  }

  /**
   * Get the average of averageRate for all answers where isPrimary is true, assessment.countryId matches, and createdAt is in the given year
   */
  async getAverageRateForPrimaryAnswersByCountryAndYear(
    countryId: string,
    year: number,
  ): Promise<number | null> {
    const qb = this.answerRepository
      .createQueryBuilder('answer')
      .innerJoin('answer.assessment', 'assessment')
      .select('AVG(answer.averageRate)', 'avg')
      .where('answer.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('assessment.countryId = :countryId', { countryId })
      .andWhere('EXTRACT(YEAR FROM answer.createdAt) = :year', { year });
    const result = await qb.getRawOne();
    return result && result.avg !== null ? Number(result.avg) : null;
  }

  /**
   * Get the average of averageRate for all answers where isPrimary is true, country.subregion matches, and createdAt is in the given year
   */
  async getAverageRateForPrimaryAnswersBySubregionAndYear(subregion: string, year: number): Promise<number | null> {
    const qb = this.answerRepository.createQueryBuilder('answer')
      .innerJoin('answer.assessment', 'assessment')
      .innerJoin('assessment.country', 'country')
      .select('AVG(answer.averageRate)', 'avg')
      .where('answer.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('country.subregion = :subregion', { subregion })
      .andWhere('EXTRACT(YEAR FROM answer.createdAt) = :year', { year });
    const result = await qb.getRawOne();
    return result && result.avg !== null ? Number(result.avg) : null;
  }

  /**
   * Get the average of averageRate for all primary answers grouped by year, subregion, and country.
   * Each result includes year, subregion, country, and the average rate (rounded to nearest 0.5, max 5).
   */
  async getAverageRateForPrimaryAnswersGrouped(): Promise<Array<{ year: number; subregion: string | null; country: string; averageRate: number }>> {
    const qb = this.answerRepository.createQueryBuilder('answer')
      .innerJoin('answer.assessment', 'assessment')
      .innerJoin('assessment.country', 'country')
      .select([
        'EXTRACT(YEAR FROM answer.createdAt) AS year',
        'country.subregion AS subregion',
        'country.name AS country',
        'AVG(answer.averageRate) AS avg',
      ])
      .where('answer.isPrimary = :isPrimary', { isPrimary: true })
      .groupBy('year')
      .addGroupBy('country.subregion')
      .addGroupBy('country.name');
    const raw = await qb.getRawMany();
    // Map and round averageRate to nearest 0.5, max 5, and ensure it's always a number
    return raw.map(row => {
      let avg = row.avg !== null ? Number(row.avg) : 0;
      avg = Math.min(5, Math.round(avg * 2) / 2); // round to nearest 0.5, max 5
      return {
        year: Number(row.year),
        subregion: row.subregion,
        country: row.country,
        averageRate: avg,
      };
    });
  }

  /**
   * Get filled subcomponent IDs for a group or for primary
   * @param assessmentId string
   * @param groupId string | null (null for primary)
   * @param isPrimary boolean (true for primary, false for group)
   */
  async getFilledSubComponentIds(
    assessmentId: string,
    groupId: string | null,
    isPrimary: boolean
  ): Promise<string[]> {
    const qb = this.subComponentAnswerRepository
      .createQueryBuilder('sca')
      .innerJoin('sca.answer', 'answer')
      .innerJoin('answer.assessment', 'assessment')
      .where('assessment.id = :assessmentId', { assessmentId })
      .andWhere('answer.isPrimary = :isPrimary', { isPrimary })
      .andWhere('sca.deletedAt IS NULL')
      .andWhere('answer.deletedAt IS NULL');
    if (groupId) {
      qb.andWhere('answer.groupId = :groupId', { groupId });
    } else {
      qb.andWhere('answer.groupId IS NULL');
    }
    const results = await qb.select('DISTINCT sca.subComponentId', 'subComponentId').getRawMany();
    return results.map(r => r.subComponentId);
  }

  /**
   * Get the latest filled subcomponent answer for a group or for primary
   * @param assessmentId string
   * @param groupId string | null (null for primary)
   * @param isPrimary boolean (true for primary, false for group)
   */
  async getLatestFilledSubComponentAnswer(
    assessmentId: string,
    groupId: string | null,
    isPrimary: boolean
  ): Promise<AssessmentSubComponentAnswer | null> {
    const qb = this.subComponentAnswerRepository
      .createQueryBuilder('sca')
      .innerJoin('sca.answer', 'answer')
      .innerJoin('answer.assessment', 'assessment')
      .where('assessment.id = :assessmentId', { assessmentId })
      .andWhere('answer.isPrimary = :isPrimary', { isPrimary })
      .andWhere('sca.deletedAt IS NULL')
      .andWhere('answer.deletedAt IS NULL');
    if (groupId) {
      qb.andWhere('answer.groupId = :groupId', { groupId });
    } else {
      qb.andWhere('answer.groupId IS NULL');
    }
    return qb.orderBy('sca.createdAt', 'DESC').addOrderBy('sca.id', 'DESC').getOne();
  }
}
