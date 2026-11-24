import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { IFileStorageService, StoredFileInput } from "../../application/interfaces/services/file-storage.service.js";
import { env } from "../../config/env.js";

const credentials = env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
  ? { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY }
  : undefined;

const s3Client = new S3Client({
  region: env.AWS_REGION,
  ...(credentials ? { credentials } : {}),
});

export class S3FileStorageService implements IFileStorageService {
  async upload(input: StoredFileInput): Promise<void> {
    await s3Client.send(new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: input.key,
      Body: input.buffer,
      ContentType: input.contentType,
    }));
  }

  async copy(sourceKey: string, destinationKey: string): Promise<void> {
    await s3Client.send(new CopyObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      CopySource: `${env.AWS_S3_BUCKET}/${sourceKey.split("/").map(encodeURIComponent).join("/")}`,
      Key: destinationKey,
    }));
  }

  async delete(key: string): Promise<void> {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    }));
  }

  getDownloadUrl(key: string): Promise<string> {
    return getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    }), { expiresIn: 900 });
  }
}
