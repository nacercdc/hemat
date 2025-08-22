/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationPayload } from './dto/notification-payload';
import {
  Channel,
  NotificationStatus,
} from './interface/notification.interface';
import {
  NOTIFICATION_OPTIONS,
  NotificationModuleOptions,
} from './notification.module-options';
import { NotificationRepository } from './notification.repository';
import { ChannelRouter } from './routing/channel-router';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly repo: NotificationRepository,
    @Inject(NOTIFICATION_OPTIONS)
    private readonly options: NotificationModuleOptions,
  ) {}

  private buildRouter(channel: Channel, tenantId?: string): ChannelRouter<any> {
    const resolver = this.options.resolvePolicy?.({ tenantId, channel });
    const base =
      resolver ??
      (channel === Channel.EMAIL
        ? this.options.email
        : channel === Channel.SMS
          ? this.options.sms
          : (this.options.inApp ?? { strategy: 'priority', adapters: [] }));
    return new ChannelRouter<any>(base);
  }

  async send(
    input: NotificationPayload & {
      userId: string;
      tenantId?: string;
      metadata?: Record<string, any>;
    },
  ) {
    const { channel, payload, tenantId } = input;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const redacter = this.options.redactPayloadForAudit ?? ((p: any) => p);
    const notification = await this.repo.createPending({
      userId: input.userId,
      channel,
      metadata: input.metadata,
      payloadSnapshot: redacter(input) as Record<string, any>,
    });

    const router = this.buildRouter(channel, tenantId);
    const tried: string[] = [];
    const maxAttempts = router.maxAttempts();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      let vendorName = 'unknown';
      try {
        const adapter = router.nextAdapter({
          payload,
          tenantId,
          attempts: attempt - 1,
          history: tried,
        });
        vendorName = adapter.name;
        tried.push(vendorName);

        const result = await adapter.send(payload as any, { tenantId });
        await this.repo.update(notification.id, {
          attempts: attempt,
          vendorUsed: result.vendor ?? vendorName,
          status: NotificationStatus.SENT,
        });
        return result;
      } catch (err: any) {
        this.logger.warn(
          `Attempt ${attempt} failed via ${vendorName}: ${err?.message ?? err}`,
        );
        await this.repo.update(notification.id, {
          attempts: attempt,
          lastError: String(err?.message ?? err),
          vendorUsed: vendorName,
          status:
            attempt >= maxAttempts
              ? NotificationStatus.FAILED
              : NotificationStatus.PENDING,
        });
      }
    }

    throw new Error(
      `All adapters failed for channel ${channel}: ${tried.join(', ')}`,
    );
  }
}
