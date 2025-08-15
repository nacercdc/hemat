import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InvitationCreatedEvent } from '../events/invitation.events';
import { EmailService } from '../../../shared/services/email.service';
import { promises as fs } from 'fs';
import * as path from 'path';
import { INVITATION_EVENTS } from '../events/invitation.constants';

@Injectable()
export class InvitationListener {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Render the invitation email HTML template with dynamic data.
   */
  private async renderInvitationTemplate(
    data: Record<string, any>,
  ): Promise<string> {
    const distPath = path.resolve(
      __dirname,
      '../../../shared/services/email-templates/invitation-email.html',
    );
    const srcPath = path.resolve(
      __dirname,
      '../../../../src/shared/services/email-templates/invitation-email.html',
    );
    let html: string | undefined;
    for (const templatePath of [distPath, srcPath]) {
      try {
        html = await fs.readFile(templatePath, 'utf8');
        break;
      } catch {}
    }
    if (!html) {
      throw new Error(
        'Invitation email template not found in dist or src paths.',
      );
    }
    for (const [key, value] of Object.entries(data)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return html;
  }

  /**
   * Handle invitation created event and send invitation email.
   */
  @OnEvent(INVITATION_EVENTS.CREATED)
  async handleInvitationCreated(event: InvitationCreatedEvent) {
    const { email, token, invitationId, assessmentName, groupName, extraData } =
      event;
    const registerUrl = `https://africa-cdc-web-501628761718.us-west1.run.app/invitations/accept?email=${encodeURIComponent(email)}&invitationId=${invitationId}&token=${token}&assessmentName=${assessmentName}`;
    const data = {
      token,
      registerUrl,
      subject: `Invitation to ${assessmentName || 'Africa CDC'}`,
      assessmentName: assessmentName || '',
      groupName: groupName || '',
      ...extraData,
    };
    try {
      console.log(
        '[InvitationListener] Preparing to send invitation email to',
        email,
      );
      const html = await this.renderInvitationTemplate(data);
      await this.emailService.sendMail({
        to: email,
        subject: data.subject,
        html,
      });
      console.log('[InvitationListener] Invitation email sent to', email);
    } catch (err) {
      console.error(
        '[InvitationListener] Failed to send invitation email to',
        email,
        err,
      );
    }
  }
}
