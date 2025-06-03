import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { User, Role, Permission, Profile } from '../../database/entities';
import { AuthModule } from '../../shared/modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Profile]),
    AuthModule,
  ],
  controllers: [UserController, RoleController, PermissionController],
  providers: [UserService, RoleService, PermissionService],
})
export class AccessModule {}
