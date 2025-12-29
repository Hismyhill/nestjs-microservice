import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { isValidObjectId, Model } from 'mongoose';
import { rpcBadRequest } from '@app/rpc';
import { CreateProductDto } from './product-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  // Service methods would go here
  async createProduct(product: CreateProductDto): Promise<Product> {
    if (!product.name || !product.description)
      rpcBadRequest('Name and description are required');

    if (
      typeof product.price !== 'number' ||
      product.price < 0 ||
      Number.isNaN(product.price)
    )
      rpcBadRequest('Price must be a positive number');

    if (
      product.status &&
      !['DRAFT', 'ACTIVE', 'SOLD_OUT'].includes(product.status)
    )
      rpcBadRequest('Invalid status value');

    const newProduct = new this.productModel(product);

    // const newProduct = await this.productModel.create({
    //   name: product.name,
    //   description: product.description,
    //   price: product.price,
    //   imageUrl: product.imageUrl,
    //   createdByClerkUserId: product.createdByClerkUserId,
    //   status: product.status,
    // });

    return newProduct.save();
  }

  async getProductById(id: string): Promise<ProductDocument | null> {
    if (!id || id.trim() === '') rpcBadRequest('Product ID is required');

    if (!isValidObjectId(id)) rpcBadRequest('Invalid Product ID format');
    const product = await this.productModel.findById(id).exec();

    if (!product) rpcBadRequest('Product not found');

    return product;
  }

  async listProducts(): Promise<ProductDocument[]> {
    return this.productModel.find().sort({ createdAt: -1 }).exec();
  }
}
