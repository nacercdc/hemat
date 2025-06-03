import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Role, Permission } from '../../../database/entities';
import { QueryService } from '../../../shared/services';
import {
  CreateRoleDto,
  FindAllRoleDto,
  FindOneRoleDto,
  UpdateRoleDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { DEFAULT_ROLES } from '../../../shared/constants';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: FindAllRoleDto): Promise<FindAllResponseDto<Role>> {
    return new QueryService<Role>(this.roleRepository)
      .join(query.include)
      .filter([], { fields: ['name'], value: query.search })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(id: string, query: FindOneRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: query.include,
    });

    if (!role) {
      throw new NotFoundException(`Role ${id} not found.`);
    }

    return role;
  }

  async create(payload: CreateRoleDto): Promise<Role> {
    return this.dataSource.transaction(async (manager) => {
      const permissions = await manager
        .getRepository(Permission)
        .findBy({ id: In(payload.permissionsIds) });

      const role = manager.getRepository(Role).create({
        name: payload.name,
        description: payload.description,
        permissions,
      });

      try {
        return await manager.getRepository(Role).save(role);
      } catch (err) {
        this.logger.error('create:', err);
        throw new BadRequestException('Failed to create role.');
      }
    });
  }

  async update(id: string, payload: UpdateRoleDto): Promise<Role> {
    return this.dataSource.transaction(async (manager) => {
      const role = await manager.getRepository(Role).findOne({
        where: { id },
        relations: ['permissions'],
      });

      if (!role) {
        throw new NotFoundException(`Role ${id} not found.`);
      }

      if (role.name === DEFAULT_ROLES.SUPER_ADMIN) {
        throw new ForbiddenException('Cannot update super admin role.');
      }

      const permissions = await manager
        .getRepository(Permission)
        .findBy({ id: In(payload.permissionsIds) });

      role.name = payload.name;
      role.description = payload.description;
      role.permissions = permissions;

      try {
        return await manager.getRepository(Role).save(role);
      } catch (err) {
        this.logger.error('update:', err);
        throw new BadRequestException('Failed to update role.');
      }
    });
  }

  async delete(id: string): Promise<Role> {
    return this.dataSource.transaction(async (manager) => {
      const role = await manager.getRepository(Role).findOne({
        where: { id },
        relations: ['users'],
      });

      if (!role) {
        throw new NotFoundException(`Role ${id} not found.`);
      }

      if (role.name === DEFAULT_ROLES.SUPER_ADMIN) {
        throw new ForbiddenException('Cannot delete super admin role.');
      }

      try {
        return await manager.getRepository(Role).softRemove(role);
      } catch (err) {
        this.logger.error('delete:', err);
        throw new BadRequestException('Failed to delete role.');
      }
    });
  }

  async restore(id: string): Promise<Role> {
    return this.dataSource.transaction(async (manager) => {
      const role = await manager.getRepository(Role).findOne({
        where: { id },
        withDeleted: true,
      });

      if (!role) {
        throw new NotFoundException(`Role ${id} not found.`);
      }

      if (role.name === DEFAULT_ROLES.SUPER_ADMIN) {
        throw new ForbiddenException('Cannot restore super admin role.');
      }

      try {
        return await manager.getRepository(Role).recover(role);
      } catch (err) {
        this.logger.error('restore:', err);
        throw new BadRequestException('Failed to restore role.');
      }
    });
  }
}