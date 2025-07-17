import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import {
  PermissionActionEnum,
  ENTITY_CLASS_TO_PERMISSION_SUBJECT,
} from '../../shared/enums/permission.enum';
import { ActivityLog } from '../entities/activity-log.entity';
import { BaseEntityWithSoftDelete } from '../entities/entity';

@EventSubscriber()
export class ActivityLogSubscriber
  implements EntitySubscriberInterface<BaseEntityWithSoftDelete>
{
  constructor() {}

  listenTo() {
    return BaseEntityWithSoftDelete;
  }

  async afterInsert(event: InsertEvent<BaseEntityWithSoftDelete>) {
    await this.logActivity(event, PermissionActionEnum.CREATE);
  }

  async afterUpdate(event: UpdateEvent<BaseEntityWithSoftDelete>) {
   const before = event.databaseEntity?.deletedAt;
    const after = event.entity?.deletedAt;
    console.log('Soft delete detection - before:', before, 'after:', after);

    let isSoftDelete = false;
    if (
      (before === null || before === undefined) &&
      after !== null &&
      after !== undefined
    ) {
      if (after instanceof Date) {
        isSoftDelete = true;
      } else if (typeof after === 'string') {
        const d = new Date(after);
        isSoftDelete = !isNaN(d.getTime());
      } else if (after) {
        isSoftDelete = true;
      }
    }

    if (isSoftDelete) {
      console.log('Soft delete detected, logging DELETE action');
      await this.logActivity(event, PermissionActionEnum.DELETE);
    } else {
      await this.logActivity(event, PermissionActionEnum.UPDATE);
    }
  }

  async afterRemove(event: RemoveEvent<BaseEntityWithSoftDelete>) {
  }

  async afterSoftRemove(event: any) {
    console.log('afterSoftRemove event:', event.entity);
    await this.logActivity(event, PermissionActionEnum.DELETE);
  }

  async afterSoftDelete(event: any) {
    console.log('afterSoftDelete event:', event.entity);
    await this.logActivity(event, PermissionActionEnum.DELETE);
  }

  private async logActivity(
    event:
      | InsertEvent<BaseEntityWithSoftDelete>
      | UpdateEvent<BaseEntityWithSoftDelete>
      | RemoveEvent<BaseEntityWithSoftDelete>,
    action: PermissionActionEnum,
  ) {
    const entity = (event as any).entity || (event as any).databaseEntity;
    if (!entity || !entity.id) {
      console.log('logActivity: No entity or id found', entity);
      return;
    }
    const userId = (entity as any).userId || null;
    const entityClassName = entity.constructor.name;
    const entityEnum = ENTITY_CLASS_TO_PERMISSION_SUBJECT[entityClassName];
    if (!entityEnum) {
      console.log('logActivity: No entityEnum found for', entityClassName);
      return;
    }
    const repo = event.manager.getRepository(ActivityLog);
    await repo.insert({
      userId,
      entity: entityEnum,
      entityId: entity.id,
      action,
    });
  }
}
