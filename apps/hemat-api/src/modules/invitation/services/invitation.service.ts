import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, Not } from 'typeorm';
import {
  Invitation,
  Assessment,
  User,
  AssessmentMember,
  AssessmentGroup,
} from '@database/entities';
import {
  FindAllInvitationDto,
  FindOneInvitationDto,
  InvitationCreateBulkRequestDto,
  InvitationUpdateRequestDto,
} from '../dtos';
import { AssessmentMemberService } from '@modules/assessment/services';
import { InvitationStatus } from '@shared/enums';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { FindAllResponseDto } from '@shared/dtos';
import { QueryService } from '@shared/services';
import { GroupService } from './group.service';
import { AssessmentRoleService } from './assessment-role.service';
import { generateRandomToken } from '@shared/helpers/token.helper';
import { MemberRole } from '@shared/enums';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly memberService: AssessmentMemberService,
    private readonly groupService: GroupService,
    private readonly roleService: AssessmentRoleService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async createBulk(
    assessmentId: string,
    payload: InvitationCreateBulkRequestDto,
  ): Promise<Invitation[]> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException('Assessment not found');
        }

        const existingGroups = await manager.find(AssessmentGroup, {
          where: { assessmentId },
        });
        await this.groupService.validateGroups(
          assessmentId,
          payload,
          existingGroups,
        );

        const inviteEmails = payload.flatMap((g) =>
          g.invitations.map((i) => i.email),
        );
        const existingInvites = await manager.find(Invitation, {
          where: {
            email: In(inviteEmails),
            assessmentId,
            status: Not(InvitationStatus.EXPIRED),
          },
        });
        if (existingInvites.length) {
          throw new BadRequestException('Duplicate invitation email');
        }

        // Validate: no duplicate emails within the same group
        for (const group of payload) {
          const seen = new Set<string>();
          for (const invite of group.invitations) {
            if (seen.has(invite.email)) {
              throw new BadRequestException(`Duplicate invitation email '${invite.email}' in the same group is not allowed.`);
            }
            seen.add(invite.email);
          }
        }

        const invitations: Invitation[] = [];
        const processedGroupIds = new Set<string>();

        const newInvitations = await Promise.all(
          payload.map(
            async ({ group: groupInput, invitations: groupInvitations }) => {
              const groupId = await this.groupService.resolveGroup(
                manager,
                assessmentId,
                groupInput,
                assessment.name,
                existingGroups,
                processedGroupIds.size,
              );
              processedGroupIds.add(groupId);

              // Reject if both primary and team-leader are present in the same group
              const hasPrimary = groupInvitations.some(i => i.role === MemberRole.PRIMARY);
              const hasTeamLeader = groupInvitations.some(i => i.role === MemberRole.TEAM_LEADER);
              if (hasPrimary && hasTeamLeader) {
                throw new BadRequestException('A group cannot have both a primary and a team-leader at the same time.');
              }

              // DYNAMIC ROLE SWAP LOGIC
              for (const invite of groupInvitations) {
                if (invite.role === MemberRole.TEAM_LEADER) {
                  if (invite.promoteToPrimaryEmail) {
                    // Validate that the specified email matches an existing team leader
                    const existingTeamLeaderMember = await manager.findOne(AssessmentMember, {
                      where: { assessmentId, role: MemberRole.TEAM_LEADER },
                      relations: ['user'],
                    });

                    const existingTeamLeaderInvitation = await manager.findOne(Invitation, {
                      where: { 
                        assessmentId,
                        role: MemberRole.TEAM_LEADER,
                        email: invite.promoteToPrimaryEmail,
                        status: Not(InvitationStatus.EXPIRED)
                      }
                    });

                    // Check if the promoteToPrimaryEmail matches the team leader's email
                    const isValidTeamLeader = 
                      (existingTeamLeaderMember?.user?.email === invite.promoteToPrimaryEmail) ||
                      (existingTeamLeaderInvitation?.email === invite.promoteToPrimaryEmail);

                    if (!isValidTeamLeader) {
                      throw new BadRequestException(
                        'The specified email does not match any existing team leader in the assessment.'
                      );
                    }

                    // Check if trying to add team leader to a group that already has one
                    const groupTeamLeader = await manager.findOne(AssessmentMember, {
                      where: { assessmentId, groupId, role: MemberRole.TEAM_LEADER }
                    });

                    const groupTeamLeaderInvitation = await manager.findOne(Invitation, {
                      where: { 
                        assessmentId,
                        groupId,
                        role: MemberRole.TEAM_LEADER,
                        status: Not(InvitationStatus.EXPIRED)
                      }
                    });

                    if (groupTeamLeader || groupTeamLeaderInvitation) {
                      throw new BadRequestException(
                        'Cannot add team leader: Group already has a team leader role assigned.'
                      );
                    }

                    // If all validations pass, handle the role changes
                    // 1. Find and demote any existing primary in the assessment
                    const currentPrimaryMember = await manager.findOne(AssessmentMember, {
                      where: { assessmentId, role: MemberRole.PRIMARY },
                    });
                    if (currentPrimaryMember) {
                      await manager.update(
                        AssessmentMember,
                        { id: currentPrimaryMember.id },
                        { role: MemberRole.MEMBER }
                      );
                    }

                    // Also check for any primary in pending invitations
                    const currentPrimaryInvitation = await manager.findOne(Invitation, {
                      where: { 
                        assessmentId,
                        role: MemberRole.PRIMARY,
                        status: Not(InvitationStatus.EXPIRED)
                      }
                    });
                    if (currentPrimaryInvitation) {
                      await manager.update(
                        Invitation,
                        { id: currentPrimaryInvitation.id },
                        { role: MemberRole.MEMBER }
                      );
                    }

                    // 2. Promote the specified team leader to primary
                    if (existingTeamLeaderMember) {
                      await manager.update(
                        AssessmentMember,
                        { id: existingTeamLeaderMember.id },
                        { role: MemberRole.PRIMARY }
                      );
                    } else if (existingTeamLeaderInvitation) {
                      await manager.update(
                        Invitation,
                        { id: existingTeamLeaderInvitation.id },
                        { role: MemberRole.PRIMARY }
                      );
                    }
                  } else {
                    // Regular team-leader invitation - first check if group has a primary
                    const groupPrimary = await manager.findOne(AssessmentMember, {
                      where: { assessmentId, groupId, role: MemberRole.PRIMARY }
                    });

                    const groupPrimaryInvitation = await manager.findOne(Invitation, {
                      where: { 
                        assessmentId,
                        groupId,
                        role: MemberRole.PRIMARY,
                        status: Not(InvitationStatus.EXPIRED)
                      }
                    });

                    if (groupPrimary || groupPrimaryInvitation) {
                      throw new BadRequestException(
                        'Adding a team leader to a group with a primary requires promoteToPrimaryEmail parameter. Please specify which team leader should be promoted to primary.'
                      );
                    }

                    // Check for and downgrade any existing team-leader in this group
                    const existingTeamLeaderInvitation = await manager.findOne(Invitation, {
                      where: { 
                        assessmentId,
                        groupId,
                        role: MemberRole.TEAM_LEADER,
                        status: Not(InvitationStatus.EXPIRED)
                      }
                    });

                    const existingTeamLeaderMember = await manager.findOne(AssessmentMember, {
                      where: { 
                        assessmentId,
                        groupId,
                        role: MemberRole.TEAM_LEADER
                      }
                    });

                    // Downgrade existing team leader to member
                    if (existingTeamLeaderInvitation) {
                      await manager.update(
                        Invitation,
                        { id: existingTeamLeaderInvitation.id },
                        { role: MemberRole.MEMBER }
                      );
                    }

                    if (existingTeamLeaderMember) {
                      await manager.update(
                        AssessmentMember,
                        { id: existingTeamLeaderMember.id },
                        { role: MemberRole.MEMBER }
                      );
                    }
                  }
                } else if (invite.role === MemberRole.PRIMARY) {
                  // First, check for and demote any team leader in the same group to member
                  const teamLeaderInSameGroup = await manager.findOne(AssessmentMember, {
                    where: { 
                      assessmentId,
                      groupId,
                      role: MemberRole.TEAM_LEADER 
                    }
                  });
                  if (teamLeaderInSameGroup) {
                    await manager.update(
                      AssessmentMember,
                      { id: teamLeaderInSameGroup.id },
                      { role: MemberRole.MEMBER }
                    );
                  }

                  // Also check for any team leader in pending invitations for the same group
                  const teamLeaderInvitationInSameGroup = await manager.findOne(Invitation, {
                    where: { 
                      assessmentId,
                      groupId,
                      role: MemberRole.TEAM_LEADER,
                      status: Not(InvitationStatus.EXPIRED)
                    }
                  });
                  if (teamLeaderInvitationInSameGroup) {
                    await manager.update(
                      Invitation,
                      { id: teamLeaderInvitationInSameGroup.id },
                      { role: MemberRole.MEMBER }
                    );
                  }

                  // Handle existing primary in assessment (change to team leader if in different group)
                  const oldPrimaryMember = await manager.findOne(AssessmentMember, {
                    where: { assessmentId, role: MemberRole.PRIMARY },
                  });
                  if (oldPrimaryMember) {
                    // If old primary is in a different group, make them team leader
                    await manager.update(
                      AssessmentMember,
                      { id: oldPrimaryMember.id },
                      { 
                        role: oldPrimaryMember.groupId !== groupId 
                          ? MemberRole.TEAM_LEADER  // Different group - become team leader
                          : MemberRole.MEMBER       // Same group - become member
                      }
                    );
                  }

                  // Also check for any primary in pending invitations
                  const oldPrimaryInvitation = await manager.findOne(Invitation, {
                    where: { 
                      assessmentId,
                      role: MemberRole.PRIMARY,
                      status: Not(InvitationStatus.EXPIRED)
                    }
                  });
                  if (oldPrimaryInvitation) {
                    // If old primary invitation is in a different group, make them team leader
                    await manager.update(
                      Invitation,
                      { id: oldPrimaryInvitation.id },
                      { 
                        role: oldPrimaryInvitation.groupId !== groupId 
                          ? MemberRole.TEAM_LEADER  // Different group - become team leader
                          : MemberRole.MEMBER       // Same group - become member
                      }
                    );
                  }
                }
              }

              return groupInvitations.map(({ email, role }) =>
                manager.create(Invitation, {
                  email,
                  assessmentId,
                  groupId,
                  role,
                  token: generateRandomToken(24),
                  status: InvitationStatus.PENDING,
                }),
              );
            },
          ),
        );

        const flattenedInvitations = newInvitations.flat();
        const savedInvitations = await manager.save(
          Invitation,
          flattenedInvitations,
        );
        invitations.push(...savedInvitations);

        return invitations;
      } catch (err) {
        this.logger.error('createBulk:', err);
        if (
          err instanceof NotFoundException ||
          err instanceof BadRequestException
        ) {
          throw err;
        }
        throw new BadRequestException('Failed to create invitations.');
      }
    });
  }

  async findAll(
    assessmentId: string,
    query: FindAllInvitationDto,
  ): Promise<FindAllResponseDto<Invitation>> {
    if (
      !(await this.assessmentRepository.exists({
        where: { id: assessmentId },
      }))
    ) {
      throw new NotFoundException('Assessment not found');
    }

    return await new QueryService<Invitation>(this.invitationRepository)
      .filter([{ field: 'assessmentId', operator: '=', value: assessmentId }])
      .join(query.include)
      .filter([], {
        fields: ['email', 'role', 'status'],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(
    assessmentId: string,
    id: string,
    query: FindOneInvitationDto,
  ): Promise<Invitation> {
    if (
      !(await this.assessmentRepository.exists({
        where: { id: assessmentId },
      }))
    ) {
      throw new NotFoundException('Assessment not found');
    }

    const invitation = await new QueryService<Invitation>(
      this.invitationRepository,
    )
      .filter([
        { field: 'id', operator: '=', value: id },
        { field: 'assessmentId', operator: '=', value: assessmentId },
      ])
      .join(query.include)
      .getOne();

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }

  async accept(payload: InvitationUpdateRequestDto): Promise<{
    success: boolean;
    message: string;
    nextStep?: string;
    registerUrl?: string;
  }> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: { email: payload.email, token: payload.token },
      });
      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.status === InvitationStatus.EXPIRED) {
        throw new BadRequestException('Invitation expired');
      }

      if (invitation.status === InvitationStatus.ACCEPTED) {
        const user = await this.userRepository.findOne({
          where: { email: invitation.email },
        });
        if (user) {
          const frontendDomain = this.configService.get('frontendDomain', {
            infer: true,
          });
          return {
            success: true,
            message: 'Invitation already accepted. Please log in.',
            nextStep: 'login',
            registerUrl: `https://africa-cdc-murex.vercel.app/login`,
          };
        }
        throw new BadRequestException('Invitation accepted, user not found');
      }

      if (
        DateTime.now() >
        DateTime.fromJSDate(invitation.createdAt).plus({ minutes: 1440 })
      ) {
        await this.invitationRepository.update(
          { id: invitation.id },
          { status: InvitationStatus.EXPIRED },
        );
        throw new BadRequestException('Invitation expired');
      }

      const user = await this.userRepository.findOne({
        where: { email: invitation.email },
      });

      if (user) {
        await this.dataSource.transaction(async (manager) => {
          if (
            await this.memberService
              .findOne(invitation.assessmentId, user.id, { include: [] })
              .catch(() => null)
          ) {
            throw new BadRequestException('User already in assessment group');
          }

          await manager.save(
            manager.create(AssessmentMember, {
              userId: user.id,
              assessmentId: invitation.assessmentId,
              groupId: invitation.groupId,
              role: invitation.role,
            }),
          );
          await manager.update(
            Invitation,
            { id: invitation.id },
            { status: InvitationStatus.ACCEPTED },
          );
        });

        return { success: true, message: 'Invitation accepted' };
      }

      const frontendDomain =
        this.configService.get('frontendDomain', { infer: true }) ||
        'https://africa-cdc-murex.vercel.app';
      return {
        success: true,
        message: 'User not found. Please register.',
        nextStep: 'register',
        registerUrl: `${frontendDomain}/register?email=${encodeURIComponent(invitation.email)}&invitationId=${invitation.id}`,
      };
    } catch (err) {
      this.logger.error('accept:', err);
      if (
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new BadRequestException('Failed to accept invitation.');
    }
  }

  private async sendInvitationEmail(): Promise<void> {
    throw new NotImplementedException('Email service not implemented');
  }
}