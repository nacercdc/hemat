import { NotificationModule } from '@etm/server-notification';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SentryModule } from '@sentry/nestjs/setup';
import { appConfig, authConfig, databaseConfig } from './config';
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
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
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
