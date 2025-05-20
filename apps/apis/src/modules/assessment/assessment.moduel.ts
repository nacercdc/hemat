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
import { AssessmentController } from './controllers';
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
    ]),
    AuthModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
