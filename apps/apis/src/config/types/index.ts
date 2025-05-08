import { AppConfig } from './app-config.type';
import { DatabaseConfig } from './database-config.type';
import { AuthConfig } from './auth-config.type';

export { AppConfig, AuthConfig, DatabaseConfig };
export type ConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
};
