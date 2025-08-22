import { Channel } from '../interface/notification.interface';

export type EmailPayload = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
};

export type SmsPayload = {
  to: string; // E.164
  body: string; // 160/Unicode
  senderId?: string;
  countryCode?: string;
};

export type InAppPayload = {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
};

export type NotificationPayload =
  | { channel: Channel.EMAIL; payload: EmailPayload }
  | { channel: Channel.SMS; payload: SmsPayload }
  | { channel: Channel.IN_APP; payload: InAppPayload };
