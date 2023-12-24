import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

  async upload(opts: { key: string; body: any }) {
    const { key, body } = opts;

    try {
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET || '',
        Key: key,
        Body: body,
      });
      const response = await this.client.send(command);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
