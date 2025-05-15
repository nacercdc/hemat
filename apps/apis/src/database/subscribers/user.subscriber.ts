import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../../database/entities';
import { HashHelper } from '../../shared/helpers';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity?.password && !event.entity.password.startsWith('$2')) {
      event.entity.password = await HashHelper.encrypt(event.entity.password);
    }

    if (
      event.entity?.refreshToken &&
      !event.entity.refreshToken.startsWith('$2')
    ) {
      event.entity.refreshToken = await HashHelper.encrypt(
        event.entity.refreshToken,
      );
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity?.password && !event.entity.password.startsWith('$2')) {
      event.entity.password = await HashHelper.encrypt(event.entity.password);
    }

    if (
      event.entity?.refreshToken &&
      !event.entity.refreshToken.startsWith('$2')
    ) {
      event.entity.refreshToken = await HashHelper.encrypt(
        event.entity.refreshToken,
      );
    }
  }
}
