import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, IsNull } from 'typeorm';
import { Assessment, Language, AssessmentMember, Domain, Component, SubComponent, MeasurementScale } from '@database/entities';
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
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(AssessmentMember)
    private readonly assessmentMemberRepository: Repository<AssessmentMember>,
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    @InjectRepository(MeasurementScale)
    private readonly measurementScaleRepository: Repository<MeasurementScale>,
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
    user: AssessmentAbilityDto,
  ): Promise<FindAllResponseDto<Assessment>> {
    const queryBuilder = new QueryService<Assessment>(this.assessmentRepository)
      .join([...(query.include || []), 'country', 'languages'])
      .filter(this.filters(query), { fields: ['name'], value: query.search })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip);

    if (!user.isAdmin) {
      const memberships = await this.assessmentMemberRepository.find({
        where: { userId: user.id, deletedAt: IsNull() },
        select: ['assessmentId'],
      });
      this.logger.debug(
        `Memberships for user ${user.id}: ${JSON.stringify(memberships)}`,
      );
      const assessmentIds = memberships.map((m) => m.assessmentId);
      if (assessmentIds.length === 0) {
        this.logger.debug(`No memberships found for user ${user.id}`);
        return { data: [], total: 0 };
      }
      queryBuilder.filter([
        {
          field: 'id',
          operator: 'IN',
          value: assessmentIds,
        },
      ]);
    }

    return await queryBuilder.getManyAndCount();
  }

  async findOne(
    id: string,
    query: FindOneAssessmentDto,
    user: AssessmentAbilityDto,
  ): Promise<Assessment> {
    if (!user.isAdmin) {
      const membership = await this.assessmentMemberRepository.findOne({
        where: { assessmentId: id, userId: user.id, deletedAt: IsNull() },
      });
      this.logger.debug(
        `Membership for user ${user.id}, assessment ${id}: ${JSON.stringify(membership)}`,
      );
      if (!membership) {
        throw new NotFoundException(
          `Assessment ${id} not found or you are not a member.`,
        );
      }
    }

    const assessment = await this.assessmentRepository.findOne({
      where: { id, deletedAt: IsNull() },
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

      // Check for template existence
      const domainCount = await this.domainRepository.count({ where: { isActive: true } });
      if (domainCount === 0) {
        throw new BadRequestException('No template found for Domain. Please create a template first.');
      }
      const componentCount = await this.componentRepository.count({ where: { isActive: true } });
      if (componentCount === 0) {
        throw new BadRequestException('No template found for Component. Please create a template first.');
      }
      const subComponentCount = await this.subComponentRepository.count({ where: { isActive: true } });
      if (subComponentCount === 0) {
        throw new BadRequestException('No template found for SubComponent. Please create a template first.');
      }
      const measurementScaleCount = await this.measurementScaleRepository.count();
      if (measurementScaleCount === 0) {
        throw new BadRequestException('No template found for MeasurementScale. Please create a template first.');
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

    // Prevent update if any answers exist for this assessment
    const answerCount = await this.assessmentSubComponentService['answerRepository'].count({
      where: { assessmentId: id },
    });
    if (answerCount > 0) {
      throw new BadRequestException('Assessment cannot be updated after answers have been filled.');
    }

    return await this.dataSource.transaction(async (manager) => {
      const assessment = await manager.getRepository(Assessment).findOne({
        where: { id, deletedAt: IsNull() },
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
      where: { id, deletedAt: IsNull() },
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
