import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

async function listS3Objects() {
  console.log('Starting S3 connection...');

  console.log({
    region: process.env.S3_REGION || '',
    endpoint: process.env.S3_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
  });

  const client = new S3Client({
    region: process.env.S3_REGION || '',
    endpoint: process.env.S3_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
  });

  console.log('S3 client created.');

  const command = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET || '',
  });

  console.log('ListObjectsV2Command created:', command);

  try {
    const response = await client.send(command);
    console.log('S3 Objects:', response.Contents);
  } catch (error) {
    console.error('Error listing S3 objects:', error);
  }
}

listS3Objects();
