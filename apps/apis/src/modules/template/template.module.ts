import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain, Component, SubComponent } from '../../database/entities';
import {
  DomainService,
  ComponentService,
  SubComponentService,
} from './services';
import {
  DomainController,
  ComponentController,
  SubComponentController,
} from './controllers';
import { AuthModule } from '../../shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([Domain, Component, SubComponent]),
    AuthModule,
  ],
  providers: [DomainService, ComponentService, SubComponentService],
  controllers: [DomainController, ComponentController, SubComponentController],
})
export class TemplateModule {}
