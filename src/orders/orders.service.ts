import { Injectable } from "@nestjs/common";
import { Order } from "./models/orders.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateOrdersDto } from "./dto/create-orders.dto";
import { EventPublisherService } from "../event-publisher/event-publisher.service";
import { OrderEvent, OrderEventsTypes } from "../event-publisher/models/events.model";
import { Outbox } from "./models/outbox.model";
import sequelize from "sequelize";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(Outbox) private readonly outboxModel: typeof Outbox,
    private readonly eventPublisher: EventPublisherService
  ) {
  }

  async create(createOrdersDto: CreateOrdersDto): Promise<any> {
    //const order = await this.orderModel.create<Order>({ state: "PENDING", ...createOrdersDto });
    // TODO: Implement Transactional outbox pattern here. https://javascript.plainenglish.io/sequelize-transactions-4ca7b6491e86


    try {
      // @ts-ignore
      const order = await sequelize.transaction(async (t) => {
        const order = await this.orderModel.create<Order>({ state: "PENDING", ...createOrdersDto }, { transaction: t });
        const outboxOrder = {
          type: order.state,
          orderTotal: order.orderTotal,
          customerId: order.customerId,
          orderId: order.id,
          sent: 0
        };
        await this.outboxModel.create<Outbox>(outboxOrder, { transaction: t });
        return order;
      });

      // If the execution reaches this line, the transaction has been committed successfully
      // `result` is whatever was returned from the transaction callback (the `user`, in this case)
      if (order.id) {
        const orderCreatedEvent: OrderEvent = {
          type: OrderEventsTypes.ORDER_CREATED,
          orderId: order.id,
          customerId: order.customerId,
          orderTotal: order.orderTotal
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
    return this.orderModel.update({ state }, { where: { id } });
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll();
  }

  findOne(id: string): Promise<Order> {
    return this.orderModel.findOne({
      where: {
        id
      }
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
