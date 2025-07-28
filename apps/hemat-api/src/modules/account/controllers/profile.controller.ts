import {
  Controller,
  Put,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  AuthGuard,
  AuthDto,
  AuthUser,
  Abilities,
} from '../../../shared/modules';
import { ExceptionResponseDto } from '../../../shared/dtos';
import { ProfileService } from '../services';
import {
  ProfileCreateRequestDto,
  AccountResponseDto,
} from '../dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Profiles')
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: ExceptionResponseDto,
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ExceptionResponseDto,
})
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ExceptionResponseDto,
})
@ApiTooManyRequestsResponse({
  description: 'Too Many Requests',
  type: ExceptionResponseDto,
})
@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Update', description: 'Update profile.' })
  @ApiOkResponse({ description: 'Ok', type: AccountResponseDto })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Put()
  async update(
    @AuthUser() auth: AuthDto,
    @Body() payload: ProfileCreateRequestDto,
  ) {
    return this.profileService.updateProfile(auth, payload);
  }

  @ApiOperation({
    summary: 'Update Profile Picture',
    description: 'Update profile picture using file upload.',
  })
  @ApiOkResponse({ description: 'Ok', type: AccountResponseDto })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @AuthUser() auth: AuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateProfilePicture(auth, file);
  }
}
