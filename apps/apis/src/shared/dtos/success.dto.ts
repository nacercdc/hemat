import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Status',
    type: Boolean,
    example: true,
  })
  status: boolean;

  @ApiPropertyOptional({
    description: 'Message',
    type: String,
    example: 'Successful',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Data',
  })
  data?: unknown;
}
