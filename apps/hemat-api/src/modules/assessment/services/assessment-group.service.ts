import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import {
  AssessmentGroup,
  Assessment,
  AssessmentDomain,
} from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllResponseDto } from '@shared/dtos';
import {
  AssessmentGroupUpdateRequestDto,
  FindAllAssessmentGroupDto,
  FindOneAssessmentGroupDto,
} from '../dtos';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { MemberRole } from '@shared/enums';

@Injectable()
export class AssessmentGroupService {
  private readonly logger = new Logger(AssessmentGroupService.name);

  constructor(
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentDomain)
    private readonly domainRepository: Repository<AssessmentDomain>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    assessmentId: string,
    query: FindAllAssessmentGroupDto,
  ): Promise<FindAllResponseDto<AssessmentGroup>> {
    try {
      const allowedIncludes = [
        'members',
        'members.user',
        'invitations',
        'assessment',
        'domains'
      ];
      let requestedIncludes = query.include.filter((inc) => allowedIncludes.includes(inc));
      if (requestedIncludes.includes('members.user')) {
        requestedIncludes = requestedIncludes.filter((inc) => inc !== 'members');
      }
      const queryService = new QueryService<AssessmentGroup>(this.groupRepository)
        .join(requestedIncludes)
        .filter([{ field: 'assessmentId', operator: '=', value: assessmentId }])
        .filter([], { fields: ['name'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip);

      if (query.filterByGroupIds && query.filterByGroupIds.length > 0) {
        queryService.filter([
          { field: 'id', operator: 'IN', value: query.filterByGroupIds },
        ]);
      }

      return await queryService.getManyAndCount();
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
      const allowedIncludes = [
        'members',
        'members.user',
        'invitations',
        'assessment',
        'domains'
      ];
      let requestedIncludes = query.include.filter((inc) => allowedIncludes.includes(inc));
      if (requestedIncludes.includes('members.user')) {
        requestedIncludes = requestedIncludes.filter((inc) => inc !== 'members');
      }
      const group = await new QueryService<AssessmentGroup>(this.groupRepository)
        .join(requestedIncludes)
        .filter([
          { field: 'id', operator: '=', value: id },
          { field: 'assessmentId', operator: '=', value: assessmentId },
        ])
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
        // Update domains association
        if (payload.domainIds && Array.isArray(payload.domainIds)) {
          const domains = await manager
            .getRepository(AssessmentDomain)
            .findByIds(payload.domainIds);
          group.domains = domains as AssessmentDomain[];
        }
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

  async attachDomains(
    assessmentId: string,
    groupId: string,
    domainIds: string[],
    user: AssessmentAbilityDto,
  ): Promise<AssessmentGroup> {
    if (!user) {
      throw new BadRequestException('User context is missing');
    }
    this.logger.log(`attachDomains: userId=${user.id}, assessmentRole=${user.assessmentRole}, isAdmin=${user.isAdmin}`);
    if (!user.isAdmin) {
      // Enforce: Only admins or PRIMARYs can assign domains
      // Accept both enum and string value for robustness
      const role = String(user.assessmentRole);
      if (role !== MemberRole.PRIMARY && role !== 'primary') {
        throw new BadRequestException(
          'Only admins or PRIMARYs can assign domains to a group',
        );
      }
    }
    return this.dataSource.transaction(async (manager) => {
      // Professional: Only PRIMARYs and admins should be able to assign domains to groups. This should be enforced at the controller/guard level.
      // Validate group exists and belongs to assessment
      const group = await manager.getRepository(AssessmentGroup).findOne({
        where: { id: groupId, assessmentId },
        relations: ['domains'],
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      // Validate all domains exist and belong to the assessment
      const domains = await manager
        .getRepository(AssessmentDomain)
        .findByIds(domainIds);
      if (domains.length !== domainIds.length) {
        throw new BadRequestException('One or more domains not found');
      }
      for (const domain of domains) {
        if (domain.assessmentId !== assessmentId) {
          throw new BadRequestException(
            'Domain does not belong to this assessment',
          );
        }
      }
      // Professional: Log the domain assignment for traceability
      this.logger.log(
        `Assigning domains [${domainIds.join(', ')}] to group ${groupId} in assessment ${assessmentId}`,
      );
      group.domains = domains;
      return await manager.getRepository(AssessmentGroup).save(group);
    });
  }
}
