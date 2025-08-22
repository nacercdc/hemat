import { SmsPayload } from '../../dto/notification-payload';
import {
  DeliveryResult,
  VendorAdapter,
} from '../../interface/notification.interface';

export class AcsSmsAdapter implements VendorAdapter<SmsPayload> {
  readonly name = 'acs-sms';
  constructor(
    private readonly connectionString: string,
    private readonly from: string,
  ) {}
  async send(payload: SmsPayload): Promise<DeliveryResult> {
    // SmsClient.send(...)
    return { vendor: this.name, externalId: 'acs-sms-id' };
  }
}
