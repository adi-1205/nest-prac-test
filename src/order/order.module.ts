import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from 'src/database/models/order.model';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports:[SequelizeModule.forFeature([Order]), ProductsModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}
