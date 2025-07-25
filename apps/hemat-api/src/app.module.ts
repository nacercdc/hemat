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
  InvitationModule,
  LanguageModule,
  MeasurementScaleModule,
  SupportModule,
  TemplateModule,
  DashboardModule,
} from './modules';
import { ExistConstraint, UniqueConstraint } from './shared/validators';
import { MediaUploadModule } from '@etm/server-media-upload';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    MediaUploadModule.register({
      storage: 'gcs',
      gcsConfig: {
        projectId: 'ethiochicken-test-459516',
        // keyFilename: './storage-gcs.json', // For local uncomment this line
        bucket: 'hemat',
      },
      // destinationPath: 'uploads',
      useUniqueFilenames: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
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
