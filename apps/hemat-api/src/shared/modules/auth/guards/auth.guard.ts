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
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const auth = await this.verifyToken(request);

    const abilityParams = this.reflector.get<
      AbilityParams & { requireAdmin?: boolean }
    >(ABILITIES, context.getHandler());

    // Enforce isAdmin only if explicitly required
    if (
      abilityParams &&
      typeof abilityParams.isAdmin === 'boolean' &&
      abilityParams.requireAdmin !== false
    ) {
      if (abilityParams.isAdmin !== auth?.isAdmin) {
        throw new ForbiddenException('account.exception.accessDenied');
      }
    }

    // Check permissions only for admins or if requireAdmin is true
    if (
      abilityParams?.permissions &&
      (auth?.isAdmin || abilityParams.requireAdmin)
    ) {
      await this.checkPermissions(auth, abilityParams.permissions);
    }

    request.user = auth;
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
