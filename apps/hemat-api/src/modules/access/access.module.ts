import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { User, Role, Permission, Profile } from '../../database/entities';
import { AuthModule } from '../../shared/modules';
import { UserListener } from './listeners/user.listener';
import { EmailService } from '../../shared/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Profile]),
    AuthModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [UserController, RoleController, PermissionController],
  providers: [UserService, RoleService, PermissionService, UserListener, EmailService],
})
export class AccessModule {}
