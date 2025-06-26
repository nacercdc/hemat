import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Assessment, Language } from '@database/entities';
import { Filter, QueryService } from '@shared/services';
import {
  FindAllAssessmentDto,
  FindOneAssessmentDto,
  AssessmentCreateRequestDto,
  AssessmentUpdateRequestDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { AssessmentDomainService } from './assessment-domain.service';
import { AssessmentComponentService } from './assessment-component.service';
import { AssessmentSubComponentService } from './assessment-sub-component.service';
import { AssessmentMeasurementScaleService } from './assessment-measuremnt-scale.service';
import { AssessmentMeasurementScaleSubComponentService } from './assessment-measuremnt-scale-sub-component.service';
import { AssessmentMemberService } from './assessment-member.service';
import { AuthDto } from '@shared/modules';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly dataSource: DataSource,
    private readonly assessmentDomainService: AssessmentDomainService,
    private readonly assessmentComponentService: AssessmentComponentService,
    private readonly assessmentSubComponentService: AssessmentSubComponentService,
    private readonly assessmentMeasurementScaleService: AssessmentMeasurementScaleService,
    private readonly assessmentMeasurementScaleSubComponentService: AssessmentMeasurementScaleSubComponentService,
    private readonly assessmentMemberService: AssessmentMemberService,
  ) {}

  async findAll(
    query: FindAllAssessmentDto,
    user: AuthDto,
  ): Promise<FindAllResponseDto<Assessment>> {
    if (user.isAdmin) {
      return await new QueryService<Assessment>(this.assessmentRepository)
        .join([...(query.include || []), 'country', 'languages'])
        .filter(this.filters(query), { fields: ['name'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } else {
      // Only fetch assessments where user is a member
      const memberRecords = await this.assessmentMemberService.findByUser(user.id);
      const assessmentIds = memberRecords.map(m => m.assessmentId);
      if (!assessmentIds.length) return { data: [], total: 0 };
      return await new QueryService<Assessment>(this.assessmentRepository)
        .join([...(query.include || []), 'country', 'languages'])
        .filter([
          ...this.filters(query),
          { field: 'id', operator: 'IN' as const, value: assessmentIds },
        ], { fields: ['name'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    }
  }

  async findOne(id: string, query: FindOneAssessmentDto): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: [...(query.include || []), 'country', 'languages'],
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found.`);
    }

    return assessment;
  }

  async create(
    userId: string,
    payload: AssessmentCreateRequestDto,
  ): Promise<Assessment> {
    try {
      if (payload.endDate < payload.startDate) {
        throw new BadRequestException('End date cannot be before start date');
      }

      const languages = await this.languageRepository.find({
        where: { code: In(payload.languages) },
      });

      if (languages.length !== payload.languages.length) {
        throw new BadRequestException('One or more language codes are invalid');
      }

      const savedAssessment = await this.dataSource.transaction(
        async (manager) => {
          const assessment = manager.create(Assessment, {
            ...payload,
            userId,
            languages,
          });
          await manager.save(Assessment, assessment);

          const { templateDomainId } =
            await this.assessmentDomainService.create(manager, assessment.id);

          const { templateComponentId } =
            await this.assessmentComponentService.create(
              manager,
              assessment.id,
              templateDomainId,
            );

          const { templateSubComponentId } =
            await this.assessmentSubComponentService.create(
              manager,
              assessment.id,
              templateComponentId,
            );

          const { templateMeasurementScaleId } =
            await this.assessmentMeasurementScaleService.create(
              manager,
              assessment.id,
            );

          await this.assessmentMeasurementScaleSubComponentService.create(
            manager,
            templateSubComponentId,
            templateMeasurementScaleId,
          );

          return assessment;
        },
      );
      return savedAssessment;
    } catch (err) {
      this.logger.error('create:', err);
      throw new BadRequestException('Failed to create assessment.');
    }
  }

  async update(
    id: string,
    payload: AssessmentUpdateRequestDto,
  ): Promise<Assessment> {
    if (
      payload.endDate &&
      payload.startDate &&
      payload.endDate < payload.startDate
    ) {
      throw new BadRequestException('End date cannot be before start date');
    }

    return await this.dataSource.transaction(async (manager) => {
      const assessment = await manager.getRepository(Assessment).findOne({
        where: { id },
        relations: ['user', 'country', 'languages'],
      });

      if (!assessment) {
        throw new NotFoundException(`Assessment ${id} not found.`);
      }

      let languages = assessment.languages;
      if (payload.languages) {
        languages = await this.languageRepository.find({
          where: { code: In(payload.languages) },
        });
        if (languages.length !== payload.languages.length) {
          throw new BadRequestException(
            'One or more language codes are invalid',
          );
        }
      }

      const updatedPayload = {
        ...payload,
        startDate: payload.startDate ?? assessment.startDate,
        endDate: payload.endDate ?? assessment.endDate,
        languages,
      };

      const updatedAssessment = await manager.getRepository(Assessment).save({
        ...assessment,
        ...updatedPayload,
      });

      this.logger.log(`Updated assessment ${id}`);
      return updatedAssessment;
    });
  }

  async delete(id: string): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found.`);
    }

    return await this.assessmentRepository.softRemove(assessment);
  }

  async restore(id: string): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found.`);
    }

    return await this.assessmentRepository.recover(assessment);
  }

  async findAssessmentsByUser(userId: string): Promise<Assessment[]> {
    const memberRecords = await this.assessmentMemberService.findByUser(userId);
    const assessmentIds = memberRecords.map(m => m.assessmentId);
    if (!assessmentIds.length) return [];
    return this.assessmentRepository.find({ where: { id: In(assessmentIds) } });
  }

  async findUserRoleAndGroupInAssessment(assessmentId: string, userId: string): Promise<{ role: string, groupId: string }> {
    const member = await this.assessmentMemberService.findOne(assessmentId, userId, { include: [] });
    return { role: member.role, groupId: member.groupId };
  }

  async findOneWithMember(
    id: string,
    userId: string,
    query: FindOneAssessmentDto,
  ): Promise<any> {
    const assessment = await this.findOne(id, query);
    let member: { role: string | null, groupId: string | null } = { role: null, groupId: null };
    try {
      member = await this.findUserRoleAndGroupInAssessment(id, userId);
    } catch {
    }
    return { ...assessment, ...member };
  }

  private filters(query: FindAllAssessmentDto): Filter[] {
    const filters: Filter[] = [];
    if (query.status) {
      filters.push({
        field: 'status',
        operator: '=',
        value: query.status,
      });
    }

    return filters;
  }
}
