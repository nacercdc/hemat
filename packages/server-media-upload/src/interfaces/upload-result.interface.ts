export const STORAGE_SERVICE_TYPE = {
  LOCAL: 'local',
  S3: 's3',
  GCS: 'gcs',
  AZURE: 'azure',
} as const;

export interface UploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  storageType: (typeof STORAGE_SERVICE_TYPE)[keyof typeof STORAGE_SERVICE_TYPE];
  etag?: string; // For Azure and S3
  versionId?: string; // For S3 versioning
}
