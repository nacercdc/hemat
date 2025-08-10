import { EmailPayload } from '../../dto/notification-payload';
import {
  DeliveryResult,
  VendorAdapter,
} from '../../interface/notification.interface';

export class SendGridEmailAdapter implements VendorAdapter<EmailPayload> {
  readonly name = 'sendgrid';
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}
  async send(payload: EmailPayload): Promise<DeliveryResult> {
    // @sendgrid/mail
    // await sgMail.send({ to, from: this.from, subject, html/text, attachments })
    return { vendor: this.name, externalId: 'sg-msg-id' };
  }
}
