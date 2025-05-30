import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import {
  Invitation,
  Assessment,
  AssessmentGroup,
  User,
  AssessmentMember,
} from '@database/entities';
import {
  InvitationCreateRequestDto,
  InvitationUpdateRequestDto,
} from '../dtos';
import { AssessmentMemberService } from '@modules/assessment/services';
import { InvitationStatus, MemberRole } from '@shared/enums';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { generateRandomToken } from '@shared/helpers/token.helper';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AssessmentMember)
    private readonly memberRepository: Repository<AssessmentMember>,
    private readonly memberService: AssessmentMemberService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async create(
    assessmentId: string,
    payload: InvitationCreateRequestDto,
  ): Promise<Invitation> {
    const assessment = await this.assessmentRepository.exists({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const group = await this.groupRepository.exists({
      where: { id: payload.groupId, assessmentId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const existingInvitation = await this.invitationRepository.findOne({
      where: {
        email: payload.email,
        assessmentId,
        status: Not(InvitationStatus.EXPIRED),
      },
    });

    if (existingInvitation) {
      throw new BadRequestException('Invitation already exists for this email');
    }

    if (payload.role === MemberRole.PRIMARY) {
      const existingPrimaryInvitation = await this.invitationRepository.findOne(
        {
          where: {
            groupId: payload.groupId,
            assessmentId,
            role: MemberRole.PRIMARY,
            status: Not(InvitationStatus.EXPIRED),
          },
        },
      );

      if (existingPrimaryInvitation) {
        throw new BadRequestException(
          'A PRIMARY role invitation already exists for this group',
        );
      }

      const existingPrimaryMember = await this.memberRepository.findOne({
        where: {
          groupId: payload.groupId,
          assessmentId,
          role: MemberRole.PRIMARY,
        },
      });

      if (existingPrimaryMember) {
        throw new BadRequestException(
          'A PRIMARY role member already exists for this group',
        );
      }
    }

    try {
      const token = generateRandomToken(24);
      const newInvitation = this.invitationRepository.create({
        email: payload.email,
        assessmentId,
        groupId: payload.groupId,
        role: payload.role,
        token,
        status: InvitationStatus.PENDING,
      });

      await this.invitationRepository.save(newInvitation);
      // await this.sendInvitationEmail(newInvitation);
      return newInvitation;
    } catch (err) {
      this.logger.error(
        `Failed to create invitation: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to create invitation');
    }
  }

  async findAll(assessmentId: string): Promise<Invitation[]> {
    try {
      return this.invitationRepository.find({
        where: { assessmentId },
        relations: { group: true },
      });
    } catch (err) {
      this.logger.error(
        `Failed to retrieve invitations: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve invitations');
    }
  }

  async accept(payload: InvitationUpdateRequestDto): Promise<{
    success: boolean;
    message: string;
    nextStep?: string;
    registerUrl?: string;
  }> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: { email: payload.email },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (payload.token !== invitation.token) {
        throw new BadRequestException('Invalid token');
      }

      if (invitation.status === InvitationStatus.EXPIRED) {
        throw new BadRequestException('Invitation expired');
      }

      if (invitation.status === InvitationStatus.ACCEPTED) {
        const user = await this.userRepository.findOne({
          where: { email: invitation.email },
        });
        if (user) {
          const frontendDomain =
            this.configService.get('frontendDomain', { infer: true }) ||
            'http://localhost:3000';
          return {
            success: true,
            message: 'Invitation already accepted. Please log in.',
            nextStep: 'login',
            registerUrl: `${frontendDomain}/login`,
          };
        }
        throw new BadRequestException(
          'Invitation already accepted, but user not found',
        );
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
          const existingMember = await this.memberService
            .findOne(invitation.assessmentId, invitation.groupId, user.id)
            .catch(() => null);

          if (existingMember) {
            throw new BadRequestException(
              'User is already a member of this assessment group',
            );
          }

          if (invitation.role === MemberRole.PRIMARY) {
            const existingPrimaryMember = await manager.findOne(
              AssessmentMember,
              {
                where: {
                  groupId: invitation.groupId,
                  assessmentId: invitation.assessmentId,
                  role: MemberRole.PRIMARY,
                },
              },
            );

            if (existingPrimaryMember) {
              throw new BadRequestException(
                'A PRIMARY role member already exists for this group',
              );
            }
          }

          const newMember = manager.create(AssessmentMember, {
            userId: user.id,
            assessmentId: invitation.assessmentId,
            groupId: invitation.groupId,
            role: invitation.role,
          });

          await manager.save(AssessmentMember, newMember);
          await manager.update(
            Invitation,
            { id: invitation.id },
            { status: InvitationStatus.ACCEPTED },
          );
        });

        return {
          success: true,
          message: 'Invitation accepted successfully',
        };
      }

      const frontendDomain =
        this.configService.get('frontendDomain', { infer: true }) ||
        'http://localhost:3000';
      const registerUrl = `${frontendDomain}/register?email=${encodeURIComponent(
        invitation.email,
      )}&invitationId=${invitation.id}`;

      return {
        success: true,
        message: 'User not found. Please register to accept the invitation.',
        nextStep: 'register',
        registerUrl,
      };
    } catch (err) {
      this.logger.error(
        `Failed to accept invitation: ${err.message}`,
        err.stack,
      );
      throw err instanceof NotFoundException ||
        err instanceof BadRequestException
        ? err
        : new InternalServerErrorException('Failed to accept invitation');
    }
  }

  private async sendInvitationEmail(invitation: Invitation): Promise<void> {
    try {
      const frontendDomain =
        this.configService.get('frontendDomain', { infer: true }) ||
        'http://localhost:3000';
      // Placeholder for email service implementation
      throw new NotImplementedException('Email service not implemented');
      // Example implementation:
      // await emailService.send({
      //   to: invitation.email,
      //   subject: `Invitation to join assessment`,
      //   body: `Click to accept: ${frontendDomain}/invitation?email=${encodeURIComponent(invitation.email)}&token=${invitation.token}`,
      // });
    } catch (err) {
      this.logger.error(
        `Failed to send invitation email: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to send invitation email');
    }
  }
}