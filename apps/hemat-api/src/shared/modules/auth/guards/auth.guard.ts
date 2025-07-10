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
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly abilityService: AbilityService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  /**
   * @description Can activate
   * @public
   *
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard canActivate called');
    this.logger.log('AuthGuard canActivate called');
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    const abilityParams = this.reflector.get<
      AbilityParams & { requireAdmin?: boolean }
    >(ABILITIES, context.getHandler());
    console.log('AbilityParams:', JSON.stringify(abilityParams));
    this.logger.log('AbilityParams: ' + JSON.stringify(abilityParams));

    if (isPublic) {
      console.log('Returning early: isPublic');
      this.logger.log('Returning early: isPublic');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const auth = await this.verifyToken(request);

    // Enforce isAdmin only if explicitly required
    if (
      abilityParams &&
      typeof abilityParams.isAdmin === 'boolean' &&
      abilityParams.requireAdmin !== false
    ) {
      if (abilityParams.isAdmin !== auth?.isAdmin) {
        console.log('Returning early: isAdmin mismatch');
        this.logger.log('Returning early: isAdmin mismatch');
        throw new ForbiddenException('account.exception.accessDenied');
      }
    }
    // Add log to confirm flow continues
    console.log('Passed admin check, moving to permission/role checks');
    this.logger.log('Passed admin check, moving to permission/role checks');

    // Check permissions only for admins or if requireAdmin is true
    if (
      abilityParams?.permissions &&
      (auth?.isAdmin || abilityParams.requireAdmin)
    ) {
      console.log('Checking permissions for admin...');
      this.logger.log('Checking permissions for admin...');
      await this.checkPermissions(auth, abilityParams.permissions);
      request.user = auth;
      console.log('Returning: allowed by admin permission');
      this.logger.log('Returning: allowed by admin permission');
      return true;
    }

    // Check for allowed roles (for non-admins)
    if (abilityParams?.roles && Array.isArray(abilityParams.roles) && abilityParams.roles.length > 0) {
      const userRole = (auth as any).assessmentRole || (auth as any).role;
      if (!userRole || !abilityParams.roles.includes(userRole)) {
        console.log('Returning early: role not allowed');
        this.logger.log('Returning early: role not allowed');
        throw new ForbiddenException('account.exception.accessDenied');
      }
      // If role matches, allow access
      console.log('Returning: allowed by role');
      this.logger.log('Returning: allowed by role');
      request.user = auth;
      return true;
    }

    request.user = auth;
    console.log('Returning: default allow');
    this.logger.log('Returning: default allow');
    return true;
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
      throw new UnauthorizedException('account.exception.invalidToken');
    }

    return this.authService
      .verify(
        token,
        this.configService.getOrThrow('auth.secret', { infer: true }),
      )
      .catch((err) => {
        this.logger.error('verifyToken:', err);
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
        this.logger.error('checkPermissions:', err);
        throw new ForbiddenException('account.exception.accessDenied');
      });

    try {
      permissions.forEach((permission) => {
        ForbiddenError.from(ability).throwUnlessCan(
          permission.action,
          permission.subject,
        );
      });
    } catch (err) {
      this.logger.error('checkPermissions:', err);
      throw new ForbiddenException('account.exception.accessDenied');
    }
  }
}
