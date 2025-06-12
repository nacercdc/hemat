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
  AssessmentAnswer,
  Roadmap,
} from '../../database/entities';
import {
  ASSESSMENT_SERVICES,
  AssessmentMemberService,
  AssessmentService,
  AssessmentAnswerService,
  RoadmapService,
} from './dtos/services';
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
  RoadmapController,
} from './controllers';
import { AuthModule } from '@shared/modules';
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
      AssessmentAnswer,
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
    RoadmapController,
  ],
  providers: [...ASSESSMENT_SERVICES],
  exports: [AssessmentService, AssessmentMemberService],
})
export class AssessmentModule {}
