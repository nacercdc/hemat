import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigType } from '../config/types';
import path from 'path';

const projectRoot = path.resolve(__dirname, '../../../..');

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<ConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type', { infer: true }),
      url: this.configService.get('database.url', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get<string>('database.password', {
        infer: true,
      }),
      database: this.configService.get('database.name', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [
        'dist/database/entities/*{.entity.js,.entity.ts}',
        path.join(
          projectRoot,
          'packages/server-media-upload/dist/src/entities/*.entity.js',
        ),
        path.join(
          projectRoot,
          'packages/server-notification/dist/src/entities/*.entity.js',
        ),
      ],
      subscribers: [
        'dist/database/subscribers/*{.subscriber.js,.subscriber.ts}',
      ],
      migrations: ['dist/database/migrations/**/*{.ts,.js}'],
      extra: {
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized',
                { infer: true },
              ),
              ca: this.configService.get('database.ca', { infer: true }),
              key: this.configService.get('database.key', { infer: true }),
              cert: this.configService.get('database.cert', { infer: true }),
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
