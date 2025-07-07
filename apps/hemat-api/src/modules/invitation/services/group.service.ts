import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AssessmentGroup } from '@database/entities';
import { GroupInvitationDto } from '../dtos';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  async validateGroups(
    assessmentId: string,
    groups: GroupInvitationDto[],
    existingGroups: AssessmentGroup[],
  ): Promise<void> {
    try {
      const groupTypes = new Set(
        groups.map((g) =>
          g.group === null ? 'null' : this.isUUID(g.group) ? 'uuid' : 'string',
        ),
      );
      if (groupTypes.size > 1) {
        throw new BadRequestException('Inconsistent group types');
      }
    } catch (err) {
      this.logger.error('validateGroups:', err);
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new BadRequestException('Failed to validate groups.');
    }
  }

  async resolveGroup(
    manager: EntityManager,
    assessmentId: string,
    groupInput: string | null,
    assessmentName: string,
    existingGroups: AssessmentGroup[],
    groupOffset: number,
  ): Promise<string> {
    try {
      if (groupInput === null) {
        if (existingGroups.length) {
          throw new BadRequestException('You must select an existing group or provide a new group name. Cannot use null for group after the first group is created.');
        }
        const newGroupName = `${assessmentName} Group 1`;
        if (existingGroups.some((g) => g.name === newGroupName)) {
          throw new BadRequestException(`Group ${newGroupName} already exists`);
        }
        const group = await manager.save(
          manager.create(AssessmentGroup, { name: newGroupName, assessmentId }),
        );
        return group.id;
      }

      if (this.isUUID(groupInput)) {
        const group =
          existingGroups.find((g) => g.id === groupInput) ||
          (await manager.findOne(AssessmentGroup, {
            where: { id: groupInput, assessmentId },
          }));
        if (!group) {
          throw new BadRequestException(`Group ${groupInput} not found`);
        }
        return group.id;
      }

      if (existingGroups.some((g) => g.name === groupInput)) {
        throw new BadRequestException(`Group ${groupInput} exists`);
      }
      const group = await manager.save(
        manager.create(AssessmentGroup, { name: groupInput, assessmentId }),
      );
      return group.id;
    } catch (err) {
      this.logger.error('resolveGroup:', err);
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new BadRequestException('Failed to resolve group.');
    }
  }

  private isUUID(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      str,
    );
  }
}
