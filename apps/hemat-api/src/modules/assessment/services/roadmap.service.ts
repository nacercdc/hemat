import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Roadmap,
  AssessmentAnswer,
  Assessment,
  AssessmentSubComponent,
  AssessmentMeasurementScale,
  User,
  AssessmentGroup,
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
  private readonly logger = new Logger(RoadmapService.name);

  constructor(
    @InjectRepository(Roadmap)
    private readonly roadmapRepository: Repository<Roadmap>,
    @InjectRepository(AssessmentAnswer)
    private readonly assessmentAnswerRepository: Repository<AssessmentAnswer>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    @InjectRepository(AssessmentSubComponent)
    private readonly subComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentMeasurementScale)
    private readonly measurementScaleRepository: Repository<AssessmentMeasurementScale>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly assessmentMemberService: AssessmentMemberService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    groupId: string,
    query: FindAllRoadmapDto,
  ): Promise<FindAllResponseDto<Roadmap>> {
    try {
      const assessment = await this.assessmentRepository.exists({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const members = await this.assessmentMemberService.findAll(
        assessmentId,
        groupId,
        {
          include: [],
          take: 1,
          ascending: [],
          descending: [],
          search: '',
          skip: 0,
        },
      );
      if (!members.data.length) {
        throw new NotFoundException(
          'Assessment group not found or no members in group',
        );
      }

      return await new QueryService<Roadmap>(this.roadmapRepository)
        .filter([
          {
            field: 'assessmentAnswer.assessmentId',
            operator: '=',
            value: assessmentId,
          },
        ])
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
    } catch (err) {
      this.logger.error(
        `Failed to retrieve roadmaps: ${err.message}`,
        err.stack,
      );
      throw err instanceof NotFoundException
        ? err
        : new BadRequestException('Failed to retrieve roadmaps');
    }
  }
  async findOne(
    assessmentId: string,
    groupId: string,
    id: string,
    query: FindOneRoadmapDto,
  ): Promise<Roadmap> {
    try {
      const assessment = await this.assessmentRepository.exists({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const members = await this.assessmentMemberService.findAll(
        assessmentId,
        groupId,
        {
          include: [],
          take: 1,
          ascending: [],
          descending: [],
          search: '',
          skip: 0,
        },
      );
      if (!members.data.length) {
        throw new NotFoundException(
          'Assessment group not found or no members in group',
        );
      }

      const roadmap = await new QueryService<Roadmap>(this.roadmapRepository)
        .filter([
          { field: 'id', operator: '=', value: id },
          {
            field: 'assessmentAnswer.assessmentId',
            operator: '=',
            value: assessmentId,
          },
        ])
        .join(query.include)
        .getOne();

      if (!roadmap) {
        throw new NotFoundException(`Roadmap ${id} not found`);
      }

      return roadmap;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve roadmap: ${err.message}`,
        err.stack,
      );
      throw err instanceof NotFoundException
        ? err
        : new BadRequestException('Failed to retrieve roadmap');
    }
  }
  async create(
    assessmentId: string,
    groupId: string,
    payload: RoadmapCreateRequestDto,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const assessmentAnswer = await manager.findOne(AssessmentAnswer, {
          where: { id: payload.assessmentAnswerId, assessmentId },
          relations: ['user'],
        });
        if (!assessmentAnswer) {
          throw new NotFoundException('Assessment answer not found');
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, assessmentAnswer.userId, {
            include: [],
          })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can create roadmaps',
          );
        }

        const subComponent = await manager.findOne(AssessmentSubComponent, {
          where: { id: payload.subComponentId, assessmentId },
        });
        if (!subComponent) {
          throw new NotFoundException('Sub-component not found');
        }

        const measurementScale = await manager.findOne(
          AssessmentMeasurementScale,
          {
            where: { id: payload.measurementScaleId, assessmentId },
          },
        );
        if (!measurementScale) {
          throw new NotFoundException('Measurement scale not found');
        }

        const existingRoadmap = await manager.findOne(Roadmap, {
          where: {
            assessmentAnswerId: payload.assessmentAnswerId,
            subComponentId: payload.subComponentId,
            measurementScaleId: payload.measurementScaleId,
          },
        });
        if (existingRoadmap) {
          throw new BadRequestException(
            'Roadmap with these details already exists',
          );
        }

        const roadmap = manager.create(Roadmap, {
          ...payload,
          startTime: new Date(payload.startTime),
          endTime: new Date(payload.endTime),
        });

        return await manager.save(Roadmap, roadmap);
      } catch (err) {
        this.logger.error(
          `Failed to create roadmap: ${err.message}`,
          err.stack,
        );
        if (err.code === '23505') {
          throw new BadRequestException(
            'Roadmap with these details already exists',
          );
        }
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to create roadmap');
      }
    });
  }

  async update(
    assessmentId: string,
    groupId: string,
    id: string,
    payload: RoadmapUpdateRequestDto,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const roadmap = await manager.findOne(Roadmap, {
          where: { id, assessmentAnswer: { assessmentId } },
          relations: [
            'assessmentAnswer',
            'assessmentAnswer.user',
            'subComponent',
            'measurementScale',
          ],
        });
        if (!roadmap) {
          throw new NotFoundException(`Roadmap ${id} not found`);
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, roadmap.assessmentAnswer.userId, {
            include: [],
          })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can update roadmaps',
          );
        }

        if (payload.assessmentAnswerId) {
          const assessmentAnswer = await manager.findOne(AssessmentAnswer, {
            where: { id: payload.assessmentAnswerId, assessmentId },
            relations: ['user'],
          });
          if (!assessmentAnswer) {
            throw new NotFoundException('Assessment answer not found');
          }
          const newMember = await this.assessmentMemberService
            .findOne(assessmentId, groupId, assessmentAnswer.userId, {
              include: [],
            })
            .catch(() => null);
          if (!newMember || newMember.role !== MemberRole.PRIMARY) {
            throw new BadRequestException(
              'Only primary role members can update roadmaps',
            );
          }
        }

        if (payload.subComponentId) {
          const subComponent = await manager.findOne(AssessmentSubComponent, {
            where: { id: payload.subComponentId, assessmentId },
          });
          if (!subComponent) {
            throw new NotFoundException('Sub-component not found');
          }
        }

        if (payload.measurementScaleId) {
          const measurementScale = await manager.findOne(
            AssessmentMeasurementScale,
            {
              where: { id: payload.measurementScaleId, assessmentId },
            },
          );
          if (!measurementScale) {
            throw new NotFoundException('Measurement scale not found');
          }
        }

        const updatedRoadmap = await manager.save(Roadmap, {
          ...roadmap,
          ...payload,
          startTime: payload.startTime
            ? new Date(payload.startTime)
            : roadmap.startTime,
          endTime: payload.endTime
            ? new Date(payload.endTime)
            : roadmap.endTime,
        });

        return updatedRoadmap;
      } catch (err) {
        this.logger.error(
          `Failed to update roadmap: ${err.message}`,
          err.stack,
        );
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to update roadmap');
      }
    });
  }

  async delete(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const roadmap = await manager.findOne(Roadmap, {
          where: { id, assessmentAnswer: { assessmentId } },
          relations: ['assessmentAnswer', 'assessmentAnswer.user'],
        });
        if (!roadmap) {
          throw new NotFoundException(`Roadmap ${id} not found`);
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, roadmap.assessmentAnswer.userId, {
            include: [],
          })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can delete roadmaps',
          );
        }

        return await manager.softRemove(Roadmap, roadmap);
      } catch (err) {
        this.logger.error(
          `Failed to delete roadmap: ${err.message}`,
          err.stack,
        );
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to delete roadmap');
      }
    });
  }

  async restore(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<Roadmap> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const roadmap = await manager.findOne(Roadmap, {
          where: { id, assessmentAnswer: { assessmentId } },
          withDeleted: true,
          relations: ['assessmentAnswer', 'assessmentAnswer.user'],
        });
        if (!roadmap) {
          throw new NotFoundException(`Roadmap ${id} not found`);
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, roadmap.assessmentAnswer.userId, {
            include: [],
          })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can restore roadmaps',
          );
        }

        return await manager.recover(Roadmap, roadmap);
      } catch (err) {
        this.logger.error(
          `Failed to restore roadmap: ${err.message}`,
          err.stack,
        );
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to restore roadmap');
      }
    });
  }
}
