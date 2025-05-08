import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { validateConfig } from '../shared/helpers';
import { AuthConfig } from './types';

class AuthEnvironmentValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsInt()
  @IsOptional()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: number;

  @IsInt()
  @IsOptional()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: number;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, AuthEnvironmentValidator);

  return {
    secret:
      process.env.AUTH_JWT_SECRET ||
      '32e8ce152d03053bc06535be4916345f04c874d86cadc39d5b9ef1570f5d39c2',
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '15m',
    refreshSecret:
      process.env.AUTH_REFRESH_SECRET ||
      'b82a645ec0ea881582aaabc931a7758c332c1c9e27fc1ae83ccd3006f76c90fb',
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN || '365d',
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN
      ? parseInt(process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN, 10)
      : 15,
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN
      ? parseInt(process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN, 10)
      : 15,
  };
});
