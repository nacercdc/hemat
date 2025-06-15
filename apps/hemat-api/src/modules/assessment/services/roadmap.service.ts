import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Roadmap,
  Assessment,
  AssessmentAnswer,
  AssessmentMeasurementScale,
  AssessmentMember,
} from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole } from '@shared/enums';
import {
  RoadmapCreateRequestDto,
  RoadmapUpdateRequestDto,
  FindAllRoadmapDto,
  FindOneRoadmapDto,
} from '../dtos';

@Injectable()
export class RoadmapService {
  constructor(
    @InjectRepository(Roadmap)
    private readonly roadmapRepository: Repository<Roadmap>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentMember)
    private readonly memberRepository: Repository<AssessmentMember>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    query: FindAllRoadmapDto,
  ): Promise<FindAllResponseDto<Roadmap>> {
    await this.validateAssessment(assessmentId);
    return new QueryService<Roadmap>(this.roadmapRepository)
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    id: string,
    query: FindOneRoadmapDto,
  ): Promise<Roadmap> {
    await this.validateAssessment(assessmentId);
    const roadmap = await new QueryService<Roadmap>(this.roadmapRepository)
      .join(query.include)
      .getOne();
    if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);
    return roadmap;
  }

  async create(
    assessmentId: string,
    payload: RoadmapCreateRequestDto,
    userId: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id: payload.assessmentAnswerId, assessmentId },
      });
      if (!answer) throw new NotFoundException('Assessment answer not found');

      await this.validateMemberAccess(assessmentId, userId);

      const existingRoadmap = await manager.findOne(Roadmap, {
        where: {
          assessmentAnswerId: payload.assessmentAnswerId,
          subComponentId: payload.subComponentId,
          measurementScaleId: payload.measurementScaleId,
        },
      });
      if (existingRoadmap)
        throw new BadRequestException(
          'Roadmap with these details already exists',
        );

      const measurementScale = await manager.findOne(
        AssessmentMeasurementScale,
        {
          where: { id: payload.measurementScaleId },
        },
      );
      if (!measurementScale) {
        throw new NotFoundException('Measurement scale not found');
      }

      const roadmap = manager.create(Roadmap, {
        ...payload,
        currentState: measurementScale.rate,
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
      });
      return manager.save(Roadmap, roadmap);
    });
  }

  async update(
    assessmentId: string,
    id: string,
    payload: RoadmapUpdateRequestDto,
    userId: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const roadmap = await manager.findOne(Roadmap, {
        where: { id, assessmentAnswer: { assessmentId } },
        relations: ['assessmentAnswer'],
      });
      if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);
      await this.validateMemberAccess(assessmentId, userId);

      if (payload.assessmentAnswerId) {
        const answer = await manager.findOne(AssessmentAnswer, {
          where: { id: payload.assessmentAnswerId, assessmentId },
        });
        if (!answer) throw new NotFoundException('Assessment answer not found');
      }

      let currentState = roadmap.currentState;
      if (payload.measurementScaleId) {
        const measurementScale = await manager.findOne(
          AssessmentMeasurementScale,
          {
            where: { id: payload.measurementScaleId },
          },
        );
        if (!measurementScale) {
          throw new NotFoundException('Measurement scale not found');
        }
        currentState = measurementScale.rate;
      }

      return manager.save(Roadmap, {
        ...roadmap,
        ...payload,
        currentState,
        startTime: payload.startTime
          ? new Date(payload.startTime)
          : roadmap.startTime,
        endTime: payload.endTime ? new Date(payload.endTime) : roadmap.endTime,
      });
    });
  }

  async delete(
    assessmentId: string,
    id: string,
    userId: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const roadmap = await manager.findOne(Roadmap, {
        where: { id, assessmentAnswer: { assessmentId } },
        relations: ['assessmentAnswer'],
      });
      if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);

      await this.validateMemberAccess(assessmentId, userId);

      return manager.softRemove(Roadmap, roadmap);
    });
  }

  async restore(
    assessmentId: string,
    id: string,
    userId: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const roadmap = await manager.findOne(Roadmap, {
        where: { id, assessmentAnswer: { assessmentId } },
        withDeleted: true,
        relations: ['assessmentAnswer'],
      });
      if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);

      await this.validateMemberAccess(assessmentId, userId);

      return manager.recover(Roadmap, roadmap);
    });
  }

  private async validateAssessment(assessmentId: string) {
    if (
      !(await this.assessmentRepository.exists({ where: { id: assessmentId } }))
    ) {
      throw new NotFoundException('Assessment not found');
    }
  }

  private async validateMemberAccess(
    assessmentId: string,
    userId: string,
    requiredRole: MemberRole = MemberRole.PRIMARY,
  ) {
    const member = await this.memberRepository.findOne({
      where: { assessmentId, userId },
    });
    if (!member) {
      throw new NotFoundException('Assessment member not found');
    }
    if (member.role !== requiredRole) {
      throw new BadRequestException(
        `Only ${requiredRole} role members can perform this action`,
      );
    }
    return member;
  }
}
