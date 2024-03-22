import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/database/models/product.model';
import { ProductsModule } from 'src/products/products.module';
import { Order } from 'src/database/models/order.model';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Product, Order]), ProductsModule, OrderModule],
  providers: [AdminService, MulterModule],
  controllers: [AdminController]
})
export class AdminModule { }
