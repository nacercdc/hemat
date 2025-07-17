import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../../database/entities/country.entity';
import { Domain } from '../../database/entities/domain.entity';
import { Assessment } from '../../database/entities/assessment.entity';
import { TemplateModule } from '../template/template.module';
import { AssessmentModule } from '../assessment/assessment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Domain, Assessment]), TemplateModule, AssessmentModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 