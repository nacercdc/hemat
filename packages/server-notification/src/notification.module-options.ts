import { ModuleMetadata } from '@nestjs/common';
import {
  EmailPayload,
  InAppPayload,
  NotificationPayload,
  SmsPayload,
} from './dto/notification-payload';
import { Channel } from './interface/notification.interface';
import { ChannelPolicy } from './routing/channel-policy';

export interface NotificationModuleOptions {
  email: ChannelPolicy<EmailPayload>;
  sms: ChannelPolicy<SmsPayload>;
  inApp?: ChannelPolicy<InAppPayload>;
  isGlobal?: boolean;
  redactPayloadForAudit?: (payload: NotificationPayload) => any;
  resolvePolicy?: (ctx: {
    tenantId?: string;
    channel: Channel;
  }) => ChannelPolicy<any> | undefined;
}

export interface NotificationModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<NotificationModuleOptions> | NotificationModuleOptions;
  inject?: any[];
  isGlobal?: boolean;
}

export const NOTIFICATION_OPTIONS = Symbol('NOTIFICATION_OPTIONS');
