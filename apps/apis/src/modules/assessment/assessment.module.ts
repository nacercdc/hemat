import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Assessment,
  User,
  Country,
  Domain,
  Component,
  SubComponent,
  AssessmentDomain,
  AssessmentComponent,
  AssessmentSubComponent,
  MeasurementScale,
  AssessmentMeasurementScale,
  AssessmentMeasurementScaleSubComponent,
  Language,
  AssessmentGroup,
  AssessmentMember,
  MeasurementScaleSubComponent,
} from '../../database/entities';
import { ASSESSMENT_SERVICES, AssessmentMemberService, AssessmentService } from './services';
import {
  AssessmentComponentController,
  AssessmentController,
  AssessmentDomainController,
  AssessmentGroupController,
  AssessmentMeasurementScaleController,
  AssessmentMeasurementScaleSubComponentController,
  AssessmentMemberController,
  AssessmentSubComponentController,
} from './controllers';
import { AuthModule } from '../../shared';
import { AssessmentUtilityService } from './utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      User,
      Domain,
      Component,
      SubComponent,
      AssessmentDomain,
      AssessmentComponent,
      AssessmentSubComponent,
      MeasurementScale,
      MeasurementScaleSubComponent,
      AssessmentMeasurementScale,
      AssessmentMeasurementScaleSubComponent,
      Language,
      AssessmentGroup,
      AssessmentMember,
      Country,
    ]),
    AuthModule,
  ],
  controllers: [
    AssessmentController,
    AssessmentDomainController,
    AssessmentComponentController,
    AssessmentSubComponentController,
    AssessmentMeasurementScaleController,
    AssessmentMeasurementScaleSubComponentController,
    AssessmentGroupController,
    AssessmentMemberController,
  ],
  providers: [
    ...ASSESSMENT_SERVICES,
    AssessmentUtilityService,
  ],
  exports: [AssessmentService, AssessmentMemberService],
})
export class AssessmentModule {}
