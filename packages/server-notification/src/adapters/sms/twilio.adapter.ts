import { SmsPayload } from '../../dto/notification-payload';
import {
  DeliveryResult,
  VendorAdapter,
} from '../../interface/notification.interface';

export class TwilioSmsAdapter implements VendorAdapter<SmsPayload> {
  readonly name = 'twilio';
  constructor(
    private readonly sid: string,
    private readonly token: string,
    private readonly from: string,
  ) {}
  async send(payload: SmsPayload): Promise<DeliveryResult> {
    // client.messages.create({ from: this.from, to: payload.to, body: payload.body })
    return { vendor: this.name, externalId: 'twilio-sid' };
  }
}
