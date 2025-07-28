import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Profile, User } from '../../../database/entities';
import { CrudService } from '../../../shared/services';
import { AuthDto } from '../../../shared/modules';
import { AccountResponseDto } from '../dtos';
import { ProfileCreateRequestDto } from '../dtos';
import { FileUploadService, Media } from '@etm/server-media-upload';

@Injectable()
export class ProfileService extends CrudService<Profile> {
  private readonly loggerService = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly dataSource: DataSource,
    private readonly fileUploadService: FileUploadService,
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

  public async updateProfilePicture(auth: AuthDto, file: Express.Multer.File) {
    type ProfileType = Profile & { medias: Media[] };
    const profile = (await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndMapMany(
        'profile.medias',
        Media,
        'media',
        `media.entityId = profile.id::text AND media.entityType = :type AND media.deletedAt IS NULL`,
        { type: 'profiles' },
      )
      .where('profile.userId = :userId', { userId: auth.id })
      .andWhere('profile.deletedAt IS NULL')
      .getOne()) as ProfileType;

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    if (profile.medias.length > 0) {
      await this.fileUploadService.delete(profile.medias[0].id);
    }

    return this.fileUploadService.upload(
      file,
      'picture',
      'profiles',
      profile.id,
    );
  }
}
