import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    size: string;

    @IsNotEmpty()
    @IsString()
    colour: string;

    @IsNotEmpty()
    // @IsNumber()
    price: number;

    @IsNotEmpty()
    // @IsNumber()
    quantity: number;
}