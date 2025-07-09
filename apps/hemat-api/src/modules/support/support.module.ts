import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Support, SupportReply, User } from '@database/entities';
import { SupportService } from './services/support.service';
import { SupportController } from './controllers/support.controller';
import { AuthModule } from '@shared/modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Support, SupportReply]),
    AuthModule,
  ],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {} 