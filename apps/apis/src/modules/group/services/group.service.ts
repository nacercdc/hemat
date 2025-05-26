import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AssessmentGroup, Assessment } from '../../../database/entities';
import { GroupCreateRequestDto, GroupUpdateRequestDto } from '../dtos';
import { CrudService } from '../../../shared/services';

@Injectable()
export class GroupService extends CrudService<AssessmentGroup> {
  protected readonly loggerService = new Logger(GroupService.name);

  constructor(
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    private readonly dataSource: DataSource,
  ) {
    super(groupRepository);
  }

  async create(payload: GroupCreateRequestDto): Promise<AssessmentGroup> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: payload.assessmentId },
      });
      if (!assessment) {
        throw new BadRequestException('Assessment not found');
      }

      const existingGroup = await this.groupRepository
        .createQueryBuilder('group')
        .innerJoin('group.members', 'members')
        .where('group.name = :name', { name: payload.name })
        .andWhere('members.assessmentId = :assessmentId', {
          assessmentId: payload.assessmentId,
        })
        .getOne();
      if (existingGroup) {
        throw new BadRequestException(
          'Group with this name already exists in the assessment',
        );
      }

      const group = await this.dataSource.transaction(async (manager) => {
        const newGroup = manager.create(AssessmentGroup, {
          name: payload.name,
        });
        return manager.save(AssessmentGroup, newGroup);
      });

      return group;
    } catch (err) {
      this.loggerService.error('Failed to create group', err.stack || err);
      throw new BadRequestException(
        'Failed to create group: ' + (err.message || err),
      );
    }
  }

  async findByAssessmentId(assessmentId: string): Promise<AssessmentGroup[]> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new BadRequestException('Assessment not found');
      }

      const groups = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.members', 'members')
        .leftJoinAndSelect('group.invitations', 'invitations')
        .where('members.assessmentId = :assessmentId', { assessmentId })
        .orWhere('invitations.assessmentId = :assessmentId', { assessmentId })
        .getMany();

      return groups;
    } catch (err) {
      this.loggerService.error('Failed to retrieve groups', err.stack || err);
      throw new BadRequestException(
        'Failed to retrieve groups: ' + (err.message || err),
      );
    }
  }

  async update(
    where: { id: string },
    payload: GroupUpdateRequestDto,
  ): Promise<AssessmentGroup> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: where.id },
        relations: ['members', 'invitations'],
      });
      if (!group) {
        throw new BadRequestException('Group not found');
      }

      if (payload.name) {
        const members = group.members || [];
        const assessmentIds = [...new Set(members.map((m) => m.assessmentId))];
        if (assessmentIds.length > 0) {
          const existingGroup = await this.groupRepository
            .createQueryBuilder('group')
            .innerJoin('group.members', 'members')
            .where('group.name = :name', { name: payload.name })
            .andWhere('members.assessmentId IN (:...assessmentIds)', {
              assessmentIds,
            })
            .andWhere('group.id != :id', { id: where.id })
            .getOne();
          if (existingGroup) {
            throw new BadRequestException(
              'Group with this name already exists in the assessment',
            );
          }
        }
        group.name = payload.name;
      }

      const updatedGroup = await this.groupRepository.save(group);
      return updatedGroup;
    } catch (err) {
      this.loggerService.error('Failed to update group', err.stack || err);
      throw new BadRequestException(
        'Failed to update group: ' + (err.message || err),
      );
    }
  }

  async delete(where: { id: string }): Promise<AssessmentGroup> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: where.id },
        relations: ['members', 'invitations'],
      });
      if (!group) {
        throw new BadRequestException('Group not found');
      }

      if (group.members?.length || group.invitations?.length) {
        throw new BadRequestException(
          'Cannot delete group with members or pending invitations',
        );
      }

      await this.groupRepository.softDelete({ id: where.id });
      return group;
    } catch (err) {
      this.loggerService.error('Failed to delete group', err.stack || err);
      throw new BadRequestException(
        'Failed to delete group: ' + (err.message || err),
      );
    }
  }
}
