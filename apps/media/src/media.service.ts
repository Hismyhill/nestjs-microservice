import { Injectable } from '@nestjs/common';
import { initCloudinary } from './cloudinary/cloudinary.client';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from './media/media.schema';
import { UploadProductImageDto } from './media/media.dto';
import { rpcBadRequest } from '@app/rpc';
import { Model } from 'mongoose';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class MediaService {
  private readonly cloudinary = initCloudinary();
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async uploadProductImage(input: UploadProductImageDto) {
    if (!input.base64) rpcBadRequest('Image base64 is required');

    if (!input.mimeType.startsWith('image/'))
      rpcBadRequest('Only image files are allowed');

    const buffer = Buffer.from(input.base64, 'base64');

    if (buffer.length) rpcBadRequest('Invalid image data');

    if (buffer.length > 5 * 1024 * 1024)
      rpcBadRequest('Image size exceeds 5MB limit');

    const uploadResult = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          },
        );

        stream.end(buffer);
      },
    );

    const url = uploadResult?.secure_url || uploadResult?.url;
    const publicId = uploadResult?.public_id;

    if (!url || !publicId)
      rpcBadRequest('Failed to upload image to cloud storage');

    const newMedia = await this.mediaModel.create({
      url,
      publicId,
      uploadedByUserId: input.uploadedByUserId,
      productId: undefined,
    });

    return {
      mediaId: newMedia._id.toString(),
      url,
      publicId,
    };
  }

  async attachMediaToProduct(input: { mediaId: string; productId: string }) {
    const updated = await this.mediaModel
      .findByIdAndUpdate(
        input.mediaId,
        {
          $set: {
            productId: input.productId,
          },
        },
        { new: true },
      )
      .exec();

    if (!updated) rpcBadRequest('Media not found');

    return {
      mediaId: updated._id.toString(),
      productId: updated.productId,
    };
  }

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toISOString(),
    };
  }
}
