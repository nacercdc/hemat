import { UploadResult } from './upload-result.interface';

export interface FileStorageInterface {
  upload(file: Express.Multer.File, path?: string): Promise<UploadResult>;

  delete(filename: string): Promise<boolean>;

  getFileUrl(filename: string): string;
}

export const FILE_STORAGE_TOKEN = 'FILE_STORAGE_TOKEN';
