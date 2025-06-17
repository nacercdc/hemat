import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Invitation,
  Assessment,
  AssessmentGroup,
  AssessmentMember,
  User,
} from '../../database/entities';
import { InvitationService } from './services';
import { InvitationController } from './controllers';
import { AuthModule } from '@shared/modules';
import { AssessmentModule } from '../assessment';
import { GroupService } from './services/group.service';
import { AssessmentRoleService } from './services/assessment-role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invitation,
      Assessment,
      AssessmentGroup,
      AssessmentMember,
      User,
    ]),
    AuthModule,
    AssessmentModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService, GroupService, AssessmentRoleService],
  exports: [InvitationService],
})
export class InvitationModule {}
