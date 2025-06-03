import { registerAs } from '@nestjs/config';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { DatabaseConfig } from './types';

class DatabaseEnvironmentValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_TYPE: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USERNAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE: boolean;

  @IsInt()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  const envConfig = {
    ...process.env,
    DATABASE_PORT: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : undefined,
    DATABASE_SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE
      ? process.env.DATABASE_SYNCHRONIZE === 'true'
      : undefined,
    DATABASE_MAX_CONNECTIONS: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : undefined,
    DATABASE_SSL_ENABLED: process.env.DATABASE_SSL_ENABLED
      ? process.env.DATABASE_SSL_ENABLED === 'true'
      : undefined,
    DATABASE_REJECT_UNAUTHORIZED: process.env.DATABASE_REJECT_UNAUTHORIZED
      ? process.env.DATABASE_REJECT_UNAUTHORIZED === 'true'
      : undefined,
  };

  const validatedConfig = plainToClass(DatabaseEnvironmentValidator, envConfig);
  const errors = validateSync(validatedConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(
      `Database configuration validation failed: ${errors.toString()}`,
    );
  }

  return {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: envConfig.DATABASE_PORT || 5432,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: envConfig.DATABASE_SYNCHRONIZE ?? true,
    maxConnections: envConfig.DATABASE_MAX_CONNECTIONS || 100,
    sslEnabled: envConfig.DATABASE_SSL_ENABLED ?? false,
    rejectUnauthorized: envConfig.DATABASE_REJECT_UNAUTHORIZED ?? false,
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  };
});
