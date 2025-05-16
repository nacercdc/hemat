import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../../database/entities';
import { CrudService } from '../../../shared/services';
import { PERMISSION_FIELD_CONFIG } from '../config/permission-field-config';
import { PermissionActionEnum, PermissionSubjectEnum } from '../../../shared';

@Injectable()
export class PermissionService extends CrudService<Permission> {
  private readonly loggerService = new Logger(PermissionService.name);
  protected includes = PERMISSION_FIELD_CONFIG.includeRelations;
  protected selectable = PERMISSION_FIELD_CONFIG.selectableFields;
  protected searchable = PERMISSION_FIELD_CONFIG.searchableFields;
  protected filterable = PERMISSION_FIELD_CONFIG.filterableFields;
  protected sortable = PERMISSION_FIELD_CONFIG.sortableFields;
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }

  async initializePermissions(): Promise<Permission[]> {
    const actions = Object.values(PermissionActionEnum);
    const subjects = Object.values(PermissionSubjectEnum);
    const permissions: Permission[] = [];

    for (const action of actions) {
      for (const subject of subjects) {
        let permission = await this.permissionRepository.findOne({
          where: { action, subject },
        });
        if (!permission) {
          permission = this.permissionRepository.create({
            action,
            subject,
            description: `${action} permission on ${subject}`,
          });
          await this.permissionRepository.save(permission).catch((err) => {
            this.loggerService.error(
              `initializePermissions: ${action}-${subject}`,
              err,
            );
            throw new Error(`Failed to create permission ${action}-${subject}`);
          });
        }
        permissions.push(permission);
      }
    }

    return permissions;
  }
}
