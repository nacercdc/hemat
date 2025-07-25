export interface FileUploadOptions {
  /**
   * Storage type: 'local', 's3', 'gcs'
   */
  storage: 'local' | 's3' | 'gcs';

  /**
   * Base path for file uploads (for local storage)
   */
  destinationPath?: string;

  /**
   * S3 config options
   */
  s3Config?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    acl?: string;
  };

  /**
   * Google Cloud Storage config options
   */
  gcsConfig?: {
    projectId: string;
    keyFilename?: string;
    bucket: string;
  };

  /**
   * Azure Blob Storage config options
   */
  azureConfig?: {
    accountName: string;
    accountKey: string;
    container: string;
  };

  /**
   * Max file size (in bytes)
   * @default 5242880 (5MB)
   */
  maxFileSize?: number;

  /**
   * Allowed mime types
   * @default [] (all)
   */
  allowedMimeTypes?: string[];

  /**
   * Generate unique filenames
   * @default true
   */
  useUniqueFilenames?: boolean;

  /**
   * Database connection name (from your NestJS TypeORM config)
   * @default 'default'
   */
  dbConnectionName?: string;
}
