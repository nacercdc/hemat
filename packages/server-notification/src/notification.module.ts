// notification.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';

import {
  NOTIFICATION_OPTIONS,
  NotificationModuleAsyncOptions,
  NotificationModuleOptions,
} from './notification.module-options';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({})
export class NotificationModule {
  static forRoot(options: NotificationModuleOptions): DynamicModule {
    return {
      module: NotificationModule,
      imports: [TypeOrmModule.forFeature([NotificationEntity])],
      providers: [
        NotificationService,
        NotificationRepository,
        { provide: NOTIFICATION_OPTIONS, useValue: options },
      ],
      exports: [NotificationService],
    };
  }

  static forRootAsync(options: NotificationModuleAsyncOptions): DynamicModule {
    return {
      module: NotificationModule,
      imports: [
        ...(options.imports ?? []),
        TypeOrmModule.forFeature([NotificationEntity]),
      ],
      providers: [
        NotificationService,
        NotificationRepository,
        {
          provide: NOTIFICATION_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ],
      exports: [NotificationService],
    };
  }
}
