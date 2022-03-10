import { Column, Table, Model, DataType } from 'sequelize-typescript';
import { OrderState } from '../constants';

@Table
export class Order extends Model {
  @Column({ type: DataType.ENUM({ values: Object.keys(OrderState) }) })
  state: OrderState;

  @Column
  orderTotal: number;

  @Column
  customerId: string;
}
