import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import { Role, Permission } from '../../../database/entities';
import { CrudService } from '../../../shared/services';
import { RoleCreateRequestDto, RoleUpdateRequestDto } from '../dtos';
import { pick } from '../../../shared/helpers';
import { DEFAULT_ROLES } from '../../../shared/constants';
import { ROLE_FIELD_CONFIG } from '../config/role-field-config';

@Injectable()
export class RoleService extends CrudService<Role> {
  private readonly loggerService = new Logger(RoleService.name);
  protected includes = ROLE_FIELD_CONFIG.includeRelations;
  protected selectable = ROLE_FIELD_CONFIG.selectableFields;
  protected searchable = ROLE_FIELD_CONFIG.searchableFields;
  protected filterable = ROLE_FIELD_CONFIG.filterableFields;
  protected sortable = ROLE_FIELD_CONFIG.sortableFields;
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {
    super(roleRepository);
  }

  async create(payload: RoleCreateRequestDto): Promise<Role> {
    return this.dataSource.transaction(async (manager) => {
      const permissions = await manager
        .getRepository(Permission)
        .findBy({ id: In(payload.permissionsIds) });
      if (permissions.length !== payload.permissionsIds.length) {
        throw new BadRequestException('access.exception.invalidPermissionIds');
      }

      const roleRepository = manager.getRepository(Role);
      const role = roleRepository.create({
        ...pick(payload, 'name', 'description'),
        permissions,
      });

      await roleRepository.save(role).catch((err) => {
        this.loggerService.error('create:', err);
        throw new BadRequestException('access.exception.failedToCreateRole');
      });

      return role;
    });
  }

  async update(
    where: FindOptionsWhere<Role>,
    payload: RoleUpdateRequestDto,
  ): Promise<Role> {
    return this.dataSource.transaction(async (manager) => {
      const roleRepository = manager.getRepository(Role);
      const role = await roleRepository
        .findOneOrFail({
          where,
          relations: { permissions: true },
        })
        .catch((err) => {
          this.loggerService.error('update:', err);
          throw new BadRequestException('access.exception.roleNotFound');
        });

      if (role.name === DEFAULT_ROLES.SUPER_ADMIN) {
        this.loggerService.log('update: Super admin role cannot be updated');
        throw new ForbiddenException('common.exception.accessDenied');
      }

      const input = pick(payload, 'name', 'description');
      await roleRepository.update(role.id, input).catch((err) => {
        this.loggerService.error('update:', err);
        throw new BadRequestException('access.exception.failedToUpdateRole');
      });

      const permissions = await manager
        .getRepository(Permission)
        .findBy({ id: In(payload.permissionsIds) });
      if (permissions.length !== payload.permissionsIds.length) {
        throw new BadRequestException('access.exception.invalidPermissionIds');
      }

      await roleRepository
        .createQueryBuilder()
        .relation('permissions')
        .of(role)
        .addAndRemove(permissions, role.permissions)
        .catch((err) => {
          this.loggerService.error('update permissions:', err);
          throw new BadRequestException(
            'access.exception.failedToUpdateRolePermissions',
          );
        });

      return roleRepository.findOneOrFail({
        where: { id: role.id },
        relations: { permissions: true },
      });
    });
  }

  async delete(where: FindOptionsWhere<Role>): Promise<Role> {
    const role = await this.findOrFail({ where });
    if (role.name === DEFAULT_ROLES.SUPER_ADMIN) {
      this.loggerService.log('delete: Super admin role cannot be deleted');
      throw new ForbiddenException('common.exception.accessDenied');
    }

    await this.roleRepository.softRemove(role).catch((err) => {
      this.loggerService.error('delete:', err);
      throw new BadRequestException('common.exception.failedToDeleteRole');
    });

    return role;
  }

  async restore(where: FindOptionsWhere<Role>): Promise<Role> {
    const role = await this.findOrFail({ where, withDeleted: true });
    if (role.name === DEFAULT_ROLES.SUPER_ADMIN) {
      this.loggerService.log('restore: Super admin role cannot be restored');
      throw new ForbiddenException('common.exception.accessDenied');
    }

    await this.roleRepository.recover(role).catch((err) => {
      this.loggerService.error('restore:', err);
      throw new BadRequestException('common.exception.failedToRestoreRole');
    });

    return role;
  }
}
