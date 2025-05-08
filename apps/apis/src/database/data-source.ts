import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';

config({ path: '.env' });

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: ['src/database/entities/**/*.entity.ts'],
  migrations: ['src/database/migrations/**/*{.ts}'],

  cli: {
    entitiesDir: 'src',
    subscribersDir: 'subscriber',
  },
  extra: {
    max: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true'
        ? {
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
          }
        : undefined,
  },
} as DataSourceOptions & SeederOptions;

export default new DataSource(dataSourceOptions);
