import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserContext } from '../auth/auth.types';
import { ProductType } from 'apps/catalog/src/products/product.types';
import { mapRpcErrorToHttp } from '../../../../libs/rpc/src/http/rpc-error.mapper';
import { firstValueFrom } from 'rxjs';
import { adminOnly } from '../auth/admin.decorator';
import { Public } from '../auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from '../../../catalog/src/products/product-dto';

@Controller()
export class ProductHttpController {
  constructor(
    //Gateway interact with catalog through RMQ client
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,

    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  @Post('products')
  @adminOnly()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    }),
  )
  async createProduct(
    @CurrentUser() user: UserContext,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() data: CreateProductDto,
  ) {
    let imageUrl: string | undefined = undefined;
    let mediaId: string | undefined = undefined;

    if (file) {
      const base64 = file.buffer.toString('base64');

      try {
        const uploadResult = await firstValueFrom(
          this.mediaClient.send('media.uploadProductImage', {
            fileName: file.originalname,
            mimetype: file.mimetype,
            base64,
            uploadByUserId: user.clerkUserId,
          }),
        );

        imageUrl = uploadResult.url;
        mediaId = uploadResult.mediaId;
      } catch (error) {
        mapRpcErrorToHttp(error);
      }
    }

    let product: ProductType;

    const payload = {
      name: data.name,
      description: data.description,
      price: +data.price,
      status: data.status,
      imageUrl: data.imageUrl,
      createdByClerkUserId: user.clerkUserId,
    };

    //RMQ request and response pattern
    try {
      product = await firstValueFrom(
        this.catalogClient.send<ProductType>('product.create', payload),
      );
    } catch (error) {
      mapRpcErrorToHttp(error || {});
    }

    if (mediaId) {
      try {
        await firstValueFrom(
          this.mediaClient.send('media.attachToProduct', {
            mediaId,
            productId: String(product._id),
            attachedByUserId: user.clerkUserId,
          }),
        );
      } catch (error) {
        mapRpcErrorToHttp(error || {});
      }
    }

    return product;
  }

  @Get('products')
  @Public()
  async listProducts() {
    let products: ProductType[];

    try {
      products = await firstValueFrom(
        this.catalogClient.send<ProductType[]>('product.list', {}),
      );
    } catch (error) {
      mapRpcErrorToHttp(error || {});
    }

    return products;
  }

  @Get('products/:id')
  @Public()
  async getProductById(@Param('id') id: string) {
    let product: ProductType;
    try {
      product = await firstValueFrom(
        this.catalogClient.send<ProductType>('product.getById', { id }),
      );
    } catch (error) {
      mapRpcErrorToHttp(error || {});
    }

    return product;
  }
}
