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
   * @description Creates ability for a user based on role-based and direct permissions
   * @public
   * @param {AuthDto} auth
   * @returns {Promise<Ability>} User ability
   */
  public async createForUser(auth: AuthDto) {
    this.logger.log(`AbilityService called for user: ${auth.id}`);
    console.log(`AbilityService called for user: ${auth.id}`);

    const user = await this.dataSource
      .getRepository(User)
      .findOne({
        where: { id: auth.id },
        relations: ['roles', 'roles.permissions', 'permissions'],
      })
      .catch((err) => {
        this.logger.error(`createForUser: Failed to fetch user ${auth.id}`, err);
        console.log(`createForUser: Failed to fetch user ${auth.id}`, err);
        throw new Error('User not found');
      });

    if (!user) {
      this.logger.error(`User not found: ${auth.id}`);
      console.log(`User not found: ${auth.id}`);
      throw new Error('User not found');
    }

    // Log roles and permissions for debugging
    this.logger.log(`User roles: ${JSON.stringify(user.roles)}`);
    console.log(`User roles: ${JSON.stringify(user.roles)}`);
    this.logger.log(
      `Role permissions: ${JSON.stringify(user.roles?.flatMap((r) => r.permissions))}`,
    );
    console.log(
      `Role permissions: ${JSON.stringify(user.roles?.flatMap((r) => r.permissions))}`,
    );
    this.logger.log(`Direct user permissions: ${JSON.stringify(user.permissions)}`);
    console.log(`Direct user permissions: ${JSON.stringify(user.permissions)}`);

    const { can, build } = new AbilityBuilder(createMongoAbility);

    // Role-based permissions
    (user.roles || []).forEach((role) => {
      (role.permissions || []).forEach((permission) => {
        const { action, subject } = permission;
        can(action, subject);
      });
    });

    // Direct user permissions
    (user.permissions || []).forEach((permission) => {
      const { action, subject } = permission;
      can(action, subject);
    });

    const ability = build();
    this.logger.log(`User ${auth.id} abilities: ${JSON.stringify(ability.rules)}`);
    console.log(`User ${auth.id} abilities: ${JSON.stringify(ability.rules)}`);
    return ability;
  }
}
