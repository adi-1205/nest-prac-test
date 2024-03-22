import { Model, Table, Column, HasMany } from 'sequelize-typescript';
import { Role } from 'src/enums/roles.enum';
import { Order } from './order.model';

@Table({ tableName: 'user', paranoid: true, timestamps: true })
export class User extends Model<User> {
  @Column({ allowNull: false })
  mobile_number: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  username: string;

  @Column({ allowNull: false })
  role: Role;

  @HasMany(() => Order)
  orders: Order[];
}