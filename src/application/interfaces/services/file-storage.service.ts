export interface StoredFileInput {
  buffer: Buffer;
  contentType: string;
  key: string;
}

export interface IFileStorageService {
  upload(input: StoredFileInput): Promise<void>;
  copy(sourceKey: string, destinationKey: string): Promise<void>;
  delete(key: string): Promise<void>;
  getDownloadUrl(key: string): Promise<string>;
}
