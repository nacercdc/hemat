import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementScale } from '../../database/entities';
import { MeasurementScaleService } from './services';
import { MeasurementScaleController } from './controllers';
import { AuthModule } from '../../shared';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementScale]), AuthModule],
  controllers: [MeasurementScaleController],
  providers: [MeasurementScaleService],
  exports: [MeasurementScaleService],
})
export class MeasurementScaleModule {}
