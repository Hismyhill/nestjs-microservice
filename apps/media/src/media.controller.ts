import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttachToProductDto, UploadProductImageDto } from './media/media.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('media.uploadProductImage')
  uploadProductImage(@Payload() ImageData: UploadProductImageDto) {
    return this.mediaService.uploadProductImage(ImageData);
  }

  @MessagePattern('media.attachToProduct')
  attachToProduct(@Payload() Mediadata: AttachToProductDto) {
    return this.mediaService.attachMediaToProduct(Mediadata);
  }

  @MessagePattern('service.ping')
  ping() {
    return this.mediaService.ping();
  }
}
