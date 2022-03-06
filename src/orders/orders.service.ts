import { Inject, Injectable } from '@nestjs/common';
import { Order } from './orders.entity';
import { OrderDto } from './dto/order.dto';
import { ORDER_REPOSITORY, OUTBOX_REPOSITORY, PENDING, SEQUELIZE } from '../constants';
import { Outbox } from './outbox/outbox.entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order,
    @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: typeof Outbox,
    @Inject(SEQUELIZE) private readonly sequelize,
  ) {
  }

  async create(createOrdersDto: OrderDto): Promise<any> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const order = await this.orderRepository.create<Order>(
          { state: PENDING, ...createOrdersDto },
          { transaction: t },
        );
        const outboxOrder = {
          type: order.state,
          orderTotal: order.orderTotal,
          customerId: order.customerId,
          orderId: order.id,
          sent: 0,
        };
        await this.outboxRepository.create<Outbox>(outboxOrder, {
          transaction: t,
        });
        return order;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async setStatus(id: string, state: string) {
    return this.orderRepository.update({ state }, { where: { id } });
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
