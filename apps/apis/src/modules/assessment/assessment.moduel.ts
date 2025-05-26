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
} from '../../database/entities';
import { AssessmentService, AssessmentStructureService } from './services';
import {
  AssessmentController,
  AssessmentStructureController,
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
    ]),
    AuthModule,
  ],
  controllers: [AssessmentController, AssessmentStructureController],
  providers: [AssessmentService, AssessmentStructureService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
