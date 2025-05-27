import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  Invitation,
  Assessment,
  AssessmentGroup,
  User,
} from '@africa-cdc/database/entities';
import {
  InvitationCreateRequestDto,
  InvitationUpdateRequestDto,
} from '../dtos';
import { AssessmentMemberService } from '@africa-cdc/modules/assessment/services';
import { InvitationStatus } from '@africa-cdc/shared';

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
    private readonly memberService: AssessmentMemberService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    assessmentId: string,
    groupId: string,
    payload: InvitationCreateRequestDto,
  ): Promise<Invitation> {
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
        throw new NotFoundException('Group not found');
      }

      const existingInvitation = await this.invitationRepository.findOne({
        where: {
          email: payload.email,
          assessmentId,
          groupId,
          status: In([InvitationStatus.PENDING, InvitationStatus.ACCEPTED]),
        },
      });
      if (existingInvitation) {
        throw new BadRequestException(
          'Invitation already exists for this email',
        );
      }

      const token = await uuidv4();

      const invitation = await this.dataSource.transaction(async (manager) => {
        const newInvitation = manager.create(Invitation, {
          name: payload.name,
          email: payload.email,
          assessmentId,
          groupId,
          role: payload.role,
          token,
          status: InvitationStatus.PENDING,
        });
        return manager.save(Invitation, newInvitation);
      });

      // await this.sendInvitationEmail(invitation);

      return invitation;
    } catch (err) {
      this.logger.error(
        `Failed to create invitation: ${err.message}`,
        err.stack,
      );
      throw err instanceof BadRequestException ||
        err instanceof NotFoundException
        ? err
        : new BadRequestException('Failed to create invitation');
    }
  }

  async findAll(assessmentId: string): Promise<Invitation[]> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      return this.invitationRepository.find({
        where: { assessmentId },
        relations: ['assessment', 'group'],
      });
    } catch (err) {
      this.logger.error(
        `Failed to retrieve invitations: ${err.message}`,
        err.stack,
      );
      throw err instanceof NotFoundException
        ? err
        : new BadRequestException('Failed to retrieve invitations');
    }
  }

  async update(
    id: string,
    payload: InvitationUpdateRequestDto,
  ): Promise<Invitation> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: { id },
        relations: ['assessment', 'group'],
      });
      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (payload.status) {
        if (payload.status === InvitationStatus.ACCEPTED) {
          await this.dataSource.transaction(async () => {
            // Find user by email; user must have registered or logged in
            const user = await this.userRepository.findOne({
              where: { email: invitation.email },
            });
            if (!user) {
              throw new BadRequestException(
                'User not found. Please register or log in to accept the invitation.',
              );
            }

            // Check if member already exists to avoid duplicates
            const existingMember = await this.memberService
              .findOne(invitation.assessmentId, invitation.groupId, user.id)
              .catch(() => null);

            if (existingMember) {
              throw new BadRequestException(
                'User is already a member of this assessment group',
              );
            }

            // Create assessment member with user.id
            await this.memberService.create(
              invitation.assessmentId,
              invitation.groupId,
              {
                userId: user.id,
                role: invitation.role,
              },
            );
          });
        }
        invitation.status = payload.status;
      }

      const updatedInvitation =
        await this.invitationRepository.save(invitation);
      this.logger.log(`Invitation ${id} updated to status: ${payload.status}`);
      return updatedInvitation;
    } catch (err) {
      this.logger.error(
        `Failed to update invitation: ${err.message}`,
        err.stack,
      );
      throw err instanceof NotFoundException ||
        err instanceof BadRequestException
        ? err
        : new BadRequestException('Failed to update invitation');
    }
  }

  private async sendInvitationEmail(invitation: Invitation): Promise<void> {
    try {
      throw new NotImplementedException('Email service not implemented');
      // await emailService.send({
      //   to: invitation.email,
      //   subject: `Invitation to join ${invitation.assessment.name}`,
      //   body: `Click to accept: ${process.env.APP_URL}/invitation/${invitation.token}`,
      // });
    } catch (err) {
      this.logger.error(
        `Failed to send invitation email: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }
}
