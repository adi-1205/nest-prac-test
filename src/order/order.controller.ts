import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req, UseGuards, ParseIntPipe, Query, Render } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/database/models/user.model';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('past')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.User)
  @Render('user/orders')
  async getViewOrders(@Req() req: Request, @Query() qr) {
    let user = req.user as User
    let { rows: _orders, count } = await this.orderService.findAll({ user: user.id, ...qr })
    let orders = _orders.map(o => {
      return {
        orderDate: new Date(o.order_date).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }),
        orderStatus: o.order_status,
        name: o.product.name,
        image: JSON.parse(o.product.images)[0]
      }
    })

    return { orders, count, orderPage: true }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return await this.orderService.create(req, createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() qr) {
    return this.orderService.findAll(qr);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseIntPipe) id) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin)
  update(@Param('id', ParseIntPipe) id, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(+id);
  // }
}
