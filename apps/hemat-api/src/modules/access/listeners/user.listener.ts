import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../../../shared/services/email.service';
import { USER_EVENTS } from '../events/user.events';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class UserListener {
  constructor(private readonly emailService: EmailService) {}

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
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return html;
  }

  @OnEvent(USER_EVENTS.CREATED)
  async handleUserCreated(event: { email: string; password: string }) {
    const { email, password } = event;
    const subject = 'Your Africa CDC Account Credentials';
    
    try {
      console.log(
        '[UserListener] Preparing to send registration email to',
        email,
      );
      
      const data = {
        email,
        password,
      };
      
      const html = await this.renderUserRegistrationTemplate(data);
      
      await this.emailService.sendMail({
        to: email,
        subject,
        html,
      });
      
      console.log('[UserListener] Registration email sent to', email);
    } catch (err) {
      console.error(
        '[UserListener] Failed to send registration email to',
        email,
        err,
      );
    }
  }
} 