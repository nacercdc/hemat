import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AssessmentMember,
  Assessment,
  AssessmentGroup,
  User,
} from '../../../database/entities';
import { QueryService } from '../../../shared/services';
import {
  AssessmentMemberCreateRequestDto,
  AssessmentMemberUpdateRequestDto,
  FindAllAssessmentMemberDto,
  FindOneAssessmentMemberDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';

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

  async findAll(
    assessmentId: string,
    groupId: string,
    query: FindAllAssessmentMemberDto,
  ): Promise<FindAllResponseDto<AssessmentMember>> {
    try {
      const assessment = await this.assessmentRepository.exists({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const group = await this.groupRepository.exists({
        where: { id: groupId, assessmentId },
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
      }

      return await new QueryService<AssessmentMember>(this.memberRepository)
        .filter([
          { field: 'assessmentId', operator: '=', value: assessmentId },
          { field: 'groupId', operator: '=', value: groupId },
        ])
        .join(query.include)
        .filter([], { fields: ['role'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error(
        `Failed to retrieve assessment members: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve assessment members');
    }
  }

  async findOne(
    assessmentId: string,
    groupId: string,
    id: string,
    query: FindOneAssessmentMemberDto,
  ): Promise<AssessmentMember> {
    try {
      const assessment = await this.assessmentRepository.exists({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      const group = await this.groupRepository.exists({
        where: { id: groupId, assessmentId },
      });
      if (!group) {
        throw new NotFoundException('Assessment group not found');
      }

      const member = await new QueryService<AssessmentMember>(
        this.memberRepository,
      )
        .filter([
          { field: 'id', operator: '=', value: id },
          { field: 'assessmentId', operator: '=', value: assessmentId },
          { field: 'groupId', operator: '=', value: groupId },
        ])
        .join(query.include)
        .getOne();

      if (!member) {
        throw new NotFoundException(`Assessment member ${id} not found`);
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

  async create(
    assessmentId: string,
    groupId: string,
    payload: AssessmentMemberCreateRequestDto,
  ): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager
          .getRepository(Assessment)
          .exists({ where: { id: assessmentId } });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const group = await manager
          .getRepository(AssessmentGroup)
          .exists({ where: { id: groupId, assessmentId } });
        if (!group) {
          throw new NotFoundException('Assessment group not found');
        }

        const user = await manager
          .getRepository(User)
          .exists({ where: { id: payload.userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const existingMember = await manager
          .getRepository(AssessmentMember)
          .exists({
            where: { userId: payload.userId, assessmentId, groupId },
          });
        if (existingMember) {
          throw new BadRequestException(
            'User is already a member of this assessment group',
          );
        }

        const newMember = manager.getRepository(AssessmentMember).create({
          userId: payload.userId,
          assessmentId,
          groupId,
          role: payload.role,
        });

        return await manager.getRepository(AssessmentMember).save(newMember);
      } catch (err) {
        this.logger.error(
          `Failed to create assessment member: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to create assessment member');
      }
    });
  }

  async update(
    assessmentId: string,
    groupId: string,
    id: string,
    payload: AssessmentMemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const member = await manager.getRepository(AssessmentMember).findOne({
          where: { id, groupId, assessmentId },
          relations: ['user', 'assessment', 'group'],
        });
        if (!member) {
          throw new NotFoundException(`Assessment member ${id} not found`);
        }

        member.role = payload.role ?? member.role;
        return await manager.getRepository(AssessmentMember).save(member);
      } catch (err) {
        this.logger.error(
          `Failed to update assessment member: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to update assessment member');
      }
    });
  }

  async delete(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const member = await manager.getRepository(AssessmentMember).findOne({
          where: { id, groupId, assessmentId },
          relations: ['user', 'assessment', 'group'],
        });
        if (!member) {
          throw new NotFoundException(`Assessment member ${id} not found`);
        }

        await manager
          .getRepository(AssessmentMember)
          .softDelete({ id, groupId, assessmentId });
        return member;
      } catch (err) {
        this.logger.error(
          `Failed to delete assessment member: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to delete assessment member');
      }
    });
  }

  async restore(
    assessmentId: string,
    groupId: string,
    id: string,
  ): Promise<AssessmentMember> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const member = await manager.getRepository(AssessmentMember).findOne({
          where: { id, groupId, assessmentId },
          withDeleted: true,
        });
        if (!member) {
          throw new NotFoundException(`Assessment member ${id} not found`);
        }

        await manager.getRepository(AssessmentMember).recover(member);
        return member;
      } catch (err) {
        this.logger.error(
          `Failed to restore assessment member: ${err.message}`,
          err.stack,
        );
        throw new BadRequestException('Failed to restore assessment member');
      }
    });
  }
}