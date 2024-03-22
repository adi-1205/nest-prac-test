import { IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  productId: number;
}