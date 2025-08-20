import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { validateConfig } from '../shared/helpers';
import { SmtpConfig } from './types';

class SmtpEnvironmentValidator {
  @IsString()
  @IsOptional()
  SMTP_HOST: string;

  @IsInt()
  @IsOptional()
  SMTP_PORT: number;

  @IsString()
  @IsOptional()
  SMTP_USER: string;

  @IsString()
  @IsOptional()
  SMTP_PASS: string;

  @IsString()
  @IsOptional()
  SMTP_FROM: string;
}

export default registerAs<SmtpConfig>('smtp', () => {
  validateConfig(process.env, SmtpEnvironmentValidator);

  return {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  };
});
