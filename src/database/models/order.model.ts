import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { OrderStatus } from 'src/enums/orderStatus.enum';
import { Product } from './product.model';

@Table
export class Order extends Model<Order> {
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  order_code: string;

  @Column
  order_date: Date;

  @Column
  required_date: Date;

  @Column
  shipped_data: Date;

  @Column
  order_status: OrderStatus;

  @ForeignKey(() => Product) // Define foreign key for productId referencing Product model
  @Column
  product_id: number;

  @BelongsTo(() => Product) // Define association with the Product model
  product: Product;
 
}
