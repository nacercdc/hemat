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
  AssessmentGroup,
  AssessmentAnswer,
} from '@database/entities';
import { QueryService } from '@shared/services';
import {
  RoadmapCreateRequestDto,
  RoadmapUpdateRequestDto,
  FindAllRoadmapDto,
  FindOneRoadmapDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole } from '@shared/enums';
import { AssessmentMemberService } from '@modules/assessment/services';

@Injectable()
export class RoadmapService {
  constructor(
    @InjectRepository(Roadmap)
    private readonly roadmapRepository: Repository<Roadmap>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    private readonly assessmentMemberService: AssessmentMemberService,
    private readonly dataSource: DataSource,
  ) {}

  private async validateAssessmentAndGroup(
    assessmentId: string,
    groupId: string,
  ) {
    if (
      !(await this.assessmentRepository.exists({ where: { id: assessmentId } }))
    ) {
      throw new NotFoundException('Assessment not found');
    }
    if (
      !(await this.groupRepository.exists({
        where: { id: groupId, assessmentId },
      }))
    ) {
      throw new NotFoundException('Assessment group not found');
    }
  }

  async findAll(
    assessmentId: string,
    groupId: string,
    query: FindAllRoadmapDto,
  ): Promise<FindAllResponseDto<Roadmap>> {
    await this.validateAssessmentAndGroup(assessmentId, groupId);
    return new QueryService<Roadmap>(this.roadmapRepository)
      .join(query.include)
      .filter([], {
        fields: [
          'target',
          'activities',
          'responsible',
          'resources',
          'documentation',
        ],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    groupId: string,
    id: string,
    query: FindOneRoadmapDto,
  ): Promise<Roadmap> {
    await this.validateAssessmentAndGroup(assessmentId, groupId);
    const roadmap = await new QueryService<Roadmap>(this.roadmapRepository)
      .join(query.include)
      .getOne();
    if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);
    return roadmap;
  }

  async create(
    assessmentId: string,
    groupId: string,
    payload: RoadmapCreateRequestDto,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const answer = await manager.findOne(AssessmentAnswer, {
        where: { id: payload.assessmentAnswerId, assessmentId },
      });
      if (!answer) throw new NotFoundException('Assessment answer not found');

      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        answer.userId,
        { include: [] },
      );
      if (member.role !== MemberRole.PRIMARY) {
        throw new BadRequestException(
          'Only primary role members can create roadmap',
        );
      }

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

      const roadmap = manager.create(Roadmap, {
        ...payload,
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
      });
      return manager.save(Roadmap, roadmap);
    });
  }

  async update(
    assessmentId: string,
    groupId: string,
    id: string,
    payload: RoadmapUpdateRequestDto,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const roadmap = await manager.findOne(Roadmap, {
        where: { id, assessmentAnswer: { assessmentId } },
        relations: ['assessmentAnswer'],
      });
      if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);

      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        roadmap.assessmentAnswer.userId,
        { include: [] },
      );
      if (member.role !== MemberRole.PRIMARY) {
        throw new BadRequestException(
          'Only primary role members can update roadmap',
        );
      }

      if (payload.assessmentAnswerId) {
        const answer = await manager.findOne(AssessmentAnswer, {
          where: { id: payload.assessmentAnswerId, assessmentId },
        });
        if (!answer) throw new NotFoundException('Assessment answer not found');
        const newMember = await this.assessmentMemberService.findOne(
          assessmentId,
          groupId,
          answer.userId,
          { include: [] },
        );
        if (newMember.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can update roadmap',
          );
        }
      }

      return manager.save(Roadmap, {
        ...roadmap,
        ...payload,
        startTime: payload.startTime
          ? new Date(payload.startTime)
          : roadmap.startTime,
        endTime: payload.endTime ? new Date(payload.endTime) : roadmap.endTime,
      });
    });
  }

  async delete(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const roadmap = await manager.findOne(Roadmap, {
        where: { id, assessmentAnswer: { assessmentId } },
        relations: ['assessmentAnswer'],
      });
      if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);

      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        roadmap.assessmentAnswer.userId,
        { include: [] },
      );
      if (member.role !== MemberRole.PRIMARY) {
        throw new BadRequestException(
          'Only primary role members can delete roadmap',
        );
      }

      return manager.softRemove(Roadmap, roadmap);
    });
  }

  async restore(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      const roadmap = await manager.findOne(Roadmap, {
        where: { id, assessmentAnswer: { assessmentId } },
        withDeleted: true,
        relations: ['assessmentAnswer'],
      });
      if (!roadmap) throw new NotFoundException(`Roadmap ${id} not found`);

      const member = await this.assessmentMemberService.findOne(
        assessmentId,
        groupId,
        roadmap.assessmentAnswer.userId,
        { include: [] },
      );
      if (member.role !== MemberRole.PRIMARY) {
        throw new BadRequestException(
          'Only primary role members can restore roadmap',
        );
      }

      return manager.recover(Roadmap, roadmap);
    });
  }
}