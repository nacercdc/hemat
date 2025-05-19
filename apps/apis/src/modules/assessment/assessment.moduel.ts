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
} from '../../database/entities';
import { AssessmentService } from './services';
import { AssessmentDomainCopyService } from './services/assessment-domain-copy.service';
import { AssessmentController } from './controllers';

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
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService, AssessmentDomainCopyService],
  exports: [AssessmentService, AssessmentDomainCopyService],
})
export class AssessmentModule {}
