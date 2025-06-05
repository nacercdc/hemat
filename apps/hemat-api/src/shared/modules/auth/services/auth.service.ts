import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '../../../../config';
import { AuthDto, LoginResponseDto } from '../dtos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  /**
   * @description Verify JWT service
   * @public
   * @param {string} token JWT token
   * @param {string} secret "refresh" or "access"
   * @returns {Promise<AuthDto>} decrypted payload from JWT
   */
  public async verify(token: string, secret: string): Promise<AuthDto> {
    const decoded = this.jwtService.verify<AuthDto>(token, { secret });

    if (!decoded) {
      this.logger.log('verify: Invalid token.');
      throw new UnauthorizedException('account.exception.invalidToken');
    }

    return decoded;
  }

  /**
   * @description Decodes JWT token
   * @public
   * @param {string} token
   * @returns {AuthDto} Returns id and username
   */
  public decode(token: string): AuthDto {
    return this.jwtService.decode<AuthDto>(token);
  }

  /**
   * @description Generate JWT access and refresh token
   * @public
   * @param {AuthDto} payload
   * @returns {LoginResponseDto} Returns access and refresh tokens with expiry
   */
  public async generate(payload: AuthDto): Promise<LoginResponseDto> {
    const [token, refreshToken] = await Promise.all([
      this.generateAccess(payload),
      this.generateRefresh(payload),
    ]);

    return {
      token,
      expires: this.configService.getOrThrow('auth.expires', { infer: true }),
      refreshToken,
    };
  }

  /**
   * @description Generate JWT token
   * @public
   * @param {AuthDto} payload
   * @returns {string}
   */
  public async generateAccess(payload: AuthDto): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      expiresIn: this.configService.getOrThrow('auth.expires', { infer: true }),
    });
  }

  /**
   * @description Generate JWT refresh token
   * @public
   * @param {AuthDto} payload
   * @returns {string}
   */
  public async generateRefresh(payload: AuthDto): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
      expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
        infer: true,
      }),
    });
  }
}
