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
  ApiBody,
  ApiConsumes,
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
import { MediaResponseDto } from '@etm/server-media-upload';

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
    description: 'Upload a new profile picture. This will replace any existing profile picture.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profile picture file (image format: JPG, PNG, GIF. Max size: 5MB)',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({ 
    description: 'Profile picture uploaded successfully', 
    type: MediaResponseDto 
  })
  @ApiBadRequestResponse({
    description: 'Invalid file format or size exceeded',
    type: ExceptionResponseDto,
  })
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
