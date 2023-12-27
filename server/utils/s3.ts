import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export default class S3 {
  private client: S3Client;

  constructor() {
    const { S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET } = process.env;

    // Basic configuration validation
    if (!S3_REGION || !S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_BUCKET) {
      throw new Error('S3 configuration is incomplete. Please check your environment variables.');
    }

    this.client = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      },
    });
  }

  async upload(opts: { key: string; body: any }) {
    const { key, body } = opts;

    try {
      const fileStream = new ReadableStream(body);

      const uploader = new Upload({
        client: this.client,
        params: {
          Bucket: process.env.S3_BUCKET,
          Key: key,
          Body: fileStream,
        },
      });
      uploader.on('httpUploadProgress', (progress) => {
        console.log(`Uploaded ${progress.loaded} out of ${progress.total} bytes`);
      });
      await uploader.done();
      console.log('Upload complete');

      return true;
    } catch (err: any) {
      console.error('Error uploading file:', err.stack || err);
      return false;
    }
  }
}
