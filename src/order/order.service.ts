import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from 'src/database/models/order.model';
import { Request } from 'express';
import { User } from 'src/database/models/user.model';
import { OrderStatus } from 'src/enums/orderStatus.enum';
import * as crypto from 'crypto';
import { Product } from 'src/database/models/product.model';
import { ProductsService } from 'src/products/products.service';
@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order) private OrderModel: typeof Order,
    private productService: ProductsService) {
  }

  async create(req: Request, createOrderDto: CreateOrderDto) {
    let user = req?.user as User
    if (!user?.id)
      throw new BadRequestException('Invalid user')
    let product = await this.productService.findOne(createOrderDto.productId)
    if (!product)
      throw new BadRequestException('No such product')
    await this.productService.update(createOrderDto.productId, { quantity: product.quantity - 1 })
    let order = {
      user_id: user?.id,
      product_id: createOrderDto.productId,
      required_date: new Date(),
      order_code: crypto.randomBytes(8).toString('hex'),
      order_date: new Date(),
      shipped_date: null,
      order_status: OrderStatus.PENDING,
    };
    return await this.OrderModel.create(order);
  }

  async findAll(qr) {
    const where = {}
    const page = parseInt(qr.page, 10) || 1;
    const limit = page == 1 ? 12 : (parseInt(qr.limit, 10) || 10);
    const offset = (page - 1) * limit;
    const sortOrder = ['DESC', 'ASC'].includes(qr.sortOrder) ? qr.sortOrder : 'DESC'
    const sortBy = ['createdAt', 'shipped_data'].includes(qr.sortBy) ? qr.sortBy : 'createdAt'
    const status = qr.status
    if (status) {
      where['order_status'] = status;
    }
    if (qr.user) {
      where['user_id'] = qr.user
    }

    let { rows, count } = await this.OrderModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: {
        model: Product
      }
    })
    return { count, rows };
  }

  async findOne(id: number) {
    const order = await this.OrderModel.findByPk(id, {
      include: {
        model: Product
      }
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (![OrderStatus.PENDING, OrderStatus.DELIVERED].includes(updateOrderDto.orderStatus))
      throw new BadRequestException('Invlaid order status')
    if (updateOrderDto.orderStatus == OrderStatus.DELIVERED) {
      order.order_status = OrderStatus.DELIVERED
      order.shipped_data = new Date()
    }
    await order.save();
    return order;
  }
  // async remove(id: number) {
  //   const order = await this.findOne(id);
  //   await order.destroy();
  // }
}
