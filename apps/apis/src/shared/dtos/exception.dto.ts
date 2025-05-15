import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExceptionResponseDto {
  @ApiProperty({ description: 'Status code', type: Number })
  @Type(() => Number)
  statusCode: number;

  @ApiProperty({ description: 'Error', type: String })
  @Type(() => String)
  error: string;

  @ApiProperty({ description: 'Message' })
  message: any;

  @ApiProperty({ description: 'Path', type: String })
  @Type(() => String)
  path: string;

  @ApiProperty({ description: 'Timestamp', type: String })
  @Type(() => String)
  timestamp: string;
}
