import { EmailPayload } from '../../dto/notification-payload';
import {
  DeliveryResult,
  VendorAdapter,
} from '../../interface/notification.interface';
import { createTransport } from 'nodemailer';

interface SmtpAuth {
  user: string;
  pass: string;
}
interface SmtpEmailOptions {
  host: string;
  port: number;
  from?: string;
  auth?: SmtpAuth;
  secure?: boolean;
  ignoreTLS?: boolean;
  requireTLS?: boolean;
  debug?: boolean;
}

export class SmtpEmailAdapter implements VendorAdapter<EmailPayload> {
  readonly name = 'smtp';
  constructor(private readonly options: SmtpEmailOptions) {}

  async send(payload: EmailPayload): Promise<DeliveryResult> {
    const body = payload.html ? { html: payload.html } : { text: payload.text };
    const res = await createTransport({
      host: this.options.host,
      port: this.options.port,
      auth: this.options.auth,
      secure: this.options.secure,
      from: this.options.from,
      ignoreTLS: this.options.ignoreTLS,
      requireTLS: this.options.requireTLS,
      debug: this.options.debug,
    }).sendMail({
      to: payload.to,
      subject: payload.subject,
      cc: payload.cc,
      bcc: payload.bcc,
      attachments: payload.attachments,
      ...body,
    });

    return { vendor: this.name, externalId: res.messageId };
  }
}
