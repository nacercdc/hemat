import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, authConfig, databaseConfig } from './config';
import { DatabaseModule } from './database';
import {
  AccessModule,
  AccountModule,
  AssessmentModule,
  InvitationModule,
  MeasurementScaleModule,
  TemplateModule,
} from './modules';
import { ExistConstraint, UniqueConstraint } from './shared/validators';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    AccessModule,
    AccountModule,
    AssessmentModule,
    InvitationModule,
    MeasurementScaleModule,
    TemplateModule,
  ],
  providers: [UniqueConstraint, ExistConstraint],
})
export class AppModule {}
