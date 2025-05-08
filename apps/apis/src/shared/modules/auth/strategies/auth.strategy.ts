import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigType } from '../../../../config';
import { AuthDto } from '../dtos';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<ConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.secret', { infer: true }),
    });
  }

  async validate(payload: AuthDto) {
    return payload;
  }
}
