import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmMjNkYmMzLTMxMzQtNGE3NC1iMGM4LTU3NDFhZDJmYjUxNiIsImlzQWRtaW4iOnRydWUsIm5hbWUiOiJTdXBlciBBZG1pbiIsImVtYWlsIjoiYWRtaW5Aa2dpLmNvbSIsInBob25lTnVtYmVyIjpudWxsLCJzdGF0dXMiOiJhY3RpdmUiLCJpYXQiOjE3Mjc4OTMwMjAsImV4cCI6MTcyNzg5MzkyMH0.phso4AeVdg2gaadPRqm4hyg_YB6MWszPq9jvdTx0Ru8',
  })
  token: string;

  @ApiProperty({
    description: 'Expires in',
    type: String,
    example: '15m',
  })
  expires: string;

  @ApiProperty({
    description: 'Refresh token',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmMjNkYmMzLTMxMzQtNGE3NC1iMGM4LTU3NDFhZDJmYjUxNiIsImlzQWRtaW4iOnRydWUsIm5hbWUiOiJTdXBlciBBZG1pbiIsImVtYWlsIjoiYWRtaW5Aa2dpLmNvbSIsInBob25lTnVtYmVyIjpudWxsLCJzdGF0dXMiOiJhY3RpdmUiLCJpYXQiOjE3Mjc4OTMwMjAsImV4cCI6MjA0MzI1MzAyMH0.TB_0tYwhKgEJCZMhYdTQEOG8HztBXdhlNbq_GiGYqu8',
  })
  refreshToken: string;
}
