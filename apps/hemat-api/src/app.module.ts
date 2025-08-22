import {
  Channel,
  NotificationModule,
  SmtpEmailAdapter,
} from '@etm/server-notification';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule } from '@sentry/nestjs/setup';
import {
  appConfig,
  authConfig,
  ConfigType,
  databaseConfig,
  smtpConfig,
} from './config';
import { DatabaseModule } from './database';
import {
  AccessModule,
  AccountModule,
  AssessmentModule,
  CountryModule,
  DashboardModule,
  InvitationModule,
  LanguageModule,
  MeasurementScaleModule,
  SupportModule,
  TemplateModule,
} from './modules';
import { ExistConstraint, UniqueConstraint } from './shared/validators';
@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, smtpConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    NotificationModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        email: {
          strategy: 'priority',
          maxAttempts: 3,
          adapters: [
            {
              adapter: new SmtpEmailAdapter({
                host: configService.getOrThrow('smtp.host', { infer: true }),
                port: configService.getOrThrow('smtp.port', { infer: true }),
                auth: {
                  user: configService.getOrThrow('smtp.user', { infer: true }),
                  pass: configService.getOrThrow('smtp.pass', { infer: true }),
                },
                from: configService.getOrThrow('smtp.from', { infer: true }),
              }),
              priority: 0,
            },
          ],
        },
        sms: {
          strategy: 'by_country',
          maxAttempts: 2,
          adapters: [],
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
      }),
      inject: [ConfigService],
    }),
    AccessModule,
    AccountModule,
    CountryModule,
    AssessmentModule,
    InvitationModule,
    LanguageModule,
    MeasurementScaleModule,
    SupportModule,
    TemplateModule,
    DashboardModule,
  ],
  providers: [UniqueConstraint, ExistConstraint],
})
export class AppModule {}
