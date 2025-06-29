import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserService } from '../services/user.service';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ChangePasswordRequestDto,
  AccountResponseDto,
} from '../dtos';
import { AuthGuard, AuthRefreshGuard } from '@shared/modules';
import { AuthDto, LoginResponseDto } from '../../../shared/modules';
import { SuccessResponseDto } from '../../../shared/dtos';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiBadRequestResponse()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async register(@Body() payload: RegisterRequestDto): Promise<SuccessResponseDto> {
    return this.userService.register(payload);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() payload: LoginRequestDto,
    @Ip() ip: string,
  ): Promise<LoginResponseDto> {
    return this.userService.login(payload, ip);
  }

  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() req: { user: AuthDto }): Promise<SuccessResponseDto> {
    return this.userService.logout(req.user);
  }

  @ApiOperation({ summary: 'Get user information with assessment memberships' })
  @ApiOkResponse({ type: AccountResponseDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req: { user: AuthDto & { assessmentRole?: string; assessmentGroupId?: string; currentAssessmentId?: string } }): Promise<AccountResponseDto> {
    // Check if user has assessment context from AssessmentRoleGuard
    const assessmentContext = req.user.assessmentRole || req.user.assessmentGroupId || req.user.currentAssessmentId ? {
      role: req.user.assessmentRole as any,
      groupId: req.user.assessmentGroupId,
      assessmentId: req.user.currentAssessmentId,
    } : undefined;
    
    // If no assessment context, get all assessment memberships
    if (!assessmentContext) {
      return this.userService.meWithAllAssessments(req.user);
    }
    
    return this.userService.me(req.user, assessmentContext);
  }

  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthRefreshGuard)
  @Post('refresh-token')
  async refreshToken(
    @Request() req: { user: AuthDto },
  ): Promise<LoginResponseDto> {
    return this.userService.refreshToken(req.user);
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req: { user: AuthDto },
    @Body() payload: ChangePasswordRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.userService.changePassword(req.user, payload);
  }

  @ApiOperation({ summary: 'Get user information' })
  @ApiOkResponse({ type: AccountResponseDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @Get('users')
  async findAllUsers(
    @Request() req: { user: AuthDto },
  ): Promise<AccountResponseDto[]> {
    return this.userService.findAllUsers();
  }
}
