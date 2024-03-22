
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Product extends Model<Product> {
    @Column
    name: string;

    @Column
    size: string;

    @Column(DataType.TEXT)
    images: string;

    @Column
    colour: string;

    @Column
    price: number;

    @Column
    quantity: number;
}