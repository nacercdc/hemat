import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { User } from '../../../../database/entities';
import { ConfigType } from '../../../../config';
import { HashHelper } from '../../../helpers';
import { AuthDto } from '../dtos';

@Injectable()
export class AuthRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger = new Logger(AuthRefreshStrategy.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<ConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  async validate(req: Request, payload: AuthDto) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      this.logger.log('validate: Refresh token not found.');
      throw new UnauthorizedException('account.exception.invalidRefreshToken');
    }

    const user = await this.dataSource.getRepository(User).findOneBy({ id: payload.id });

    if (!user || !user.refreshToken) {
      this.logger.log('validate: User not found.');
      throw new UnauthorizedException('account.exception.invalidRefreshToken');
    }

    const isValidToken = await HashHelper.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isValidToken) {
      this.logger.log('validate: Invalid token.');
      throw new UnauthorizedException('account.exception.invalidRefreshToken');
    }

    return payload;
  }
}
