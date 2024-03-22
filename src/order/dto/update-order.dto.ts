import { IsDateString, IsOptional } from 'class-validator';
import { OrderStatus } from 'src/enums/orderStatus.enum';

export class UpdateOrderDto {
    @IsOptional()
    @IsDateString()
    shippedDate?: Date;

    orderStatus?: OrderStatus;
}
