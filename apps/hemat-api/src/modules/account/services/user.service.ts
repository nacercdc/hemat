import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AssessmentMember,
  Invitation,
  Profile,
  User,
} from '../../../database/entities';
import {
  AuthService,
  LoginResponseDto,
  AuthDto,
} from '../../../shared/modules';
import { ConfigType } from '../../../config/types';
import { HashHelper, pick } from '../../../shared/helpers';
import { InvitationStatus, UserStatusEnum, MemberRole } from '../../../shared/enums';
import { SuccessResponseDto } from '../../../shared/dtos';
import {
  LoginRequestDto,
  AccountResponseDto,
  ChangePasswordRequestDto,
  RegisterRequestDto,
} from '../dtos';
import { Request } from 'express';
import { FileUploadService } from '@etm/server-media-upload';

@Injectable()
export class UserService {
  private readonly loggerService = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<ConfigType>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async register(
    payload: RegisterRequestDto,
  ): Promise<SuccessResponseDto> {
    const emailExists = await this.userRepository.exists({
      where: { email: payload.email },
    });

    if (emailExists) {
      throw new BadRequestException();
    }

    try {
      await this.dataSource.transaction(async function (manager) {
        const { title, firstName, middleName, lastName, phoneNumber } = payload;
        const user = manager.create(User, {
          email: payload.email,
          password: payload.password,
          status: UserStatusEnum.ACTIVE,
          name: [title, firstName, middleName, lastName]
            .filter((n) => n)
            .join(' '),
        });

        await manager.insert(User, user);

        if (payload.invitationId) {
          const invitation = await manager.findOne(Invitation, {
            where: { id: payload.invitationId, email: payload.email },
          });

          if (!invitation) {
            throw new BadRequestException();
          }

          if (invitation?.status !== InvitationStatus.PENDING) {
            throw new BadRequestException();
          }

          const member = manager.create(AssessmentMember, {
            userId: user.id,
            assessmentId: invitation.assessmentId,
            groupId: invitation.groupId,
            role: invitation.role,
          });

          await manager.insert(AssessmentMember, member);
          await manager.update(
            Invitation,
            {
              id: invitation.id,
            },
            { status: InvitationStatus.ACCEPTED },
          );
        }

        const profile = manager.create(Profile, {
          userId: user.id,
          title,
          firstName,
          middleName,
          lastName,
          gender: payload.gender,
          country: payload.country,
          jobTitle: payload.jobTitle,
          profession: payload.profession,
          phoneNumber,
        });

        await manager.insert(Profile, profile);
      });

      return {
        status: true,
        message: 'Registration successful',
      };
    } catch (err) {
      this.loggerService.error('register:', err);

      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }

      throw new InternalServerErrorException('Failed to register user');
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
    const account = await this.userRepository.findOne({
      where: { id: auth.id },
      relations: ['profile', 'roles.permissions', 'permissions'],
    });

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    const profile: (Profile & { url?: string | null }) | null =
      account.profile || null;

    if (profile) {
      const medias = await this.fileUploadService.getByEntity(
        'profiles',
        profile.id,
      );

      profile.url = medias?.[0]?.url || null;
    }

    return new AccountResponseDto({ ...account, profile });
  }

  public async refreshToken(
    req: Request & { user: AuthDto },
  ): Promise<LoginResponseDto> {
    const account = await this.findUserById(req.user.id);

    if (!account) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    req.headers.authorization = req.headers.authorization || '';
    const refreshToken = req.headers.authorization.replace('Bearer', '').trim();
    const result = await this.authService
      .generateAccess(pick(account, 'id', 'isAdmin', 'name', 'email', 'status'))
      .catch((err) => {
        this.loggerService.error('createToken:', err);
        throw new BadRequestException('Failed to login');
      });

    return {
      token: result,
      expires: this.configService.getOrThrow('auth.expires', { infer: true }),
      refreshToken,
    };
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
    return this.userRepository.findOneBy({ id }).catch((err) => {
      this.loggerService.error('findUserById:', err);
      throw new InternalServerErrorException(`Failed to get user by ID ${id}`);
    });
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email }).catch((err) => {
      this.loggerService.error('findUserByEmail:', err);
      throw new InternalServerErrorException(
        `Failed to get user by EMAIL ${email}`,
      );
    });
  }
}
