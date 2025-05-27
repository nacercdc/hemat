import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities';
import {
  AuthService,
  LoginResponseDto,
  AuthDto,
} from '../../../shared/modules';
import { ConfigType } from '../../../config/types';
import { HashHelper, pick } from '../../../shared/helpers';
import { UserStatusEnum } from '../../../shared/enums';
import { SuccessResponseDto } from '../../../shared/dtos';
import {
  LoginRequestDto,
  AccountResponseDto,
  ChangePasswordRequestDto,
  RegisterRequestDto,
} from '../dtos';
import { CrudService } from '../../../shared/services';

@Injectable()
export class UserService extends CrudService<User> {
  private readonly loggerService = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<ConfigType>,
  ) {
    super(userRepository);
  }

  public async register(
    payload: RegisterRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const user = await this.create({
        email: payload.email,
        password: payload.password,
        status: UserStatusEnum.ACTIVE,
        name: payload.name,
      });

      return {
        status: true,
        message: 'Registration successful',
      };
    } catch (err) {
      this.loggerService.error('register:', err);
      throw new BadRequestException('Failed to register user');
    }
  }

  public async login(
    payload: LoginRequestDto,
    ip: string,
  ): Promise<LoginResponseDto> {
    const account = await this.findUserByEmail(payload.email);

    if (!account || !account.password) {
      throw new BadRequestException('Invalid credentials');
    }

    if (account.disabled) {
      throw new ForbiddenException('Account is disabled');
    }

    if (account.status !== UserStatusEnum.ACTIVE) {
      throw new ForbiddenException(
        account.status === UserStatusEnum.BLOCKED
          ? 'Account is blocked'
          : 'Account is inactive',
      );
    }

    const isValidPassword = await HashHelper.compare(
      payload.password,
      account.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.createToken(account);
  }

  public async logout(auth: AuthDto): Promise<SuccessResponseDto> {
    const account = await this.findUserById(auth.id);

    if (!account) {
      throw new BadRequestException('Failed to logout');
    }

    await this.userRepository
      .update(account.id, { refreshToken: null })
      .catch((err) => {
        this.loggerService.error('logout:', err);
        throw new BadRequestException('Failed to logout');
      });

    return {
      status: true,
      message: 'Logout successful',
    };
  }

  public async me(auth: AuthDto): Promise<AccountResponseDto> {
    const account = await this.userRepository
      .findOne({
        where: { id: auth.id },
        relations: ['profile', 'roles.permissions', 'permissions'],
      })
      .catch((err) => {
        this.loggerService.error('me:', err);
        throw new BadRequestException('Failed to fetch user information');
      });

    if (!account) {
      throw new BadRequestException('Failed to fetch user information');
    }

    return new AccountResponseDto(account);
  }

  public async refreshToken(auth: AuthDto): Promise<LoginResponseDto> {
    const account = await this.findUserById(auth.id);

    if (!account) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.createToken(account);
  }

  public async changePassword(
    auth: AuthDto,
    payload: ChangePasswordRequestDto,
  ): Promise<SuccessResponseDto> {
    await this.updateUserPassword(auth.id, payload.password);
    return { status: true, message: 'Password changed successfully' };
  }

  private async createToken(account: User): Promise<LoginResponseDto> {
    const result = await this.authService
      .generate(pick(account, 'id', 'isAdmin', 'name', 'email', 'status'))
      .catch((err) => {
        this.loggerService.error('createToken:', err);
        throw new BadRequestException('Failed to login');
      });

    await this.userRepository
      .update(account.id, {
        refreshToken: result.refreshToken,
        lastLoggedInAt: new Date(),
      })
      .catch((err) => {
        this.loggerService.error('createToken:', err);
        throw new BadRequestException('Failed to login');
      });

    return result;
  }

  private async updateUserPassword(
    id: string,
    password: string,
  ): Promise<void> {
    await this.userRepository
      .update(id, {
        password,
        lastPasswordUpdatedAt: new Date(),
      })
      .catch((err) => {
        this.loggerService.error('updateUserPassword:', err);
        throw new BadRequestException('Failed to update password');
      });
  }

  public async findAllUsers(): Promise<User[]> {
    return this.userRepository.find().catch((err) => {
      this.loggerService.error('findAllUsers:', err);
      throw new BadRequestException('Failed to fetch users');
    });
  }

  private async findUserById(id: string): Promise<User | null> {
    return this.findOne(id).catch((err) => {
      this.loggerService.error('findUserById:', err);
      throw new BadRequestException('User not found');
    });
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email }).catch((err) => {
      this.loggerService.error('findUserByEmail:', err);
      throw new BadRequestException('User not found');
    });
  }
}
