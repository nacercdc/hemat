import { EmailPayload } from '../../dto/notification-payload';
import {
  DeliveryResult,
  VendorAdapter,
} from '../../interface/notification.interface';

export class AcsEmailAdapter implements VendorAdapter<EmailPayload> {
  readonly name = 'acs-email';
  constructor(
    private readonly connectionString: string,
    private readonly sender: string,
  ) {}
  async send(payload: EmailPayload): Promise<DeliveryResult> {
    // ACS EmailClient.send(...)
    return { vendor: this.name, externalId: 'acs-msg-id' };
  }
}
