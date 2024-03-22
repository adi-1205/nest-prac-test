import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import * as dotenv from 'dotenv';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
dotenv.config();

@Module({
  imports: [AuthModule, SequelizeModule.forRoot({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    autoLoadModels: true,
    // sync:{alter:true}
  }),
    ProductsModule,
    AdminModule,
    OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
