import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Invitation,
  Assessment,
  AssessmentGroup,
  AssessmentMember,
} from '../../database/entities';
import { InvitationService } from './services';
import { InvitationController } from './controllers';
import { AuthModule } from '../../shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invitation,
      Assessment,
      AssessmentGroup,
      AssessmentMember,
    ]),
    AuthModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
