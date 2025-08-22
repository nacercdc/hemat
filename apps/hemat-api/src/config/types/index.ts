import { AppConfig } from './app-config.type';
import { DatabaseConfig } from './database-config.type';
import { AuthConfig } from './auth-config.type';
import { SmtpConfig } from './smtp-config.type';

export { AppConfig, AuthConfig, DatabaseConfig, SmtpConfig };
export type ConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  smtp: SmtpConfig;
};
