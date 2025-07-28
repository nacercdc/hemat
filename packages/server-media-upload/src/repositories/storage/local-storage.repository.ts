import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import { FileUploadOptions } from '../../config/file-upload-options.interface';
import {
  STORAGE_SERVICE_TYPE,
  UploadResult,
} from '../../interfaces/upload-result.interface';
import { BaseStorageRepository } from '../base-storage.repository';

export class LocalStorageRepository extends BaseStorageRepository {
  private basePath: string;

  constructor(options: FileUploadOptions) {
    super(options);
    this.basePath = options.destinationPath || 'uploads';

    // Ensure upload directory exists
    if (!existsSync(this.basePath)) {
      mkdirSync(this.basePath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, path = ''): Promise<UploadResult> {
    const filename = this.generateUniqueFilename(file.originalname);
    const relativePath = path ? join(path, filename) : filename;
    const fullPath = join(this.basePath, relativePath);

    // Create directory if it doesn't exist
    const directory = dirname(fullPath);
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(fullPath);

      writeStream.on('finish', () => {
        resolve({
          filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: relativePath,
          url: this.getFileUrl(relativePath),
          storageType: STORAGE_SERVICE_TYPE.LOCAL,
        });
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

      writeStream.write(file.buffer);
      writeStream.end();
    });
  }

  async delete(filename: string): Promise<boolean> {
    const fullPath = join(this.basePath, filename);

    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
      return new Promise((resolve) => resolve(true));
    }

    return new Promise((resolve) => resolve(false));
  }

  getFileUrl(filename: string): string {
    return `${this.options.destinationPath ?? '/uploads'}/${filename}`;
  }
}
