import {
  AcsEmailAdapter,
  AcsSmsAdapter,
  Channel,
  NotificationModuleOptions,
  SendGridEmailAdapter,
  SmtpEmailAdapter,
  TwilioSmsAdapter,
} from '@etm/server-notification';

export const notificationModuleConfig: NotificationModuleOptions = {
  email: {
    strategy: 'priority',
    maxAttempts: 3,
    adapters: [
      {
        adapter: new SendGridEmailAdapter(
          process.env.SENDGRID_KEY!,
          'no-reply@example.com',
        ),
        priority: 0,
      },
      {
        adapter: new AcsEmailAdapter(
          process.env.ACS_EMAIL_CONN!,
          'DoNotReply@example.com',
        ),
        priority: 1,
      },
      // {
      //   adapter: new SmtpEmailAdapter(process.env.SMTP_HOST!, 587, {
      //     user: process.env.SMTP_USER!,
      //     pass: process.env.SMTP_PASS!,
      //   }),
      //   priority: 2,
      // },
    ],
  },
  sms: {
    strategy: 'by_country',
    maxAttempts: 2,
    adapters: [
      {
        adapter: new TwilioSmsAdapter(
          process.env.TWILIO_SID!,
          process.env.TWILIO_TOKEN!,
          process.env.TWILIO_FROM!,
        ),
        countries: ['US', 'CA'],
        priority: 0,
      },
      {
        adapter: new AcsSmsAdapter(
          process.env.ACS_SMS_CONN!,
          process.env.ACS_SMS_FROM!,
        ),
        countries: ['ET', 'KE', 'NG'],
        priority: 0,
      },
      // generic fallback
      {
        adapter: new TwilioSmsAdapter(
          process.env.TWILIO_SID!,
          process.env.TWILIO_TOKEN!,
          process.env.TWILIO_FROM!,
        ),
        priority: 5,
      },
    ],
  },
  inApp: {
    strategy: 'priority',
    adapters: [],
  },
  redactPayloadForAudit: (p) => {
    if (p.channel === Channel.EMAIL) {
      const { payload, ...rest } = p as any;
      const { subject } = payload;
      return { ...rest, payload: { subject } };
    }
    return p;
  },
};
