import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Domain,
  Component,
  SubComponent,
  MeasurementScaleSubComponent,
  MeasurementScale,
} from '../../database/entities';
import {
  DomainService,
  ComponentService,
  SubComponentService,
  SubComponentMeasurementScaleService,
} from './services';
import {
  DomainController,
  ComponentController,
  SubComponentController,
} from './controllers';
import { AuthModule } from '@shared/modules';
import { SubComponentMeasurementScaleController } from './controllers/sub-component-measurement-scale.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Domain,
      Component,
      SubComponent,
      MeasurementScale,
      MeasurementScaleSubComponent,
    ]),
    AuthModule,
  ],
  providers: [
    DomainService,
    ComponentService,
    SubComponentService,
    SubComponentMeasurementScaleService,
  ],
  controllers: [
    DomainController,
    ComponentController,
    SubComponentController,
    SubComponentMeasurementScaleController,
  ],
  exports: [
    DomainService,
    ComponentService,
    SubComponentService,
    SubComponentMeasurementScaleService,
  ],
})
export class TemplateModule {}
