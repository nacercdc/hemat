import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile, AssessmentMember } from '../../database/entities';
import { AuthModule } from '../../shared/modules';
import { UserService, ProfileService } from './services';
import { UserController, ProfileController } from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, AssessmentMember]), 
    AuthModule,
  ],
  providers: [UserService, ProfileService],
  controllers: [UserController, ProfileController],
})
export class AccountModule {}
