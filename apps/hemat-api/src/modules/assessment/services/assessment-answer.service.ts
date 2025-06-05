import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  AssessmentAnswer,
  Assessment,
  User,
  AssessmentSubComponent,
  AssessmentMeasurementScale,
} from '@database/entities';
import { QueryService } from '@shared/services';
import {
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
  FindAllAssessmentAnswerDto,
  FindOneAssessmentAnswerDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { MemberRole } from '@shared/enums';
import { AssessmentMemberService } from '@modules/assessment/services';

@Injectable()
export class AssessmentAnswerService {
  private readonly logger = new Logger(AssessmentAnswerService.name);

  constructor(
    @InjectRepository(AssessmentAnswer)
    private readonly assessmentAnswerRepository: Repository<AssessmentAnswer>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AssessmentSubComponent)
    private readonly subComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentMeasurementScale)
    private readonly measurementScaleRepository: Repository<AssessmentMeasurementScale>,
    private readonly assessmentMemberService: AssessmentMemberService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    groupId: string,
    query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<AssessmentAnswer>> {
    try {
      const assessment = await this.assessmentRepository.exists({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      // Validate groupId using AssessmentMemberService
      const members = await this.assessmentMemberService.findAll(
        assessmentId,
        groupId,
        {
          include: [],
          take: 1,
          ascending: [],
          descending: [],
          search: '',
          skip: 0
        },
      );
      if (!members.data.length) {
        throw new NotFoundException(
          'Assessment group not found or no members in group',
        );
      }

      return await new QueryService<AssessmentAnswer>(
        this.assessmentAnswerRepository,
      )
        .filter([{ field: 'assessmentId', operator: '=', value: assessmentId }])
        .join(query.include)
        .filter([], {
          fields: ['evidence', 'reference', 'notes'],
          value: query.search,
        })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment answers: ${err.message}`,
        err.stack,
      );
      throw err instanceof NotFoundException
        ? err
        : new BadRequestException('Failed to retrieve assessment answers');
    }
  }
  async findOne(
    assessmentId: string,
    groupId: string,
    id: string,
    query: FindOneAssessmentAnswerDto,
  ): Promise<AssessmentAnswer> {
    try {
      const assessment = await this.assessmentRepository.exists({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      // Validate groupId using AssessmentMemberService
      const members = await this.assessmentMemberService.findAll(
        assessmentId,
        groupId,
        {
          include: [],
          take: 1,
          ascending: [],
          descending: [],
          search: '',
          skip: 0
        },
      );
      if (!members.data.length) {
        throw new NotFoundException(
          'Assessment group not found or no members in group',
        );
      }

      const answer = await new QueryService<AssessmentAnswer>(
        this.assessmentAnswerRepository,
      )
        .filter([
          { field: 'id', operator: '=', value: id },
          { field: 'assessmentId', operator: '=', value: assessmentId },
        ])
        .join(query.include)
        .getOne();

      if (!answer) {
        throw new NotFoundException(`Assessment answer ${id} not found`);
      }

      return answer;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment answer: ${err.message}`,
        err.stack,
      );
      throw err instanceof NotFoundException
        ? err
        : new BadRequestException('Failed to retrieve assessment answer');
    }
  }
  async create(
    assessmentId: string,
    groupId: string,
    payload: AssessmentAnswerCreateRequestDto,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const user = await manager.findOne(User, {
          where: { id: payload.userId },
        });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, payload.userId, { include: [] })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can submit answers',
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

        const existingAnswer = await manager.findOne(AssessmentAnswer, {
          where: {
            assessmentId,
            subComponentId: payload.subComponentId,
            userId: payload.userId,
          },
        });
        if (existingAnswer) {
          throw new BadRequestException(
            'Answer already exists for this sub-component and user',
          );
        }

        const answer = manager.create(AssessmentAnswer, {
          ...payload,
          assessmentId,
        });

        return await manager.save(AssessmentAnswer, answer);
      } catch (err) {
        this.logger.error(
          `Failed to create assessment answer: ${err.message}`,
          err.stack,
        );
        if (err.code === '23505') {
          throw new BadRequestException(
            'Answer with these details already exists',
          );
        }
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to create assessment answer');
      }
    });
  }

  async update(
    assessmentId: string,
    groupId: string,
    id: string,
    payload: AssessmentAnswerUpdateRequestDto,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const answer = await manager.findOne(AssessmentAnswer, {
          where: { id, assessmentId },
          relations: ['user', 'subComponent', 'measurementScale'],
        });
        if (!answer) {
          throw new NotFoundException(`Assessment answer ${id} not found`);
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, answer.userId, { include: [] })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can update answers',
          );
        }

        if (payload.userId) {
          const user = await manager.findOne(User, {
            where: { id: payload.userId },
          });
          if (!user) {
            throw new NotFoundException('User not found');
          }
          const newMember = await this.assessmentMemberService
            .findOne(assessmentId, groupId, payload.userId, { include: [] })
            .catch(() => null);
          if (!newMember || newMember.role !== MemberRole.PRIMARY) {
            throw new BadRequestException(
              'Only primary role members can update answers',
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

        const updatedAnswer = await manager.save(AssessmentAnswer, {
          ...answer,
          ...payload,
        });

        return updatedAnswer;
      } catch (err) {
        this.logger.error(
          `Failed to update assessment answer: ${err.message}`,
          err.stack,
        );
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to update assessment answer');
      }
    });
  }

  async delete(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const answer = await manager.findOne(AssessmentAnswer, {
          where: { id, assessmentId },
        });
        if (!answer) {
          throw new NotFoundException(`Assessment answer ${id} not found`);
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, answer.userId, { include: [] })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can delete answers',
          );
        }

        return await manager.softRemove(AssessmentAnswer, answer);
      } catch (err) {
        this.logger.error(
          `Failed to delete assessment answer: ${err.message}`,
          err.stack,
        );
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to delete assessment answer');
      }
    });
  }

  async restore(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentAnswer> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const answer = await manager.findOne(AssessmentAnswer, {
          where: { id, assessmentId },
          withDeleted: true,
        });
        if (!answer) {
          throw new NotFoundException(`Assessment answer ${id} not found`);
        }

        const member = await this.assessmentMemberService
          .findOne(assessmentId, groupId, answer.userId, { include: [] })
          .catch(() => null);
        if (!member || member.role !== MemberRole.PRIMARY) {
          throw new BadRequestException(
            'Only primary role members can restore answers',
          );
        }

        return await manager.recover(AssessmentAnswer, answer);
      } catch (err) {
        this.logger.error(
          `Failed to restore assessment answer: ${err.message}`,
          err.stack,
        );
        throw err instanceof NotFoundException ||
          err instanceof BadRequestException
          ? err
          : new BadRequestException('Failed to restore assessment answer');
      }
    });
  }
}
