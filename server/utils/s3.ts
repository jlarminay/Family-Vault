import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  PutObjectAclCommand,
} from '@aws-sdk/client-s3';
import { resolve, extname } from 'path';
import { createReadStream } from 'fs';
import mimeOptions from './mimeOptions.js';
import dayjs from 'dayjs';

export default class S3 {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.S3_REGION || '',
      endpoint: process.env.S3_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
    });
  }

  async upload(opts: { targetPath: string; localPath: string }): Promise<boolean> {
    try {
      const { targetPath, localPath } = opts;
      // get stream body
      const body = createReadStream(resolve(localPath));
      const fileExtension = extname(localPath).toLowerCase();
      const contentType = mimeOptions[fileExtension] || 'application/octet-stream';

      // upload to s3
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: targetPath,
        Body: body,
        ACL: 'public-read',
        ContentType: contentType,
      });
      const results = await this.client.send(command);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getAllFiles(): Promise<
    {
      key: string;
      fullPath: string;
      lastModified: string;
      eTag: string;
      size: number;
      storageClass: string;
      contentType: string;
    }[]
  > {
    try {
      const key = process.env.ENVIRONMENT ? `${process.env.ENVIRONMENT}/` : '';
      const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        Prefix: key,
      });
      console.log('command: ', command);

      const response = await this.client.send(command);
      console.log('response: ', response);

      const files =
        response.Contents?.filter((item) => {
          // filter out directories
          if (item.Key?.endsWith('/')) return false;
          // filter out thumbnails
          if (item.Key?.endsWith('.thumbnail.webp')) return false;
          // return all other files
          return true;
        }).map((item) => {
          const getCDNPath = `${process.env.S3_ENDPOINT?.replace(
            'https://sfo2.',
            'https://larminay-vault-storage.sfo2.cdn.',
          )}/${item.Key || ''}`;
          return {
            key: item.Key || '',
            fullPath: getCDNPath,
            lastModified: dayjs(item.LastModified).format('YYYY-MM-DD') || '1900-01-01',
            eTag: item.ETag || '',
            size: item.Size || 0,
            storageClass: item.StorageClass || '',
            contentType: mimeOptions[extname(item.Key || '')] || 'application/octet-stream',
          };
        }) || [];

      return files;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async updateFilePermissions(key: string): Promise<boolean> {
    try {
      const command = new PutObjectAclCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        ACL: 'public-read',
      });

      const response = await this.client.send(command);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getFileMetadata(key: string): Promise<{
    fileSize: number;
    contentType: string;
    fullPath: string;
  } | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      });

      const response = await this.client.send(command);

      const metadata = {
        fileSize: response.ContentLength || 0,
        contentType: response.ContentType || '',
        // acl: response.ACL,
        fullPath: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`,
      };

      return metadata;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // async generatePresignedUrl(folder, filename) {
  //   const params = {
  //     Bucket: process.env.S3_BUCKET_NAME,
  //     Key: `${folder}/${filename}`,
  //     Expires: 3600, // URL expiration time in seconds
  //   };

  //   const command = new PutObjectCommand(params);
  //   const url = await getSignedUrl(this.client, command, { expiresIn: params.Expires });

  //   return url;
  // }
}

export type s3 = S3;
