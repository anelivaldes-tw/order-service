import { OrderState } from '../../constants';

export interface OutboxMsg {
  state: OrderState,
  orderTotal: number,
  customerId: string,
  orderId: number,
  sent: 0,
}