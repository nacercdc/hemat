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
} from '../../database/entities';
import { AssessmentService, AssessmentStructureService } from './services';
import {
  AssessmentController,
  AssessmentStructureController,
} from './controllers';
import { AuthModule } from '../../shared';
import { AssessmentMeasurementScaleSubComponent } from '../../database/entities/assessment-measurement-scale-sub-component.entity';

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
    ]),
    AuthModule,
  ],
  controllers: [AssessmentController, AssessmentStructureController],
  providers: [AssessmentService, AssessmentStructureService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
