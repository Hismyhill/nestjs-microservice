import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import type { ProductStatus } from './product.schema';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  status?: ProductStatus;

  @IsString()
  createdByClerkUserId: string;
}

export class GetProductByIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
