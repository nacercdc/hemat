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
import { AssessmentMemberService } from '@modules/assessment/dtos/services';
import { InvitationStatus } from '@shared/enums';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { FindAllResponseDto } from '@shared/dtos';
import { QueryService } from '@shared/services';
import { GroupService } from './group.service';
import { AssessmentRoleService } from './assessment-role.service';
import { generateRandomToken } from '@shared/helpers/token.helper';

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

              await this.roleService.handleRoleSwapping(
                manager,
                assessmentId,
                groupId,
                groupInvitations,
              );

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
              .findOne(invitation.assessmentId, invitation.groupId, user.id, {
                include: [],
              })
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