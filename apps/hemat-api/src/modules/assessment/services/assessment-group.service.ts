import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { AssessmentGroup, Assessment } from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import {
  AssessmentGroupUpdateRequestDto,
  FindAllAssessmentGroupDto,
  FindOneAssessmentGroupDto,
} from '../dtos';

@Injectable()
export class AssessmentGroupService {
  private readonly logger = new Logger(AssessmentGroupService.name);

  constructor(
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    query: FindAllAssessmentGroupDto,
  ): Promise<FindAllResponseDto<AssessmentGroup>> {
    try {
      return await new QueryService<AssessmentGroup>(this.groupRepository)
        .filter([{ field: 'assessmentId', operator: '=', value: assessmentId }])
        .join(query.include)
        .filter([], { fields: ['name'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment groups: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve assessment groups');
    }
  }

  async findOne(
    assessmentId: string,
    id: string,
    query: FindOneAssessmentGroupDto,
  ): Promise<AssessmentGroup> {
    try {
      const group = await new QueryService<AssessmentGroup>(
        this.groupRepository,
      )
        .filter([
          { field: 'id', operator: '=', value: id },
          { field: 'assessmentId', operator: '=', value: assessmentId },
        ])
        .join(query.include)
        .getOne();

      if (!group) {
        throw new NotFoundException(`Assessment group ${id} not found`);
      }

      return group;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment group: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve assessment group');
    }
  }
  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentGroupUpdateRequestDto,
  ): Promise<AssessmentGroup> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const group = await manager.getRepository(AssessmentGroup).findOne({
          where: { id, assessmentId },
          relations: ['members', 'invitations'],
        });

        if (!group) {
          throw new NotFoundException(`Assessment group ${id} not found`);
        }

        const groupNameExists = await manager
          .getRepository(AssessmentGroup)
          .exists({
            where: {
              name: payload.name,
              assessmentId,
              id: Not(id),
            },
          });

        if (groupNameExists) {
          throw new BadRequestException(
            'Assessment group with this name already exists in the assessment',
          );
        }

        group.name = payload.name;
        return await manager.getRepository(AssessmentGroup).save(group);
      } catch (err) {
        this.logger.error(
          `Failed to update assessment group: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to update assessment group');
      }
    });
  }

  async delete(assessmentId: string, id: string): Promise<AssessmentGroup> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const group = await manager.getRepository(AssessmentGroup).findOne({
          where: { id, assessmentId },
          relations: ['members', 'invitations'],
        });

        if (!group) {
          throw new NotFoundException(`Assessment group ${id} not found`);
        }

        if (group.members?.length || group.invitations?.length) {
          throw new BadRequestException(
            'Cannot delete assessment group with members or pending invitations',
          );
        }

        await manager
          .getRepository(AssessmentGroup)
          .softDelete({ id, assessmentId });
        return group;
      } catch (err) {
        this.logger.error(
          `Failed to delete assessment group: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to delete assessment group');
      }
    });
  }

  async restore(assessmentId: string, id: string): Promise<AssessmentGroup> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const group = await manager.getRepository(AssessmentGroup).findOne({
          where: { id, assessmentId },
          withDeleted: true,
        });

        if (!group) {
          throw new NotFoundException(`Assessment group ${id} not found`);
        }

        await manager.getRepository(AssessmentGroup).recover(group);
        return group;
      } catch (err) {
        this.logger.error(
          `Failed to restore assessment group: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to restore assessment group');
      }
    });
  }
}
