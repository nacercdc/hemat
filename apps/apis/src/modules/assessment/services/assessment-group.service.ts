import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { AssessmentGroup, Assessment } from '../../../database/entities';
import {
  AssessmentGroupRequestDto,
  AssessmentGroupUpdateRequestDto,
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

  async create(
    assessmentId: string,
    payload: AssessmentGroupRequestDto,
  ): Promise<AssessmentGroup> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const existingGroup = await this.groupRepository.findOne({
        where: {
          name: payload.name,
          assessmentId,
        },
        relations: ['members'],
      });
      if (existingGroup) {
        throw new BadRequestException(
          'Assessment group with this name already exists in the assessment',
        );
      }

      const group = await this.dataSource.transaction(async (manager) => {
        const newGroup = manager.create(AssessmentGroup, {
          name: payload.name,
          assessmentId,
        });
        return manager.save(AssessmentGroup, newGroup);
      });

      return group;
    } catch (err) {
      this.logger.error(
        `Failed to create assessment group: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to create assessment group');
    }
  }

  async findOne(assessmentId: string, id: string): Promise<AssessmentGroup> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const group = await this.groupRepository.findOne({
        where: { id, assessmentId },
        relations: ['members', 'invitations'],
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
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

  async findAll(assessmentId: string): Promise<AssessmentGroup[]> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      return this.groupRepository.find({
        where: { assessmentId },
        relations: ['members', 'invitations'],
      });
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment groups: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve assessment groups');
    }
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentGroupUpdateRequestDto,
  ): Promise<AssessmentGroup> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id, assessmentId },
        relations: ['members', 'invitations'],
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
      }

      if (payload.name) {
        const existingGroup = await this.groupRepository.findOne({
          where: {
            name: payload.name,
            assessmentId,
            id: Not(id),
          },
          relations: ['members'],
        });
        if (existingGroup) {
          throw new BadRequestException(
            'Assessment group with this name already exists in the assessment',
          );
        }
      }

      Object.assign(group, {
        name: payload.name ?? group.name,
      });

      return await this.groupRepository.save(group);
    } catch (err) {
      this.logger.error(
        `Failed to update assessment group: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment group');
    }
  }

  async delete(assessmentId: string, id: string): Promise<AssessmentGroup> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id, assessmentId },
        relations: ['members', 'invitations'],
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
      }

      if (group.members?.length || group.invitations?.length) {
        throw new BadRequestException(
          'Cannot delete assessment group with members or pending invitations',
        );
      }

      await this.groupRepository.softDelete({ id, assessmentId });
      return group;
    } catch (err) {
      this.logger.error(
        `Failed to delete assessment group: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to delete assessment group');
    }
  }
}
