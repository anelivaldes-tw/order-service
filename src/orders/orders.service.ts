import { Inject, Injectable } from '@nestjs/common';
import { Order } from './orders.entity';
import { OrderDto } from './dto/order.dto';
import {
  ORDER_REPOSITORY,
  OrderState,
  OUTBOX_REPOSITORY,
  SEQUELIZE,
} from '../constants';
import { Outbox } from './outbox/outbox.entity';
import { OutboxMsg } from './outbox/outbox-msg.interface';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order,
    @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: typeof Outbox,
    @Inject(SEQUELIZE) private readonly sequelize,
  ) {}

  async createPendingOrder(createOrdersDto: OrderDto): Promise<any> {
    try {
      console.log(`Creating a new Order`);
      return await this.sequelize.transaction(async (t) => {
        const order = await this.orderRepository.create<Order>(
          { state: OrderState.PENDING, ...createOrdersDto },
          { transaction: t },
        );
        const outboxOrder: OutboxMsg = {
          state: order.state,
          orderTotal: order.orderTotal,
          customerId: order.customerId,
          orderId: order.id,
          sent: 0,
        };
        await this.outboxRepository.create<Outbox>(outboxOrder, {
          transaction: t,
        });
        console.log(`Created Pending Order ---> Order id: ${order.id}`);
        return order;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateOrderState(id: string, state: OrderState) {
    return await this.sequelize.transaction(async (t) => {
      await this.orderRepository.update({ state }, { where: { id } });
      const order = await this.orderRepository.findOne({
        where: {
          id,
        },
      });
      const outboxOrder: OutboxMsg = {
        state: order.state,
        orderTotal: order.orderTotal,
        customerId: order.customerId,
        orderId: order.id,
        sent: 0,
      };
      await this.outboxRepository.create<Outbox>(outboxOrder, {
        transaction: t,
      });
      console.log(
        `Updating Order State ---> Order id: ${order.id} State: ${order.state}`,
      );
      return order;
    });
  }
  catch(error) {
    console.error(error);
  }

  async rejectOrder(id: string) {
    await this.updateOrderState(id, OrderState.REJECTED);
  }

  async approveOrder(id: string) {
    await this.updateOrderState(id, OrderState.APPROVED);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  findOne(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
