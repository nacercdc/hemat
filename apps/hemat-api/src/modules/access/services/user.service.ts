import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { ConfigType } from '@config/types';
import { User, Role, Profile, Permission } from '@database/entities';
import { Filter, QueryService } from '@shared/services';
import {
  FindAllUserDto,
  FindOneUserDto,
  UserCreateRequestDto,
  UserUpdateRequestDto,
  UpdatePasswordRequestDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { LanguageEnum } from '@shared/enums';
import { UserStatusEnum } from '@shared/enums';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  async findAll(query: FindAllUserDto): Promise<FindAllResponseDto<User>> {
    try {
      return await new QueryService<User>(this.userRepository)
        .join(query.include)
        .filter(this.filters(query), {
          fields: ['name', 'email'],
          value: query.search,
        })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findAll:', err);
      throw new BadRequestException('Failed to fetch users.');
    }
  }

  async findOne(id: string, query: FindOneUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isAdmin: true },
      relations: query.include,
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found.`);
    }

    return user;
  }

  async create(
    payload: UserCreateRequestDto,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const roles = await manager
        .getRepository(Role)
        .findBy({ id: In(payload.roleIds) });
      const permissions = payload.permissionsIds
        ? await manager
            .getRepository(Permission)
            .findBy({ id: In(payload.permissionsIds) })
        : [];

      const generatedPassword = this.generateRandomPassword();

      const user = manager.getRepository(User).create({
        isAdmin: true,
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        password: generatedPassword,
        roles,
        permissions,
        lang: LanguageEnum.EN,
      });

      try {
        const savedUser = await manager.getRepository(User).save(user);
        const profile = manager.getRepository(Profile).create({
          user: savedUser,
          title: payload.title,
          firstName: payload.firstName,
          lastName: payload.lastName,
          username: payload.username,
          gender: payload.gender,
          dateOfBirth: payload.dateOfBirth,
          country: payload.country,
        });

        await manager.getRepository(Profile).save(profile);
        return { ...savedUser };
      } catch (err) {
        this.logger.error('create:', err);
        throw new BadRequestException('Failed to create user.');
      }
    });
  }

  async update(id: string, payload: UserUpdateRequestDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id },
        relations: ['roles', 'profile', 'permissions'],
      });

      if (!user) {
        throw new NotFoundException(`User ${id} not found.`);
      }

      if (
        user.email ===
        this.configService.getOrThrow('app.adminEmail', { infer: true })
      ) {
        throw new ForbiddenException('Cannot update super admin user.');
      }

      const roles = await manager
        .getRepository(Role)
        .findBy({ id: In(payload.roleIds) });
      const permissions = payload.permissionsIds
        ? await manager
            .getRepository(Permission)
            .findBy({ id: In(payload.permissionsIds) })
        : [];

      user.name = `${payload.firstName} ${payload.lastName}`;
      user.email = payload.email;
      user.roles = roles;
      user.permissions = permissions;

      try {
        const savedUser = await manager.getRepository(User).save(user);
        await manager.getRepository(Profile).update(
          { user: { id: user.id } },
          {
            title: payload.title,
            firstName: payload.firstName,
            lastName: payload.lastName,
            username: payload.username,
            gender: payload.gender,
            dateOfBirth: payload.dateOfBirth,
            country: payload.country,
          },
        );
        return savedUser;
      } catch (err) {
        this.logger.error('update:', err);
        throw new BadRequestException('Failed to update user.');
      }
    });
  }

  async updatePassword(
    id: string,
    payload: UpdatePasswordRequestDto,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User ${id} not found.`);
      }

      if (
        user.email ===
        this.configService.getOrThrow('app.adminEmail', { infer: true })
      ) {
        throw new ForbiddenException('Cannot update super admin password.');
      }

      await manager.getRepository(User).update(id, {
        password: payload.password,
        lastPasswordUpdatedAt: new Date(),
      });

      const updatedUser = await manager.getRepository(User).findOne({
        where: { id },
      });

      if (!updatedUser) {
        throw new NotFoundException(`User ${id} not found after update.`);
      }

      return updatedUser;
    });
  }

  async delete(id: string): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User ${id} not found.`);
      }

      if (
        user.email ===
        this.configService.getOrThrow('app.adminEmail', { infer: true })
      ) {
        throw new ForbiddenException('Cannot delete super admin user.');
      }

      try {
        return await manager.getRepository(User).softRemove(user);
      } catch (err) {
        this.logger.error('delete:', err);
        throw new BadRequestException('Failed to delete user.');
      }
    });
  }

  async restore(id: string): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id, isAdmin: true },
        withDeleted: true,
      });

      if (!user) {
        throw new NotFoundException(`User ${id} not found.`);
      }

      if (
        user.email ===
        this.configService.getOrThrow('app.adminEmail', { infer: true })
      ) {
        throw new ForbiddenException('Cannot restore super admin user.');
      }

      try {
        return await manager.getRepository(User).recover(user);
      } catch (err) {
        this.logger.error('restore:', err);
        throw new BadRequestException('Failed to restore user.');
      }
    });
  }

  async deactivate(id: string): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id, isAdmin: true },
      });
      if (!user) {
        throw new NotFoundException(`User ${id} not found.`);
      }
      if (
        user.email ===
        this.configService.getOrThrow('app.adminEmail', { infer: true })
      ) {
        throw new ForbiddenException('Cannot deactivate super admin user.');
      }
      user.status = UserStatusEnum.INACTIVE;
      user.disabled = true;
      user.disabledAt = new Date();
      try {
        return await manager.getRepository(User).save(user);
      } catch (err) {
        this.logger.error('deactivate:', err);
        throw new BadRequestException('Failed to deactivate user.');
      }
    });
  }

  async activate(id: string): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id, isAdmin: true },
      });
      if (!user) {
        throw new NotFoundException(`User ${id} not found.`);
      }
      if (
        user.email ===
        this.configService.getOrThrow('app.adminEmail', { infer: true })
      ) {
        throw new ForbiddenException('Cannot activate super admin user.');
      }
      user.status = UserStatusEnum.ACTIVE;
      user.disabled = false;
      user.disabledAt = null;
      try {
        return await manager.getRepository(User).save(user);
      } catch (err) {
        this.logger.error('activate:', err);
        throw new BadRequestException('Failed to activate user.');
      }
    });
  }

  private generateRandomPassword(length = 12): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async setStatus(
    id: string,
    action: 'activate' | 'deactivate',
  ): Promise<User> {
    if (action === 'activate') {
      return this.activate(id);
    } else if (action === 'deactivate') {
      return this.deactivate(id);
    } else {
      throw new BadRequestException('Invalid action.');
    }
  }

  private filters(query: FindAllUserDto): Filter[] {
    const filters: Filter[] = [];
    if (query.status) {
      filters.push({
        field: 'status',
        operator: '=',
        value: query.status,
      });
    }

    return filters;
  }
}
