import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { resolve } from 'path';
import { createReadStream } from 'fs';

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

  async upload(opts: { key: string; filePath: string }) {
    const { key, filePath } = opts;

    try {
      // get stream body
      const body = createReadStream(resolve(filePath));

      // upload to s3
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${process.env.ENVIRONMENT}/${key}`,
        Body: body,
        ACL: 'public-read',
      });
      const response = await this.client.send(command);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
