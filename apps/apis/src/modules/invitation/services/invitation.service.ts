import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  Invitation,
  Assessment,
  AssessmentGroup,
  AssessmentMember,
} from '../../../database/entities';
import {
  InvitationCreateRequestDto,
  InvitationUpdateRequestDto,
} from '../dtos';
import { InvitationStatus } from '../../../shared';
import { CrudService } from '../../../shared/services';

@Injectable()
export class InvitationService extends CrudService<Invitation> {
  private readonly loggerService = new Logger(InvitationService.name);

  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentGroup)
    private readonly groupRepository: Repository<AssessmentGroup>,
    @InjectRepository(AssessmentMember)
    private readonly memberRepository: Repository<AssessmentMember>,
    private readonly dataSource: DataSource,
  ) {
    super(invitationRepository);
  }

  async create(payload: InvitationCreateRequestDto): Promise<Invitation> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: payload.assessmentId },
      });
      if (!assessment) {
        throw new BadRequestException('Assessment not found');
      }

      const group = await this.groupRepository.findOne({
        where: { id: payload.groupId },
      });
      if (!group) {
        throw new BadRequestException('Group not found');
      }

      // Check if the email is already invited for this assessment and group
      const existingInvitation = await this.invitationRepository.findOne({
        where: {
          email: payload.email,
          assessmentId: payload.assessmentId,
          groupId: payload.groupId,
          status: In([InvitationStatus.PENDING, InvitationStatus.ACCEPTED]),
        },
      });
      if (existingInvitation) {
        throw new BadRequestException(
          'Invitation already exists for this email',
        );
      }

      // Generate unique token
      const token = uuidv4();

      // Create invitation
      const invitation = await this.dataSource.transaction(async (manager) => {
        const newInvitation = manager.create(Invitation, {
          name: payload.name,
          email: payload.email,
          assessmentId: payload.assessmentId,
          groupId: payload.groupId,
          role: payload.role,
          token,
          status: InvitationStatus.PENDING,
        });

        await manager.save(Invitation, newInvitation);

        return newInvitation;
      });

      // Send invitation email (mock implementation)
      await this.sendInvitationEmail(invitation);

      return invitation;
    } catch (err) {
      this.loggerService.error('Failed to create invitation', err.stack || err);
      throw new BadRequestException(
        'Failed to create invitation: ' + (err.message || err),
      );
    }
  }

  async findByAssessmentId(assessmentId: string): Promise<Invitation[]> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id: assessmentId },
      });
      if (!assessment) {
        throw new BadRequestException('Assessment not found');
      }

      return this.invitationRepository.find({
        where: { assessmentId },
        relations: ['assessment', 'group'],
      });
    } catch (err) {
      this.loggerService.error(
        'Failed to retrieve invitations',
        err.stack || err,
      );
      throw new BadRequestException(
        'Failed to retrieve invitations: ' + (err.message || err),
      );
    }
  }

  async update(
    where: FindOptionsWhere<Invitation>,
    payload: InvitationUpdateRequestDto,
  ): Promise<Invitation> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where,
        relations: ['assessment', 'group'],
      });
      if (!invitation) {
        throw new BadRequestException('Invitation not found');
      }

      if (payload.status) {
        // If status is ACCEPTED, create an AssessmentMember
        if (payload.status === InvitationStatus.ACCEPTED) {
          await this.dataSource.transaction(async (manager) => {
            const existingMember = await manager.findOne(AssessmentMember, {
              where: {
                userId: invitation.email, // Assuming email is used as userId for simplicity
                assessmentId: invitation.assessmentId,
                groupId: invitation.groupId,
              },
            });

            if (!existingMember) {
              const member = manager.create(AssessmentMember, {
                userId: invitation.email, // Replace with actual user lookup if needed
                assessmentId: invitation.assessmentId,
                groupId: invitation.groupId,
                role: invitation.role,
              });
              await manager.save(AssessmentMember, member);
            }
          });
        }

        invitation.status = payload.status;
      }

      const updatedInvitation =
        await this.invitationRepository.save(invitation);
      return updatedInvitation;
    } catch (err) {
      this.loggerService.error('Failed to update invitation', err.stack || err);
      throw new BadRequestException(
        'Failed to update invitation: ' + (err.message || err),
      );
    }
  }
  private async sendInvitationEmail(invitation: Invitation): Promise<void> {
    try {
      // Mock email sending logic (replace with actual email service like AWS SES, SendGrid, etc.)
      this.loggerService.log(
        `Sending invitation email to ${invitation.email} with token ${invitation.token}`,
      );
      // Example: await emailService.send({
      //   to: invitation.email,
      //   subject: `Invitation to join ${invitation.assessment.name}`,
      //   body: `You have been invited to join the assessment group. Use this token: ${invitation.token}`,
      // });
    } catch (err) {
      this.loggerService.error(
        'Failed to send invitation email',
        err.stack || err,
      );
      throw new BadRequestException('Failed to send invitation email');
    }
  }
}
