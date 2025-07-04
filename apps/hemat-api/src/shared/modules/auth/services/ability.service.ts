import { Injectable, Logger } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { DataSource } from 'typeorm';
import { User } from '../../../../database/entities';
import { AuthDto } from '../dtos';

@Injectable()
export class AbilityService {
  private readonly logger = new Logger(AbilityService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * @description Generate JWT access and refresh token
   * @public
   * @param {AuthDto} auth
   * @returns Returns access and refresh tokens with expiry
   */
  public async createForUser(auth: AuthDto) {
    console.log('AbilityService called for user:', auth.id);
    const user = await this.dataSource
      .getRepository(User)
      .findOne({
        where: { id: auth.id },
        relations: ['roles.permissions'],
      })
      .catch((err) => {
        this.logger.error('createForUser:', err);
      });

    // Log roles and permissions at info level for visibility
    this.logger.log('User roles: ' + JSON.stringify(user?.roles));
    this.logger.log('User permissions: ' + JSON.stringify(user?.roles?.flatMap(r => r.permissions)));

    const { can, build } = new AbilityBuilder(createMongoAbility);
    (user?.roles || []).forEach((role) => {
      (role?.permissions || []).forEach((permission) => {
        const { action, subject } = permission;
        can(action, subject);
      });
    });

    return build();
  }
}
