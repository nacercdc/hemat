import { FileUploadOptions } from './file-upload-options.interface';

export const FILE_UPLOAD_OPTIONS = 'FILE_UPLOAD_OPTIONS';

export const DEFAULT_OPTIONS: Partial<FileUploadOptions> = {
  storage: 'local',
  destinationPath: 'uploads',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [],
  useUniqueFilenames: true,
  dbConnectionName: 'default',
};
