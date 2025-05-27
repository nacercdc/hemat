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
} from '../../database/entities';
import {
  AssessmentComponentService,
  AssessmentDomainService,
  AssessmentGroupService,
  AssessmentMeasurementScaleService,
  AssessmentMeasurementScaleSubComponentService,
  AssessmentMemberService,
  AssessmentService,
  AssessmentSubComponentService,
} from './services';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    AssessmentService,
    AssessmentDomainService,
    AssessmentComponentService,
    AssessmentSubComponentService,
    AssessmentMeasurementScaleService,
    AssessmentMeasurementScaleSubComponentService,
    AssessmentGroupService,
    AssessmentMemberService,
  ],
  exports: [AssessmentService, AssessmentMemberService],
})
export class AssessmentModule {}
