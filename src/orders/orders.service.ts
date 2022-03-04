import { Inject, Injectable } from '@nestjs/common';
import { Order } from './orders.entity';
import { OrderDto } from './dto/order.dto';
import { ORDER_REPOSITORY, OUTBOX_REPOSITORY, SEQUELIZE } from '../constants';
import { Outbox } from './outbox/outbox.entity';
import {
  OrderEvent,
  OrderEventsTypes,
} from '../event-publisher/models/events.model';
import { EventPublisherService } from '../event-publisher/event-publisher.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order,
    @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: typeof Outbox,
    @Inject(SEQUELIZE) private readonly sequelize,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  async create(createOrdersDto: OrderDto): Promise<any> {
    //return await this.orderRepository.create<Order>({ state: "PENDING", ...createOrdersDto });
    // TODO: Implement Transactional outbox pattern here. https://javascript.plainenglish.io/sequelize-transactions-4ca7b6491e86

    try {
      const order = await this.sequelize.transaction(async (t) => {
        const order = await this.orderRepository.create<Order>(
          { state: 'PENDING', ...createOrdersDto },
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

      // If the execution reaches this line, the transaction has been committed successfully
      // `result` is whatever was returned from the transaction callback (the `user`, in this case)
      if (order.id) {
        const orderCreatedEvent: OrderEvent = {
          type: OrderEventsTypes.ORDER_CREATED,
          orderId: order.id,
          customerId: order.customerId,
          orderTotal: order.orderTotal,
        };
        this.eventPublisher.publish(orderCreatedEvent);
      }
      return order;
    } catch (error) {
      // If the execution reaches this line, an error occurred.
      // The transaction has already been rolled back automatically by Sequelize!
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
