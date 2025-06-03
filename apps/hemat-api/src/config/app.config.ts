import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppConfig } from './types';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class AppEnvironmentValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsInt()
  @IsOptional()
  THROTTLE_TTL: number;

  @IsInt()
  @IsOptional()
  THROTTLE_LIMIT: number;

  @IsInt()
  @IsOptional()
  THROTTLE_BLOCK_DURATION: number;

  @IsString()
  @IsOptional()
  ADMIN_EMAIL: string;

  @IsString()
  @IsOptional()
  ADMIN_PASSWORD: string;
}

export default registerAs<AppConfig>('app', () => {
  const envConfig = {
    ...process.env,
    APP_PORT: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : undefined,
    THROTTLE_TTL: process.env.THROTTLE_TTL
      ? parseInt(process.env.THROTTLE_TTL, 10)
      : undefined,
    THROTTLE_LIMIT: process.env.THROTTLE_LIMIT
      ? parseInt(process.env.THROTTLE_LIMIT, 10)
      : undefined,
    THROTTLE_BLOCK_DURATION: process.env.THROTTLE_BLOCK_DURATION
      ? parseInt(process.env.THROTTLE_BLOCK_DURATION, 10)
      : undefined,
  };

  const validatedConfig = plainToClass(AppEnvironmentValidator, envConfig);
  const errors = validateSync(validatedConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.toString()}`);
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'HIEMAT',
    version: process.env.APP_VERSION || '1.0',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN || 'http://localhost',
    port:
      envConfig.APP_PORT ||
      (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080),
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    throttlerTtl: envConfig.THROTTLE_TTL || 6000,
    throttlerLimit: envConfig.THROTTLE_LIMIT || 10,
    throttlerBlockDuration: envConfig.THROTTLE_BLOCK_DURATION,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
  };
});
