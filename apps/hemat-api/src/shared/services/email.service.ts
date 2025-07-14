/**
 * Generic email service for sending single and bulk emails.
 */
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface BulkEmailOptions {
  recipients: string[];
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'bewketuwondwosen@gmail.com',
        pass: process.env.EMAIL_PASS || 'taei sxxp agsc bncy',
      },
    });
  }

  /**
   * Send a single email.
   */
  async sendMail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `Africa CDC <${process.env.EMAIL_USER || 'bewketuwondwosen@gmail.com'}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error}`);
      throw error;
    }
  }

  /**
   * Send a bulk email to multiple recipients.
   */
  async sendBulkMail(options: BulkEmailOptions): Promise<void> {
    try {
      const sendPromises = options.recipients.map((to) =>
        this.transporter.sendMail({
          from: `Africa CDC <${process.env.EMAIL_USER || 'bewketuwondwosen@gmail.com'}>`,
          to,
          subject: options.subject,
          html: options.html,
        })
      );
      await Promise.all(sendPromises);
      this.logger.log(`Bulk email sent to ${options.recipients.length} recipients`);
    } catch (error) {
      this.logger.error(`Failed to send bulk email: ${error}`);
      throw error;
    }
  }
} 