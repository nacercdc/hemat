import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../../database/entities';
import { LanguageService } from './services';
import { LanguageController } from './controllers';
import { AuthModule } from '@shared/modules';

@Module({
  imports: [TypeOrmModule.forFeature([Language]), AuthModule],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
