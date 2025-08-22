import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ForbiddenError } from '@casl/ability';
import { Request } from 'express';
import { ConfigType } from '../../../../config';
import { getBearerToken } from '../../../helpers';
import { AbilityParams, PermissionRule } from '../../../types';
import { ABILITIES } from '../../../constants';
import { AbilityService, AuthService } from '../services';
import { AuthDto } from '../dtos';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly abilityService: AbilityService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  /**
   * @description Determines if the request can proceed based on authentication and permissions
   * @public
   *
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('PermissionGuard canActivate called');
    console.log('PermissionGuard canActivate called');

    // Check if the endpoint is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log('Returning early: isPublic');
      console.log('Returning early: isPublic');
      return true;
    }

    // Get ability metadata
    const abilityParams = this.reflector.getAllAndOverride<AbilityParams | undefined>(
      ABILITIES,
      [context.getHandler(), context.getClass()],
    );

    this.logger.log(`AbilityParams: ${JSON.stringify(abilityParams)}`);
    console.log(`AbilityParams: ${JSON.stringify(abilityParams)}`);

    // Verify token and get user
    const request = context.switchToHttp().getRequest<Request>();
    const auth = await this.verifyToken(request);

    // If no abilityParams, deny access by default unless public
    if (!abilityParams) {
      this.logger.warn('No ability params defined, denying access');
      console.log('No ability params defined, denying access');
      throw new ForbiddenException('account.exception.accessDenied');
    }

    // Check admin requirement
    if (abilityParams.requireAdmin && !auth.isAdmin) {
      this.logger.log('User is not admin, denying access');
      console.log('User is not admin, denying access');
      throw new ForbiddenException('account.exception.accessDenied');
    }

    // Check permissions if defined
    if (abilityParams.permissions && abilityParams.permissions.length > 0) {
      this.logger.log('Checking permissions...');
      console.log('Checking permissions...');
      await this.checkPermissions(auth, abilityParams.permissions);
      this.logger.log('User has required permissions, allowing access');
      console.log('User has required permissions, allowing access');
      request.user = auth;
      return true;
    }

    // Deny access if no permissions are defined
    this.logger.warn('No permissions defined, denying access');
    console.log('No permissions defined, denying access');
    throw new ForbiddenException('account.exception.accessDenied');
  }

  /**
   * @description Verify JWT token
   * @private
   *
   * @param {Request} request
   * @returns {Promise<AuthDto>}
   */
  private async verifyToken(request: Request): Promise<AuthDto> {
    const token = getBearerToken(request);

    if (!token) {
      this.logger.warn('No token provided, denying access');
      console.log('No token provided, denying access');
      throw new UnauthorizedException('account.exception.invalidToken');
    }

    return this.authService
      .verify(
        token,
        this.configService.getOrThrow('auth.secret', { infer: true }),
      )
      .catch((err) => {
        this.logger.error('verifyToken:', err);
        console.log('verifyToken error:', err);
        throw new UnauthorizedException('account.exception.invalidToken');
      });
  }

  /**
   * @description Check for permissions
   * @private
   *
   * @param {AuthDto} auth
   * @param {PermissionRule[]} permissions
   * @returns {Promise<void>}
   */
  private async checkPermissions(
    auth: AuthDto,
    permissions: PermissionRule[],
  ): Promise<void> {
    const ability = await this.abilityService
      .createForUser(auth)
      .catch((err) => {
        this.logger.error('checkPermissions: Failed to create ability', err);
        console.log('checkPermissions: Failed to create ability', err);
        throw new ForbiddenException('account.exception.accessDenied');
      });

    this.logger.log(`User ID: ${auth.id}, Permissions: ${JSON.stringify(ability.rules)}`);
    console.log(`User ID: ${auth.id}, Permissions: ${JSON.stringify(ability.rules)}`);

    try {
      permissions.forEach((permission) => {
        this.logger.log(
          `Checking permission: ${permission.action}:${permission.subject}`,
        );
        console.log(
          `Checking permission: ${permission.action}:${permission.subject}`,
        );
        ForbiddenError.from(ability).throwUnlessCan(
          permission.action,
          permission.subject,
        );
      });
    } catch (err) {
      this.logger.error('checkPermissions: Permission check failed', err);
      console.log('checkPermissions: Permission check failed', err);
      throw new ForbiddenException('account.exception.accessDenied');
    }
  }
}