import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AssessmentMember } from '@database/entities';
import { MemberRole } from '@shared/enums';
import { RoadmapCreateRequestDto, RoadmapUpdateRequestDto } from '../dtos';

@Injectable()
export class RoadmapValidator {
  constructor(private dataSource: DataSource) {}

  async validateMembership(
    assessmentId: string,
    userId: string,
    manager = this.dataSource.manager,
  ): Promise<AssessmentMember> {
    const member = await manager.findOne(AssessmentMember, {
      where: { assessmentId, userId },
    });
    if (!member) {
      throw new BadRequestException(
        `User ${userId} is not a member of assessment ${assessmentId}`,
      );
    }
    if (member.role !== MemberRole.PRIMARY) {
      throw new BadRequestException(
        `User ${userId} must have PRIMARY role to create or update roadmaps`,
      );
    }
    return member;
  }

  async validateCreate(
    assessmentId: string,
    userId: string,
    member: AssessmentMember,
    payload: RoadmapCreateRequestDto,
    manager: DataSource['manager'],
  ): Promise<void> {
    if (member.role !== MemberRole.PRIMARY) {
      throw new BadRequestException(`User ${userId} cannot submit roadmaps`);
    }
  }

  async validateUpdate(
    id: string,
    member: AssessmentMember,
    payload: RoadmapUpdateRequestDto,
  ): Promise<void> {
    if (member.role !== MemberRole.PRIMARY) {
      throw new BadRequestException(
        `User  is not authorized to update roadmaps`,
      );
    }
  }
}
