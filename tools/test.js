import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

async function listS3Objects() {
  console.log('Starting S3 connection...');

  const s3Endpoint = process.env.S3_ENDPOINT || '';
  const s3AccessKey = process.env.S3_ACCESS_KEY || '';
  const s3SecretKey = process.env.S3_SECRET_KEY || '';
  const s3Bucket = process.env.S3_BUCKET || '';
  const environment = process.env.ENVIRONMENT || '';

  console.log({
    s3Endpoint,
    s3AccessKey,
    s3SecretKey,
    s3Bucket,
    environment,
  });

  const client = new S3Client({
    forcePathStyle: false,
    // logger: console,
    region: 'us-east-1',
    endpoint: s3Endpoint,
    credentials: {
      accessKeyId: s3AccessKey,
      secretAccessKey: s3SecretKey,
    },
    requestTimeout: 30000,
  });

  console.log('S3 client created.');

  const command = new ListObjectsV2Command({
    Bucket: s3Bucket,
    Prefix: environment ? `${environment}/` : '',
  });

  console.log('ListObjectsV2Command created:', command);

  try {
    await client.send(command).then((res) => console.log('res:', res));
    // console.log('S3 Objects:', response.Contents);
  } catch (error) {
    console.error('Error listing S3 objects:', error);
  }
}

listS3Objects();
