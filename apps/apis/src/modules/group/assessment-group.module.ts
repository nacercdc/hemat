import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AssessmentGroup,
  AssessmentMember,
  Assessment,
  User,
} from '../../database/entities';
import { GroupService, MemberService } from './services';
import { GroupController, MemberController } from './controllers';
import { AuthModule } from '../../shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentGroup,
      AssessmentMember,
      Assessment,
      User,
    ]),
    AuthModule,
  ],
  controllers: [GroupController, MemberController],
  providers: [GroupService, MemberService],
  exports: [GroupService, MemberService],
})
export class AssessmentGroupModule {}
