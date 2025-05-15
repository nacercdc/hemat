import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, authConfig, databaseConfig } from './config';
import { DatabaseModule } from './database';
import { AccountModule } from './modules';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    AccountModule,
  ],
})
export class AppModule {}
