import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from '../services/file-upload.service';
import { MediaService } from '../services/media.service';

describe('AppController', () => {
  let appController: FileUploadController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [FileUploadService, MediaService],
    }).compile();

    appController = app.get<FileUploadController>(FileUploadController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getMedia('1')).toBe('Hello World!');
    });
  });
});
