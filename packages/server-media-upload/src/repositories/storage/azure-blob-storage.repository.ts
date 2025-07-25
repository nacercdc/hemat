import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { FileUploadOptions } from '../../config/file-upload-options.interface';
import {
  STORAGE_SERVICE_TYPE,
  UploadResult,
} from '../../interfaces/upload-result.interface';
import { BaseStorageRepository } from '../base-storage.repository';

export class AzureStorageRepository extends BaseStorageRepository {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor(options: FileUploadOptions) {
    super(options);

    if (!options.azureConfig) {
      throw new Error('Azure configuration is required');
    }

    if (!options.azureConfig.accountName || !options.azureConfig.accountKey) {
      throw new Error('Azure account name and key are required');
    }

    this.containerName = options.azureConfig.container;

    const sharedKeyCredential = new StorageSharedKeyCredential(
      options.azureConfig.accountName,
      options.azureConfig.accountKey,
    );

    this.blobServiceClient = new BlobServiceClient(
      `https://${options.azureConfig.accountName}.blob.core.windows.net`,
      sharedKeyCredential,
    );
  }

  async upload(file: Express.Multer.File, path = ''): Promise<UploadResult> {
    try {
      const filename = this.generateUniqueFilename(file.originalname);
      const relativePath = path ? `${path}/${filename}` : filename;

      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(relativePath);

      const uploadResponse = await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      return {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: relativePath,
        url: this.getFileUrl(relativePath),
        storageType: STORAGE_SERVICE_TYPE.AZURE,
        etag: uploadResponse.etag,
      };
    } catch (error) {
      console.error('Error uploading file to Azure:', error);
      throw new Error(
        `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async delete(filename: string): Promise<boolean> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      const deleteResponse = await blockBlobClient.deleteIfExists();
      return deleteResponse.succeeded;
    } catch (error) {
      console.error('Error deleting file from Azure:', error);
      return false;
    }
  }

  getFileUrl(filename: string): string {
    const accountName = this.blobServiceClient.accountName;
    return `https://${accountName}.blob.core.windows.net/${this.containerName}/${filename}`;
  }

  async generateSasUrl(
    filename: string,
    expiresInMinutes = 60,
  ): Promise<string> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      const permissions = new BlobSASPermissions();
      permissions.read = true; // Allow read access

      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions,
        expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      });

      return sasUrl;
    } catch (error) {
      console.error('Error generating SAS URL:', error);
      throw new Error(
        `Failed to generate SAS URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      const exists = await blockBlobClient.exists();
      return exists;
    } catch (error) {
      console.error('Error checking file existence in Azure:', error);
      return false;
    }
  }

  async getFileMetadata(filename: string): Promise<any> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      const properties = await blockBlobClient.getProperties();
      return {
        size: properties.contentLength,
        contentType: properties.contentType,
        lastModified: properties.lastModified,
        etag: properties.etag,
        metadata: properties.metadata,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get file metadata: ${error.message}`);
      }
      throw new Error('Failed to get file metadata: Unknown error');
    }
  }
}
