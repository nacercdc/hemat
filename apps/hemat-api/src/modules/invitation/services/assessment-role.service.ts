import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EntityManager, Not } from 'typeorm';
import { Invitation } from '@database/entities';
import { InvitationItemDto } from '../dtos';
import { InvitationStatus, MemberRole } from '@shared/enums';

@Injectable()
export class AssessmentRoleService {
  private readonly logger = new Logger(AssessmentRoleService.name);

  async handleRoleSwapping(
    manager: EntityManager,
    assessmentId: string,
    groupId: string,
    invitations: InvitationItemDto[],
  ): Promise<void> {
    try {
      const updates = [];

      // First, check if there's an existing PRIMARY member in the group
      const existingPrimary = await manager.findOne(Invitation, {
        where: { groupId, role: MemberRole.PRIMARY },
      });

      // Check if any new invitations are for PRIMARY role
      const hasNewPrimary = invitations.some(
        (i) => i.role === MemberRole.PRIMARY,
      );
      // Check if any new invitations are for TEAM_LEADER role
      const hasNewTeamLeader = invitations.some(
        (i) => i.role === MemberRole.TEAM_LEADER,
      );

      // If there's an existing PRIMARY member in the group, change any new TEAM_LEADER to MEMBER
      if (existingPrimary) {
        // Change any TEAM_LEADER invitations to MEMBER
        invitations.forEach((invitation) => {
          if (invitation.role === MemberRole.TEAM_LEADER) {
            invitation.role = MemberRole.MEMBER;
          }
        });
      }

      // If both PRIMARY and TEAM_LEADER are being added in the same group
      if (hasNewPrimary && hasNewTeamLeader) {
        // Change all TEAM_LEADER roles to MEMBER in the invitations array
        invitations.forEach((invitation) => {
          if (invitation.role === MemberRole.TEAM_LEADER) {
            invitation.role = MemberRole.MEMBER;
          }
        });
      }

      // If there's a new PRIMARY role, check and handle existing PRIMARY members
      if (hasNewPrimary) {
        // Check if there's an existing PRIMARY member in the assessment
        const existingPrimaryInAssessment = await manager.findOne(Invitation, {
          where: { assessmentId, role: MemberRole.PRIMARY },
        });

        if (existingPrimaryInAssessment) {
          // Change existing PRIMARY to TEAM_LEADER instead of MEMBER
          updates.push(
            manager.update(
              Invitation,
              { id: existingPrimaryInAssessment.id },
              { role: MemberRole.TEAM_LEADER },
            ),
          );
        }

        // Also check and update any pending PRIMARY invitations
        updates.push(
          manager.update(
            Invitation,
            {
              assessmentId,
              role: MemberRole.PRIMARY,
              status: Not(InvitationStatus.EXPIRED),
            },
            { role: MemberRole.TEAM_LEADER },
          ),
        );

        // Check if there's a TEAM_LEADER in the group and change them to MEMBER
        const existingTeamLeader = await manager.findOne(Invitation, {
          where: { groupId, role: MemberRole.TEAM_LEADER },
        });

        if (existingTeamLeader) {
          updates.push(
            manager.update(
              Invitation,
              { id: existingTeamLeader.id },
              { role: MemberRole.MEMBER },
            ),
          );
        }
      }

      // If there's a new TEAM_LEADER role, check and handle existing TEAM_LEADER members
      if (hasNewTeamLeader) {
        // Check if there's an existing TEAM_LEADER in the group
        const existingTeamLeader = await manager.findOne(Invitation, {
          where: { groupId, role: MemberRole.TEAM_LEADER },
        });

        if (existingTeamLeader) {
          // Change existing TEAM_LEADER to MEMBER
          updates.push(
            manager.update(
              Invitation,
              { id: existingTeamLeader.id },
              { role: MemberRole.MEMBER },
            ),
          );
        }

        // Also check and update any pending TEAM_LEADER invitations for this group
        updates.push(
          manager.update(
            Invitation,
            {
              groupId,
              role: MemberRole.TEAM_LEADER,
              status: Not(InvitationStatus.EXPIRED),
            },
            { role: MemberRole.MEMBER },
          ),
        );
      }

      if (updates.length > 0) {
        await Promise.all(updates);
      }
    } catch (err) {
      this.logger.error('handleRoleSwapping:', err);
      throw new BadRequestException('Failed to handle role swapping.');
    }
  }

  async handleRoleSwappingForAccept(
    manager: EntityManager,
    invitation: Invitation,
  ): Promise<void> {
    try {
      const updates = [];

      if (invitation.role === MemberRole.PRIMARY) {
        // Check for existing PRIMARY member in the assessment
        const existingPrimary = await manager.findOne(Invitation, {
          where: {
            assessmentId: invitation.assessmentId,
            role: MemberRole.PRIMARY,
          },
        });

        if (existingPrimary) {
          // Change existing PRIMARY to TEAM_LEADER instead of MEMBER
          updates.push(
            manager.update(
              Invitation,
              { id: existingPrimary.id },
              { role: MemberRole.TEAM_LEADER },
            ),
          );
        }

        // Check for existing TEAM_LEADER in the group
        const existingTeamLeader = await manager.findOne(Invitation, {
          where: { groupId: invitation.groupId, role: MemberRole.TEAM_LEADER },
        });

        if (existingTeamLeader) {
          // Change existing TEAM_LEADER to MEMBER
          updates.push(
            manager.update(
              Invitation,
              { id: existingTeamLeader.id },
              { role: MemberRole.MEMBER },
            ),
          );
        }
      }

      if (invitation.role === MemberRole.TEAM_LEADER) {
        // Check for existing TEAM_LEADER in the group
        const existingTeamLeader = await manager.findOne(Invitation, {
          where: { groupId: invitation.groupId, role: MemberRole.TEAM_LEADER },
        });

        if (existingTeamLeader) {
          // Change existing TEAM_LEADER to MEMBER
          updates.push(
            manager.update(
              Invitation,
              { id: existingTeamLeader.id },
              { role: MemberRole.MEMBER },
            ),
          );
        }

        // Check for existing PRIMARY in the group
        const existingPrimary = await manager.findOne(Invitation, {
          where: { groupId: invitation.groupId, role: MemberRole.PRIMARY },
        });

        // If there's a PRIMARY member, change the TEAM_LEADER invitation to MEMBER
        if (existingPrimary) {
          invitation.role = MemberRole.MEMBER;
        }
      }

      if (updates.length > 0) {
        await Promise.all(updates);
      }
    } catch (err) {
      this.logger.error('handleRoleSwappingForAccept:', err);
      throw new BadRequestException(
        'Failed to handle role swapping for accept.',
      );
    }
  }
}
