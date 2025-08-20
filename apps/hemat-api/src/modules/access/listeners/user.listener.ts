import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  NotificationService,
  NotificationPayload,
  Channel,
} from '@etm/server-notification';
import { USER_EVENTS } from '../events/user.events';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class UserListener {
  private readonly logger = new Logger(UserListener.name);

  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Render the user registration email HTML template with dynamic data.
   */
  private async renderUserRegistrationTemplate(
    data: Record<string, any>,
  ): Promise<string> {
    const distPath = path.resolve(
      __dirname,
      '../../../shared/services/email-templates/user-registration-email.html',
    );
    const srcPath = path.resolve(
      __dirname,
      '../../../../src/shared/services/email-templates/user-registration-email.html',
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
        'User registration email template not found in dist or src paths.',
      );
    }
    for (const [key, value] of Object.entries(data)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    return html;
  }

  @OnEvent(USER_EVENTS.CREATED)
  async handleUserCreated(event: { email: string; password: string }) {
    const { email, password } = event;
    const subject = 'Your Africa CDC Account Credentials';

    try {
      this.logger.log(`Preparing to send registration email to ${email}`);

      const data = {
        email,
        password,
      };

      const html = await this.renderUserRegistrationTemplate(data);

      const payload: NotificationPayload = {
        channel: Channel.EMAIL,
        payload: {
          to: email,
          subject,
          html,
        },
      };

      await this.notificationService.send({
        ...payload,
        userId: email, // Using email as userId for tracking
        metadata: {
          event: USER_EVENTS.CREATED,
        },
      });

      this.logger.log(`Registration email sent to ${email}`);
    } catch (err) {
      this.logger.error(`Failed to send registration email to ${email}`, err);
      throw new Error(`Failed to send registration email: ${err.message}`);
    }
  }
}
