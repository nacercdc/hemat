import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../../database/entities/country.entity';
import { Domain } from '../../database/entities/domain.entity';
import { Assessment } from '../../database/entities/assessment.entity';
import { TemplateModule } from '../template/template.module';
import { AssessmentModule } from '../assessment/assessment.module';
import { MeasurementScaleModule } from '../measurement-scale/measurement-scale.module';
import { Component, SubComponent } from '@database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Country,
      Domain,
      Component,
      SubComponent,
      Assessment,
    ]),
    TemplateModule,
    AssessmentModule,
    MeasurementScaleModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 