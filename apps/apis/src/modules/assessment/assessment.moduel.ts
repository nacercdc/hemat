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
} from '../../database/entities';
import { AssessmentService } from './services';
import { AssessmentController } from './controllers';
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
      AssessmentMeasurementScaleSubComponent,
    ]),
    AuthModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
