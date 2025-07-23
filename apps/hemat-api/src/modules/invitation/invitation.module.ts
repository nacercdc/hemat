import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Invitation,
  Assessment,
  AssessmentGroup,
  AssessmentMember,
  User,
  AssessmentDomain,
  AssessmentSubComponent,
  AssessmentComponent,
  AssessmentMeasurementScaleSubComponent,
} from '../../database/entities';
import { InvitationService } from './services';
import { InvitationController } from './controllers';
import { AuthModule } from '@shared/modules';
import { AssessmentModule } from '../assessment';
import { GroupService } from './services/group.service';
import { AssessmentRoleService } from './services/assessment-role.service';
import { EmailService } from '../../shared/services/email.service';
import { InvitationListener } from './listeners/invitation.listener';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invitation,
      Assessment,
      AssessmentGroup,
      AssessmentMember,
      User,
      AssessmentDomain,
      AssessmentSubComponent,
      AssessmentComponent,
      AssessmentMeasurementScaleSubComponent,
    ]),
    AuthModule,
    AssessmentModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [InvitationController],
  providers: [InvitationService, GroupService, AssessmentRoleService, EmailService, InvitationListener],
  exports: [InvitationService],
})
export class InvitationModule {}
