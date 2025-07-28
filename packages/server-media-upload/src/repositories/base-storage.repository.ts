import { FileStorageInterface } from '../interfaces/file-storage.interface';
import { UploadResult } from '../interfaces/upload-result.interface';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { FileUploadOptions } from '../config/file-upload-options.interface';

export abstract class BaseStorageRepository implements FileStorageInterface {
  constructor(protected readonly options: FileUploadOptions) {}

  abstract upload(
    file: Express.Multer.File,
    path?: string,
  ): Promise<UploadResult>;
  abstract delete(filename: string): Promise<boolean>;
  abstract getFileUrl(filename: string): string;

  protected generateUniqueFilename(originalFilename: string): string {
    const extension = extname(originalFilename);
    if (this.options.useUniqueFilenames) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return `${uuidv4()}${extension}`;
    }
    return originalFilename;
  }
}
