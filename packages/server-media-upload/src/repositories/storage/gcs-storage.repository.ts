import { Storage } from '@google-cloud/storage';
import { FileUploadOptions } from '../../config/file-upload-options.interface';
import {
  STORAGE_SERVICE_TYPE,
  UploadResult,
} from '../../interfaces/upload-result.interface';
import { BaseStorageRepository } from '../base-storage.repository';

export class GcsStorageRepository extends BaseStorageRepository {
  private storage: Storage;
  private bucketName: string;

  constructor(options: FileUploadOptions) {
    super(options);

    if (!options.gcsConfig) {
      throw new Error('GCS configuration is required');
    }

    this.bucketName = options.gcsConfig.bucket;

    // Initialize Google Cloud Storage client
    this.storage = new Storage({
      projectId: options.gcsConfig.projectId,
      keyFilename: options.gcsConfig.keyFilename,
    });
  }

  async upload(file: Express.Multer.File, path = ''): Promise<UploadResult> {
    const filename = this.generateUniqueFilename(file.originalname);
    const relativePath = path ? `${path}/${filename}` : filename;

    const bucket = this.storage.bucket(this.bucketName);
    const gcsFile = bucket.file(relativePath);

    return new Promise((resolve, reject) => {
      const stream = gcsFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
          },
        },
        resumable: false, // Use simple upload for small files
      });

      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        // Make the file public (optional - remove if you want private files)
        gcsFile
          .makePublic()
          .then(() => {
            resolve({
              filename,
              originalName: file.originalname,
              mimeType: file.mimetype,
              size: file.size,
              path: relativePath,
              url: this.getFileUrl(relativePath),
              storageType: STORAGE_SERVICE_TYPE.GCS,
            });
          })
          .catch((error: Error) => {
            reject(error);
          });
      });

      stream.end(file.buffer);
    });
  }

  async delete(filename: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);

      await file.delete();
      return true;
    } catch (error) {
      console.error('Error deleting file from GCS:', error);
      return false;
    }
  }

  getFileUrl(filename: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${filename}`;
  }

  async getSignedUrl(filename: string, expiresInMinutes = 60): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filename);

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return url;
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      console.error('Error checking file existence in GCS:', error);
      return false;
    }
  }
}
