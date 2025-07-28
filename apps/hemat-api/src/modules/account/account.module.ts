import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile, AssessmentMember } from '../../database/entities';
import { AuthModule } from '../../shared/modules';
import { UserService, ProfileService } from './services';
import { UserController, ProfileController } from './controllers';
import { MediaUploadModule } from '@etm/server-media-upload';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, AssessmentMember]),
    AuthModule,
    MediaUploadModule.register({
      storage: 'gcs',
      gcsConfig: {
        projectId: 'ethiochicken-test-459516',
        // keyFilename: './storage-gcs.json', // For local uncomment this line
        bucket: 'hemat',
      },
      // destinationPath: 'uploads',
      useUniqueFilenames: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    }),
  ],
  providers: [UserService, ProfileService],
  controllers: [UserController, ProfileController],
})
export class AccountModule {}
