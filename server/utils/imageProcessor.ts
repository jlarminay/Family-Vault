import { statSync } from 'fs';
import { resolve } from 'path';
import sizeOf from 'image-size';
import shell from 'shelljs';

export default class ImageProcessor {
  public imagePath: string;

  constructor(image: string) {
    this.imagePath = image;
  }

  async convertToWebp(): Promise<void> {
    // check if needed
    if (this.imagePath.split('.').pop() === 'webp') return;

    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
    const fileName = this.imagePath.split('/').pop() || '';
    const newPath = `${targetDir}/${fileName.replace(/\.[^/.]+$/, '.webp')}`;

    // convert
    shell.exec(`cwebp -quiet ${this.imagePath} -o ${newPath}`);
    this.imagePath = newPath;

    return;
  }

  async prepareNewImage(): Promise<any> {
    let finalData = {
      randomString: Math.random().toString(16).slice(2),
      image: {} as any,
    };

    // manage image
    finalData.image.name = this.imagePath.split('/').pop();
    // get metadata
    const dimensions = sizeOf(resolve(this.imagePath));
    finalData.image = {
      name: finalData.image.name,
      type: 'image',
      path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${process.env.ENVIRONMENT}/images/${finalData.randomString}_${finalData.image.name}`,
      size: statSync(resolve(this.imagePath)).size.toString(),
      metadata: {
        resolution: `${dimensions.width}x${dimensions.height}`,
      },
    };

    return finalData;
  }
}
