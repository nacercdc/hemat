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
    const user = await this.dataSource
      .getRepository(User)
      .findOne({
        where: { id: auth.id },
        relations: ['roles.permissions'],
      })
      .catch((err) => {
        this.logger.error('createForUser:', err);
      });

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
