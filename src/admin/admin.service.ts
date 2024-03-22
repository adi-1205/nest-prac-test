import { Injectable } from '@nestjs/common';
import { Product } from 'src/database/models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsService } from 'src/products/products.service';
import { OrderService } from 'src/order/order.service';
import { Order } from 'src/database/models/order.model';
import { OrderStatus } from 'src/enums/orderStatus.enum';

@Injectable()
export class AdminService {

    constructor(
        @InjectModel(Product) private ProductModel: typeof Product,
        @InjectModel(Order) private OrderModel: typeof Order,
        private productService: ProductsService,
        private orderService: OrderService,) {
    }

    async getProducts(qr) {
        let { rows: _products, count } = await this.productService.findAll(qr)

        let products = _products.map(p => {
            return {
                ...p.toJSON(),
                json: JSON.stringify(p)
            }
        })

        return { products, count, productPage: true }
    }

    async getOrders(qr) {
        let { rows: _orders, count } = await this.orderService.findAll(qr)
        let orders = _orders.map(o => {
            return {
                orderDate: new Date(o.order_date).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                }),
                orderStatus: o.order_status,
                isPending: o.order_status == OrderStatus.PENDING,
                isDelivered: o.order_status == OrderStatus.DELIVERED,
                name: o.product.name,
                id: o.id,
                image: JSON.parse(o.product.images)[0]
            }
        })

        return { orders, count, orderPage: true }
    }
}
