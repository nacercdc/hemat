import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Roadmap,
  AssessmentSubComponentRoadmap,
  AssessmentSubComponent,
  Answer,
  AssessmentMeasurementScale,
  Assessment,
  AssessmentDomain,
  AssessmentComponent,
  AssessmentSubComponentAnswer,
} from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole, AnswerStatus } from '@shared/enums';
import { PercentageUtil } from '../utils';
import { AssessmentRoadmapValidator } from '../utils/assessment-roadmap.validator';
import {
  RoadmapCreateRequestDto,
  RoadmapUpdateRequestDto,
  FindAllRoadmapDto,
  FindOneRoadmapDto,
} from '../dtos';
import { RoadmapDomainProgress } from '../types/assessment-progress.type';

@Injectable()
export class AssessmentRoadmapService {
  constructor(
    @InjectRepository(Roadmap) private roadmapRepository: Repository<Roadmap>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    private dataSource: DataSource,
    private validator: AssessmentRoadmapValidator,
  ) {}

  async findAll(
    assessmentId: string,
    userId: string,
    query: FindAllRoadmapDto,
  ): Promise<FindAllResponseDto<Roadmap>> {
    await this.validateAssessment(assessmentId);
    const { role } = await this.validator.validateMembership(
      assessmentId,
      userId,
    );

    const queryService = new QueryService<Roadmap>(this.roadmapRepository)
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .filter([{ field: 'assessmentId', operator: '=', value: assessmentId }]);

    if (role !== MemberRole.PRIMARY) {
      queryService.filter([{ field: 'userId', operator: '=', value: userId }]);
    }

    return queryService.getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    userId: string,
    id: string,
    query: FindOneRoadmapDto,
  ): Promise<Roadmap> {
    await this.validateAssessment(assessmentId);
    const { role } = await this.validator.validateMembership(
      assessmentId,
      userId,
    );

    const queryService = new QueryService<Roadmap>(this.roadmapRepository)
      .join(query.include)
      .filter([{ field: 'id', operator: '=', value: id }]);

    if (role !== MemberRole.PRIMARY) {
      queryService.filter([{ field: 'userId', operator: '=', value: userId }]);
    }

    const roadmap = await queryService.getOne();
    if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);
    return roadmap;
  }

  async create(
    assessmentId: string,
    userId: string,
    payload: RoadmapCreateRequestDto,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      await this.validateAssessment(assessmentId);
      const member = await this.validator.validateMembership(
        assessmentId,
        userId,
        manager,
      );

      if (member.role !== MemberRole.PRIMARY) {
        throw new ForbiddenException('Only Primary role can submit roadmaps');
      }

      await this.validator.validateCreate(
        assessmentId,
        userId,
        member,
        payload,
        manager,
      );

      const subComponent = await manager.findOne(AssessmentSubComponent, {
        where: { id: payload.subComponentId, assessmentId },
      });
      if (!subComponent) {
        throw new BadRequestException(
          `Sub-component ${payload.subComponentId} does not belong to assessment ${assessmentId}`,
        );
      }

      const answer = await manager.findOne(Answer, {
        where: { id: payload.answerId, assessmentId, isPrimary: true },
      });
      if (!answer) {
        throw new BadRequestException(
          `Answer ${payload.answerId} is not primary Answer or does not belong to assessment ${assessmentId}`,
        );
      }

      const measurementScale = await manager.findOne(
        AssessmentMeasurementScale,
        {
          where: { id: payload.measurementScaleId },
        },
      );
      if (!measurementScale) {
        throw new NotFoundException(
          `Measurement scale ${payload.measurementScaleId} not found`,
        );
      }

      // If target is not provided, use measurementScale.rate as target
      const targetValue = payload.target ?? measurementScale.rate.toString();

      // For currentState, use the measurementScale rate of the answer's measurementScaleId from AssessmentSubComponentAnswer
      let currentState = measurementScale.rate;
      const subComponentAnswer = await manager.findOne(AssessmentSubComponentAnswer, {
        where: {
          answerId: payload.answerId,
          subComponentId: payload.subComponentId,
        },
      });
      if (subComponentAnswer && subComponentAnswer.measurementScaleId) {
        const answerMeasurementScale = await manager.findOne(AssessmentMeasurementScale, {
          where: { id: subComponentAnswer.measurementScaleId },
        });
        if (answerMeasurementScale) {
          currentState = answerMeasurementScale.rate;
        }
      }

      let roadmap = await manager.findOne(Roadmap, {
        where: { assessmentId, userId, isPrimary: true },
      });

      if (!roadmap) {
        roadmap = manager.create(Roadmap, {
          assessmentId,
          userId,
          isPrimary: true,
          status: AnswerStatus.INPROGRESS,
        });
        await manager.save(Roadmap, roadmap);
      }

      let subComponentRoadmap = await manager.findOne(
        AssessmentSubComponentRoadmap,
        {
          where: {
            roadmapId: roadmap.id,
            subComponentId: payload.subComponentId,
          },
        },
      );

      if (subComponentRoadmap) {
        Object.assign(subComponentRoadmap, {
          answerId: payload.answerId,
          measurementScaleId: payload.measurementScaleId,
          target: targetValue,
          currentState,
          activities: payload.activities,
          responsible: payload.responsible,
          resources: payload.resources,
          documentation: payload.documentation,
          startTime: new Date(payload.startTime),
          endTime: new Date(payload.endTime),
        });
      } else {
        subComponentRoadmap = manager.create(AssessmentSubComponentRoadmap, {
          roadmapId: roadmap.id,
          subComponentId: payload.subComponentId,
          answerId: payload.answerId,
          measurementScaleId: payload.measurementScaleId,
          target: targetValue,
          currentState,
          activities: payload.activities,
          responsible: payload.responsible,
          resources: payload.resources,
          documentation: payload.documentation,
          startTime: new Date(payload.startTime),
          endTime: new Date(payload.endTime),
        });
      }

      await manager.save(AssessmentSubComponentRoadmap, subComponentRoadmap);

      roadmap.percentage = await PercentageUtil.calculatePercentage(
        assessmentId,
        roadmap.id,
        manager,
        'Roadmap',
      );
      roadmap.status =
        roadmap.percentage === 100
          ? AnswerStatus.COMPLETED
          : AnswerStatus.INPROGRESS;
      await manager.save(Roadmap, roadmap);

      return roadmap;
    });
  }

  async update(
    assessmentId: string,
    userId: string,
    id: string,
    payload: RoadmapUpdateRequestDto,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      await this.validateAssessment(assessmentId);
      const roadmap = await manager.findOne(Roadmap, {
        where: { id, assessmentId, userId },
        relations: ['subComponentRoadmaps'],
      });
      if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);

      const member = await this.validator.validateMembership(
        assessmentId,
        userId,
        manager,
      );

      await this.validator.validateUpdate(id, member, payload);

      if (payload.answerId) {
        const answer = await manager.findOne(Answer, {
          where: { id: payload.answerId, assessmentId, isPrimary: true },
        });
        if (!answer) {
          throw new BadRequestException(
            `Answer ${payload.answerId} is not primary or does not belong to assessment ${assessmentId}`,
          );
        }
      }

      if (payload.subComponentId) {
        const subComponent = await manager.findOne(AssessmentSubComponent, {
          where: { id: payload.subComponentId, assessmentId },
        });
        if (!subComponent) {
          throw new BadRequestException(
            `Sub-component ${payload.subComponentId} does not belong to assessment ${assessmentId}`,
          );
        }
      }

      if (
        payload.subComponentId ||
        payload.answerId ||
        payload.measurementScaleId ||
        payload.target ||
        payload.activities ||
        payload.responsible ||
        payload.resources ||
        payload.documentation ||
        payload.startTime ||
        payload.endTime ||
        payload.currentState
      ) {
        const subComponentRoadmap = await manager.findOne(
          AssessmentSubComponentRoadmap,
          {
            where: {
              roadmapId: id,
              subComponentId:
                payload.subComponentId ||
                roadmap.subComponentRoadmaps[0]?.subComponentId,
            },
          },
        );
        if (!subComponentRoadmap) {
          throw new NotFoundException(
            `Sub-component roadmap not found for subComponentId ${payload.subComponentId || roadmap.subComponentRoadmaps[0]?.subComponentId}`,
          );
        }

        let currentState = subComponentRoadmap.currentState;
        if (payload.measurementScaleId) {
          const measurementScale = await manager.findOne(
            AssessmentMeasurementScale,
            {
              where: { id: payload.measurementScaleId },
            },
          );
          if (!measurementScale) {
            throw new NotFoundException(
              `Measurement scale ${payload.measurementScaleId} not found`,
            );
          }
          currentState = measurementScale.rate;
        } else if (payload.currentState) {
          currentState = payload.currentState;
        }

        Object.assign(subComponentRoadmap, {
          answerId: payload.answerId || subComponentRoadmap.answerId,
          subComponentId:
            payload.subComponentId || subComponentRoadmap.subComponentId,
          measurementScaleId:
            payload.measurementScaleId ||
            subComponentRoadmap.measurementScaleId,
          target: payload.target || subComponentRoadmap.target,
          currentState,
          activities: payload.activities || subComponentRoadmap.activities,
          responsible: payload.responsible || subComponentRoadmap.responsible,
          resources: payload.resources || subComponentRoadmap.resources,
          documentation:
            payload.documentation || subComponentRoadmap.documentation,
          startTime: payload.startTime
            ? new Date(payload.startTime)
            : subComponentRoadmap.startTime,
          endTime: payload.endTime
            ? new Date(payload.endTime)
            : subComponentRoadmap.endTime,
        });
        await manager.save(AssessmentSubComponentRoadmap, subComponentRoadmap);
      }

      roadmap.percentage = await PercentageUtil.calculatePercentage(
        assessmentId,
        roadmap.id,
        manager,
        'Roadmap',
      );
      roadmap.status =
        roadmap.percentage === 100
          ? AnswerStatus.COMPLETED
          : AnswerStatus.INPROGRESS;
      return manager.save(Roadmap, roadmap);
    });
  }

  private async validateAssessment(assessmentId: string) {
    if (
      !(await this.assessmentRepository.exists({ where: { id: assessmentId } }))
    ) {
      throw new NotFoundException('Assessment not found');
    }
  }

  /**
   * Get roadmap progress per domain for the primary roadmap of an assessment
   */
  async getProgress(
    assessmentId: string,
    userId: string,
    language: string = 'en',
  ): Promise<RoadmapDomainProgress[]> {
    const roadmap = await this.roadmapRepository.findOne({
      where: { assessmentId, userId, isPrimary: true },
    });

    // Get all domains for the assessment
    const domains: { id: string; name: string; subComponentCount: number }[] = await this.dataSource
      .getRepository(AssessmentDomain)
      .createQueryBuilder('domain')
      .where('domain.assessmentId = :assessmentId', { assessmentId })
      .leftJoin('domain.components', 'component')
      .leftJoin('component.subComponents', 'subComponent')
      .select('domain.id', 'id')
      .addSelect(
        `COALESCE(domain.translations->'${language}'->>'name', domain.name)`,
        'name',
      )
      .addSelect('COUNT(subComponent.id)::int', 'subComponentCount')
      .groupBy('domain.id')
      .addGroupBy('domain.name')
      .addGroupBy('domain.translations')
      .getRawMany();

    let filledMap = new Map<string, number>();
    if (roadmap) {
      // Get all subcomponent roadmap entries for this roadmap
      const subComponentRoadmaps = await this.dataSource
        .getRepository(AssessmentSubComponentRoadmap)
        .createQueryBuilder('scr')
        .leftJoin('scr.subComponent', 'subComponent')
        .leftJoin('subComponent.component', 'component')
        .where('scr.roadmapId = :roadmapId', { roadmapId: roadmap.id })
        .select('component.domainId', 'domainId')
        .addSelect('COUNT(scr.id)::int', 'filledCount')
        .groupBy('component.domainId')
        .getRawMany();

      filledMap = new Map<string, number>();
      for (const row of subComponentRoadmaps) {
        filledMap.set(row.domainId, Number(row.filledCount));
      }
    }

    // Build progress per domain
    return domains.map((domain) => {
      const filled = filledMap.get(domain.id) || 0;
      const percentage = domain.subComponentCount > 0 ? (filled * 100) / domain.subComponentCount : 0;
      return {
        id: domain.id,
        name: domain.name,
        percentage,
      };
    });
  }

  /**
   * Get filled status for roadmap sub-components for an assessment
   */
  async getFilledStatusByAssessment(
    assessmentId: string,
    userId: string,
  ): Promise<{ ids: string[]; latest: AssessmentSubComponentRoadmap | null }> {
    // Get the primary roadmap for this assessment and user
    const roadmap = await this.roadmapRepository.findOne({
      where: { assessmentId, userId, isPrimary: true },
    });
    if (!roadmap) {
      return { ids: [], latest: null };
    }

    // Get all filled subComponentRoadmaps for this roadmap
    const all = await this.dataSource
      .getRepository(AssessmentSubComponentRoadmap)
      .createQueryBuilder('scr')
      .where('scr.roadmapId = :roadmapId', { roadmapId: roadmap.id })
      .andWhere('scr.deletedAt IS NULL')
      .select(['scr.subComponentId'])
      .getRawMany();

    const uniqueIds = Array.from(new Set(all.map(row => row.scr_subComponentId)));

    // Get the latest roadmap entry for this roadmap
    const latest = await this.dataSource
      .getRepository(AssessmentSubComponentRoadmap)
      .createQueryBuilder('scr')
      .where('scr.roadmapId = :roadmapId', { roadmapId: roadmap.id })
      .andWhere('scr.deletedAt IS NULL')
      .orderBy('scr.createdAt', 'DESC')
      .addOrderBy('scr.id', 'DESC')
      .leftJoinAndSelect('scr.subComponent', 'subComponent')
      .leftJoinAndSelect('scr.answer', 'answer')
      .leftJoinAndSelect('scr.measurementScale', 'measurementScale')
      .limit(1)
      .getOne();

    return { ids: uniqueIds, latest };
  }
}
