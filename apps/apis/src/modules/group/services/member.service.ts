import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  AssessmentMember,
  Assessment,
  AssessmentGroup,
  User,
} from '../../../database/entities';
import { MemberCreateRequestDto, MemberUpdateRequestDto } from '../dtos';
import { CrudService } from '../../../shared/services';

@Injectable()
export class MemberService extends CrudService<AssessmentMember> {
  private readonly loggerService = new Logger(MemberService.name);

  constructor(
    @InjectRepository(AssessmentMember)
    private readonly memberRepository: Repository<AssessmentMember>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {
    super(memberRepository);
  }

  async create(payload: MemberCreateRequestDto): Promise<AssessmentMember> {
    try {
      // Validate assessment
      const assessment = await this.assessmentRepository.findOne({
        where: { id: payload.assessmentId },
      });
      if (!assessment) {
        throw new BadRequestException('Assessment not found');
      }

      // Validate group
      const group = await this.groupRepository.findOne({
        where: { id: payload.groupId },
        relations: ['members'],
      });
      if (!group) {
        throw new BadRequestException('Group not found');
      }

      // Validate group-assessment relationship via members
      const isGroupInAssessment = group.members?.some(
        (member) => member.assessmentId === payload.assessmentId,
      );
      if (group.members?.length && !isGroupInAssessment) {
        throw new BadRequestException(
          'Group does not belong to the specified assessment',
        );
      }

      // Validate user
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Check for duplicate member
      const existingMember = await this.memberRepository.findOne({
        where: {
          userId: payload.userId,
          assessmentId: payload.assessmentId,
          groupId: payload.groupId,
        },
      });
      if (existingMember) {
        throw new BadRequestException(
          'User is already a member of this group in the assessment',
        );
      }

      const member = await this.dataSource.transaction(async (manager) => {
        const newMember = manager.create(AssessmentMember, {
          userId: payload.userId,
          assessmentId: payload.assessmentId,
          groupId: payload.groupId,
          role: payload.role,
        });
        return manager.save(AssessmentMember, newMember);
      });

      return member;
    } catch (err) {
      this.loggerService.error('Failed to create member', err.stack || err);
      throw new BadRequestException(
        'Failed to create member: ' + (err.message || err),
      );
    }
  }

  async findByGroupId(groupId: string): Promise<AssessmentMember[]> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: groupId },
      });
      if (!group) {
        throw new BadRequestException('Group not found');
      }

      return this.memberRepository.find({
        where: { groupId },
        relations: ['user', 'assessment', 'group'],
      });
    } catch (err) {
      this.loggerService.error('Failed to retrieve members', err.stack || err);
      throw new BadRequestException(
        'Failed to retrieve members: ' + (err.message || err),
      );
    }
  }

  async update(
    where: { id: string },
    payload: MemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    try {
      const member = await this.memberRepository.findOne({
        where: { id: where.id },
        relations: ['user', 'assessment', 'group'],
      });
      if (!member) {
        throw new BadRequestException('Member not found');
      }

      if (payload.role) {
        member.role = payload.role;
      }

      const updatedMember = await this.memberRepository.save(member);
      return updatedMember;
    } catch (err) {
      this.loggerService.error('Failed to update member', err.stack || err);
      throw new BadRequestException(
        'Failed to update member: ' + (err.message || err),
      );
    }
  }

  async delete(where: { id: string }): Promise<AssessmentMember> {
    try {
      const member = await this.memberRepository.findOne({
        where: { id: where.id },
      });
      if (!member) {
        throw new BadRequestException('Member not found');
      }

      await this.memberRepository.softDelete({ id: where.id });
      return member;
    } catch (err) {
      this.loggerService.error('Failed to delete member', err.stack || err);
      throw new BadRequestException(
        'Failed to delete member: ' + (err.message || err),
      );
    }
  }
}
