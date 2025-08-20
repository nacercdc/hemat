import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  NotificationService,
  NotificationPayload,
  Channel,
} from '@etm/server-notification';
import { InvitationCreatedEvent, INVITATION_EVENTS } from '../events';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class InvitationListener {
  private readonly logger = new Logger(InvitationListener.name);

  constructor(private readonly notificationService: NotificationService) {}

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
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    return html;
  }

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
      this.logger.log(`Preparing to send invitation email to ${email}`);
      const html = await this.renderInvitationTemplate(data);

      const payload: NotificationPayload = {
        channel: Channel.EMAIL,
        payload: {
          to: email,
          subject: data.subject,
          html,
        },
      };

      this.logger.debug(`Notification payload: ${JSON.stringify(payload)}`);
      const response = await this.notificationService.send({
        ...payload,
        userId: invitationId,
        metadata: {
          invitationId,
          assessmentName,
          groupName,
        },
      });

      this.logger.log(
        `Invitation email sent to ${email}. Adapter response: ${JSON.stringify(response)}`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send invitation email to ${email}: ${err.message}`,
        err.stack,
      );
      throw new Error(`Failed to send invitation email: ${err.message}`);
    }
  }
}
