import { Injectable } from '@nestjs/common';
import { FileUploadOptions } from './config';
import { FileStorageInterface, STORAGE_SERVICE_TYPE } from './interfaces';
import { LocalStorageRepository } from './repositories';
import { GcsStorageRepository } from './repositories/storage/gcs-storage.repository';

export function registerDefaultStorageProviders() {
  StorageRegistry.register(STORAGE_SERVICE_TYPE.LOCAL, LocalStorageRepository);
  StorageRegistry.register(STORAGE_SERVICE_TYPE.GCS, GcsStorageRepository);
  // more?...
}

@Injectable()
export class StorageRegistry {
  private static storageProviders: Map<
    string,
    new (options: FileUploadOptions) => FileStorageInterface
  > = new Map();

  static register(
    type: string,
    providerClass: new (options: FileUploadOptions) => FileStorageInterface,
  ) {
    this.storageProviders.set(type, providerClass);
  }

  static create(
    type: string,
    options: FileUploadOptions,
  ): FileStorageInterface {
    const StorageClass = this.storageProviders.get(type);

    if (!StorageClass) {
      throw new Error(`Storage provider type '${type}' is not registered`);
    }

    return new StorageClass(options);
  }

  static isRegistered(type: string): boolean {
    return this.storageProviders.has(type);
  }

  static getRegisteredTypes(): string[] {
    return Array.from(this.storageProviders.keys());
  }
}
