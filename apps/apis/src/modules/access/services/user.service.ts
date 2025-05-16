import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import { ConfigType } from '../../../config/types';
import { User, Role, Profile, Permission } from '../../../database/entities';
import { CrudService } from '../../../shared/services';
import {
  UserCreateRequestDto,
  UserUpdateRequestDto,
  UpdatePasswordRequestDto,
} from '../dtos';
import { pick } from '../../../shared/helpers';
import { USER_FIELD_CONFIG } from '../config/user-field-config';
import { LanguageEnum } from '../../../shared';

@Injectable()
export class UserService extends CrudService<User> {
  private readonly loggerService = new Logger(UserService.name);
  protected includes = USER_FIELD_CONFIG.includeRelations;
  protected selectable = USER_FIELD_CONFIG.selectableFields;
  protected searchable = USER_FIELD_CONFIG.searchableFields;
  protected filterable = USER_FIELD_CONFIG.filterableFields;
  protected sortable = USER_FIELD_CONFIG.sortableFields;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<ConfigType>,
  ) {
    super(userRepository);
  }

  async create(payload: UserCreateRequestDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const roles = await manager
        .getRepository(Role)
        .findBy({ id: In(payload.roleIds) });
      if (roles.length !== payload.roleIds.length) {
        throw new BadRequestException('access.exception.invalidRoleIds');
      }

      const permissions = payload.permissionsIds
        ? await manager
            .getRepository(Permission)
            .findBy({ id: In(payload.permissionsIds) })
        : [];
      if (
        payload.permissionsIds &&
        permissions.length !== payload.permissionsIds.length
      ) {
        throw new BadRequestException('access.exception.invalidPermissionIds');
      }

      const userRepository = manager.getRepository(User);
      const user = userRepository.create({
        isAdmin: true,
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        password: payload.password,
        status: payload.status,
        roles,
        permissions,
        lang: LanguageEnum.EN,
      });

      await userRepository.save(user).catch((err) => {
        this.loggerService.error('create:', err);
        throw new BadRequestException('access.exception.failedToCreateUser');
      });

      const profileRepository = manager.getRepository(Profile);
      const profile = profileRepository.create({
        userId: user.id,
        ...pick(
          payload,
          'firstName',
          'lastName',
          'email',
          'gender',
          'dateOfBirth',
          'country',
        ),
      });

      await profileRepository.save(profile).catch((err) => {
        this.loggerService.error('create profile:', err);
        throw new BadRequestException(
          'account.exception.failedToCreateProfile',
        );
      });

      return user;
    });
  }

  async update(
    where: FindOptionsWhere<User>,
    payload: UserUpdateRequestDto,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const user = await userRepository
        .findOneOrFail({
          where,
          relations: { roles: true, profile: true, permissions: true },
        })
        .catch((err) => {
          this.loggerService.error('update:', err);
          throw new BadRequestException('access.exception.userNotFound');
        });

      if (
        user.email ===
        this.configService.getOrThrow('app.adminEmail', { infer: true })
      ) {
        this.loggerService.log('update: Super admin cannot be updated');
        throw new ForbiddenException('common.exception.accessDenied');
      }

      await userRepository
        .update(user.id, {
          name: `${payload.firstName} ${payload.lastName}`,
          email: payload.email,
          status: payload.status,
        })
        .catch((err) => {
          this.loggerService.error('update:', err);
          throw new BadRequestException('access.exception.failedToUpdateUser');
        });

      await manager
        .getRepository(Profile)
        .update(
          { userId: user.id },
          {
            ...pick(
              payload,
              'firstName',
              'lastName',
              'email',
              'gender',
              'dateOfBirth',
            ),
          },
        )
        .catch((err) => {
          this.loggerService.error('update profile:', err);
          throw new BadRequestException(
            'account.exception.failedToUpdateProfile',
          );
        });

      const roles = await manager
        .getRepository(Role)
        .findBy({ id: In(payload.roleIds) });
      if (roles.length !== payload.roleIds.length) {
        throw new BadRequestException('access.exception.invalidRoleIds');
      }

      const permissions = payload.permissionsIds
        ? await manager
            .getRepository(Permission)
            .findBy({ id: In(payload.permissionsIds) })
        : [];
      if (
        payload.permissionsIds &&
        permissions.length !== payload.permissionsIds.length
      ) {
        throw new BadRequestException('access.exception.invalidPermissionIds');
      }

      await userRepository
        .createQueryBuilder()
        .relation('roles')
        .of(user)
        .addAndRemove(roles, user.roles)
        .catch((err) => {
          this.loggerService.error('update roles:', err);
          throw new BadRequestException(
            'access.exception.failedToUpdateUserRoles',
          );
        });

      await userRepository
        .createQueryBuilder()
        .relation('permissions')
        .of(user)
        .addAndRemove(permissions, user.permissions)
        .catch((err) => {
          this.loggerService.error('update permissions:', err);
          throw new BadRequestException(
            'access.exception.failedToUpdateUserPermissions',
          );
        });

      return userRepository.findOneOrFail({
        where: { id: user.id },
        relations: { roles: true, profile: true, permissions: true },
      });
    });
  }

  async updatePassword(
    id: string,
    payload: UpdatePasswordRequestDto,
  ): Promise<User> {
    const user = await this.userRepository
      .findOneByOrFail({ id, isAdmin: true })
      .catch((err) => {
        this.loggerService.error('updatePassword:', err);
        throw new BadRequestException('access.exception.userNotFound');
      });

    await this.userRepository
      .update(id, {
        password: payload.password,
        lastPasswordUpdatedAt: new Date(),
      })
      .catch((err) => {
        this.loggerService.error('updatePassword:', err);
        throw new BadRequestException(
          'access.exception.failedToUpdatePassword',
        );
      });

    return this.userRepository.findOneByOrFail({ id });
  }

  async delete(where: FindOptionsWhere<User>): Promise<User> {
    const user = await this.findOrFail({ where });
    if (
      user.email ===
      this.configService.getOrThrow('app.adminEmail', { infer: true })
    ) {
      this.loggerService.log('delete: Super admin cannot be deleted');
      throw new ForbiddenException('common.exception.accessDenied');
    }

    await this.userRepository.softRemove(user).catch((err) => {
      this.loggerService.error('delete:', err);
      throw new BadRequestException('common.exception.failedToDeleteUser');
    });

    return user;
  }

  async restore(where: FindOptionsWhere<User>): Promise<User> {
    const user = await this.findOrFail({ where, withDeleted: true });
    if (
      user.email ===
      this.configService.getOrThrow('app.adminEmail', { infer: true })
    ) {
      this.loggerService.log('restore: Super admin cannot be restored');
      throw new ForbiddenException('common.exception.accessDenied');
    }

    await this.userRepository.recover(user).catch((err) => {
      this.loggerService.error('restore:', err);
      throw new BadRequestException('common.exception.failedToRestoreUser');
    });

    return user;
  }
}
