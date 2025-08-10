import { EmailPayload } from '../../dto/notification-payload';
import {
  DeliveryResult,
  VendorAdapter,
} from '../../interface/notification.interface';

export class SmtpEmailAdapter implements VendorAdapter<EmailPayload> {
  readonly name = 'smtp';
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly auth?: { user: string; pass: string },
  ) {}
  async send(payload: EmailPayload): Promise<DeliveryResult> {
    // nodemailer transport.sendMail(...)
    return { vendor: this.name, externalId: 'smtp-queue-id' };
  }
}
