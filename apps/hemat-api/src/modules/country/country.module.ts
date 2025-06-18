import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../../database/entities';
import { CountryService } from './services/country.service';
import { CountryController } from './controllers/country.controller';
import { AuthModule } from '../../shared/modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    AuthModule,
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {} 