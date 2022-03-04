import { Order } from './orders.entity';
import { ORDER_REPOSITORY } from '../constants';

export const ordersProviders = [
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
];
