import { Column, Table, Model } from 'sequelize-typescript';

@Table
export class Order extends Model {
  @Column
  state: string;

  @Column
  orderTotal: number;

  @Column
  customerId: string;
}
