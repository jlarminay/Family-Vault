import { statSync } from 'fs';
import { resolve } from 'path';
import sizeOf from 'image-size';

export default class ImageProcessor {
  private imagePath: string;

  constructor(image: string) {
    this.imagePath = image;
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
      path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/persons/${finalData.randomString}_${finalData.image.name}`,
      size: statSync(resolve(this.imagePath)).size,
      metadata: {
        resolution: `${dimensions.width}x${dimensions.height}`,
      },
    };

    return finalData;
  }
}
