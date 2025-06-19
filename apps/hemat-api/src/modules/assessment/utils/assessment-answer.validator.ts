import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AssessmentMember, Answer } from '@database/entities';
import { MemberRole } from '@shared/enums';
import {
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
} from '../dtos';

@Injectable()
export class AssessmentAnswerValidator {
  constructor(private dataSource: DataSource) {}

  async validateMembership(
    assessmentId: string,
    userId: string,
    manager = this.dataSource.manager,
  ): Promise<AssessmentMember> {
    const member = await manager.findOne(AssessmentMember, {
      where: { assessmentId, userId },
    });
    if (!member)
      throw new BadRequestException(
        `User ${userId} is not a member of assessment ${assessmentId}`,
      );
    return member;
  }

  async validateCreate(
    assessmentId: string,
    userId: string,
    member: AssessmentMember,
    payload: AssessmentAnswerCreateRequestDto,
    manager: DataSource['manager'],
  ): Promise<void> {
    if (payload.isPrimary && member.role !== MemberRole.PRIMARY) {
      throw new BadRequestException(`User ${userId} cannot submit as PRIMARY`);
    }

    if (member.role === MemberRole.PRIMARY) {
      if (!payload.isPrimary && !member.groupId) {
        throw new BadRequestException(
          `User ${userId} is not assigned to a group for group answer`,
        );
      }
      // Removed the check for existing primary answer to allow multiple sub-component submissions
    } else if (member.role === MemberRole.TEAM_LEADER) {
      if (!member.groupId)
        throw new BadRequestException(
          `User ${userId} is not assigned to a group`,
        );
      if (payload.isPrimary)
        throw new BadRequestException(`Team leader cannot submit as PRIMARY`);
      const existingTeamLeaderAnswer = await manager.findOne(Answer, {
        where: { assessmentId, userId, isPrimary: false },
      });
      if (existingTeamLeaderAnswer)
        throw new BadRequestException(
          `Team leader has already submitted a group answer for this assessment`,
        );
    } else {
      throw new BadRequestException(
        `User ${userId} is not authorized to submit answers`,
      );
    }
  }

  async validateUpdate(
    id: string,
    member: AssessmentMember,
    payload: AssessmentAnswerUpdateRequestDto,
  ): Promise<void> {
    if (
      member.role !== MemberRole.PRIMARY &&
      member.role !== MemberRole.TEAM_LEADER
    ) {
      throw new BadRequestException(`User is not authorized to update`);
    }

    if (payload.isPrimary && member.role !== MemberRole.PRIMARY) {
      throw new BadRequestException(`User cannot update to isPrimary=true`);
    }
  }
}