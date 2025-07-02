import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Support, SupportReply } from '@database/entities';
import { SupportService } from './services/support.service';
import { SupportController } from './controllers/support.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Support, SupportReply])],
  providers: [SupportService],
  controllers: [SupportController],
  exports: [SupportService],
})
export class SupportModule {} 