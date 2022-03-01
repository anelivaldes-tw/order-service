import { Injectable } from "@nestjs/common";
import { Order } from "./models/orders.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateOrdersDto } from "./dto/create-orders.dto";
import { EventPublisherService } from "../event-publisher/event-publisher.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    private readonly eventPublisher: EventPublisherService
  ) {
  }

  async create(createOrdersDto: CreateOrdersDto): Promise<any> {
    const order = await this.orderModel.create<Order>({ state: "PENDING", ...createOrdersDto });
    // TODO: Implement Transactional outbox pattern here. https://javascript.plainenglish.io/sequelize-transactions-4ca7b6491e86
    if (order.id) {
      const orderCreatedEvent = {
        type: "ORDER_CREATED",
        orderId: order.id,
        customerId: order.customerId,
        orderTotal: order.orderTotal
      };
      this.eventPublisher.publish("order", orderCreatedEvent);
    }
    return order;
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
