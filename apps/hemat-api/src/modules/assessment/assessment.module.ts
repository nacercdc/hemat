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
  Roadmap,
  AssessmentSubComponentRoadmap,
  Answer,
  AssessmentSubComponentAnswer,
} from '../../database/entities';
import {
  ASSESSMENT_SERVICES,
  AssessmentMemberService,
  AssessmentService,
} from './services';
import {
  AssessmentController,
  AssessmentDomainController,
  AssessmentComponentController,
  AssessmentSubComponentController,
  AssessmentMeasurementScaleController,
  AssessmentMeasurementScaleSubComponentController,
  AssessmentGroupController,
  AssessmentMemberController,
  AssessmentAnswerController,
  AssessmentRoadmapController,
} from './controllers';
import { AuthModule } from '@shared/modules';
import { AssessmentAnswerValidator, AssessmentRoadmapValidator } from './utils';
import { AssessmentRoleGuard } from './guards/assessment-role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      User,
      Domain,
      Component,
      SubComponent,
      Answer,
      AssessmentDomain,
      AssessmentComponent,
      AssessmentSubComponent,
      MeasurementScale,
      MeasurementScaleSubComponent,
      AssessmentMeasurementScale,
      AssessmentMeasurementScaleSubComponent,
      AssessmentSubComponentAnswer,
      Language,
      AssessmentGroup,
      AssessmentMember,
      Country,
      AssessmentSubComponentRoadmap,
      Roadmap,
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
    AssessmentAnswerController,
    AssessmentRoadmapController,
  ],
  providers: [
    ...ASSESSMENT_SERVICES,
    AssessmentAnswerValidator,
    AssessmentRoadmapValidator,
    AssessmentRoleGuard,
  ],
  exports: [AssessmentService, AssessmentMemberService, AssessmentRoleGuard],
})
export class AssessmentModule {}
