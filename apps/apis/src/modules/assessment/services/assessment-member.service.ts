import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  AssessmentMember,
  Assessment,
  AssessmentGroup,
  User,
} from '../../../database/entities';
import {
  AssessmentMemberCreateRequestDto,
  AssessmentMemberUpdateRequestDto,
} from '../dtos/assessment-member.dto';

@Injectable()
export class AssessmentMemberService {
  private readonly logger = new Logger(AssessmentMemberService.name);

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
  ) {}

  async create(
    assessmentId: string,
    groupId: string,
    payload: AssessmentMemberCreateRequestDto,
  ): Promise<AssessmentMember> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const group = await this.groupRepository.findOne({
        where: { id: groupId, assessmentId },
        relations: ['members'],
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingMember = await this.memberRepository.findOne({
        where: {
          userId: payload.userId,
          assessmentId,
          groupId,
        },
      });
      if (existingMember) {
        throw new BadRequestException(
          'User is already a member of this assessment group',
        );
      }

      const member = await this.dataSource.transaction(async (manager) => {
        const newMember = manager.create(AssessmentMember, {
          userId: payload.userId,
          assessmentId,
          groupId,
          role: payload.role,
        });
        return manager.save(AssessmentMember, newMember);
      });

      return member;
    } catch (err) {
      this.logger.error(
        `Failed to create assessment member: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to create assessment member');
    }
  }

  async findOne(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentMember> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const group = await this.groupRepository.findOne({
        where: { id: groupId, assessmentId },
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
      }

      const member = await this.memberRepository.findOne({
        where: { id, groupId, assessmentId },
        relations: ['user', 'assessment', 'group'],
      });
      if (!member) {
        throw new NotFoundException('Assessment member not found');
      }

      return member;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment member: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve assessment member');
    }
  }

  async findAll(
    assessmentId: string,
    groupId: string,
  ): Promise<AssessmentMember[]> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const group = await this.groupRepository.findOne({
        where: { id: groupId, assessmentId },
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
      }

      return this.memberRepository.find({
        where: { groupId, assessmentId },
        relations: ['user', 'assessment', 'group'],
      });
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment members: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve assessment members');
    }
  }

  async update(
    assessmentId: string,
    groupId: string,
    id: string,
    payload: AssessmentMemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    try {
      const member = await this.memberRepository.findOne({
        where: { id, groupId, assessmentId },
        relations: ['user', 'assessment', 'group'],
      });
      if (!member) {
        throw new NotFoundException('Assessment member not found');
      }

      Object.assign(member, {
        role: payload.role ?? member.role,
      });

      return await this.memberRepository.save(member);
    } catch (err) {
      this.logger.error(
        `Failed to update assessment member: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment member');
    }
  }

  async delete(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentMember> {
    try {
      const member = await this.memberRepository.findOne({
        where: { id, groupId, assessmentId },
        relations: ['user', 'assessment', 'group'],
      });
      if (!member) {
        throw new NotFoundException('Assessment member not found');
      }

      await this.memberRepository.softDelete({ id, groupId, assessmentId });
      return member;
    } catch (err) {
      this.logger.error(
        `Failed to delete assessment member: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to delete assessment member');
    }
  }
}
