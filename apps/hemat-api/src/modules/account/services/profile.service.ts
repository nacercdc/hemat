import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User, Profile } from '../../../database/entities';
import { ConfigType } from '../../../config/types';
import { AccountResponseDto, ProfileCreateRequestDto } from '../dtos';
import { AuthDto } from '../../../shared/modules';
import { CrudService } from '../../../shared/services';

@Injectable()
export class ProfileService extends CrudService<Profile> {
  private readonly loggerService = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<ConfigType>,
  ) {
    super(profileRepository);
  }

  public async updateProfile(
    auth: AuthDto,
    payload: ProfileCreateRequestDto,
  ): Promise<AccountResponseDto> {
    return this.dataSource
      .transaction(async (manager: EntityManager) => {
        const userRepository = manager.getRepository(User);
        const profileRepository = manager.getRepository(Profile);

        const user = await userRepository.findOneOrFail({
          where: { id: auth.id },
          relations: { profile: true },
        });

        let profile = user.profile;
        const profileData = {
          ...payload,
        };

        if (profile?.id) {
          await profileRepository.update(profile.id, profileData);
        } else {
          profile = profileRepository.create({
            userId: auth.id,
            ...profileData,
          });
          await profileRepository.insert(profile);
        }

        await userRepository.update(user.id, {
          name: `${payload.firstName} ${payload.lastName}`,
        });

        const updatedUser = await userRepository.findOne({
          where: { id: auth.id },
          relations: ['profile', 'roles.permissions', 'permissions'],
        });

        return new AccountResponseDto(updatedUser!);
      })
      .catch((err) => {
        this.loggerService.error('updateProfile:', err);
        throw new BadRequestException('Failed to save profile');
      });
  }
}
