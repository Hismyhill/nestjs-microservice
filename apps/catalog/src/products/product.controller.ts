import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto, GetProductByIdDto } from './product-dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('product.create')
  createProduct(@Payload() productData: CreateProductDto) {
    return this.productService.createProduct(productData);
  }

  @MessagePattern('product.list')
  listProduct() {
    return this.productService.listProducts();
  }

  @MessagePattern('product.getById')
  getProductById(@Payload() product: GetProductByIdDto) {
    return this.productService.getProductById(product.id);
  }
}
