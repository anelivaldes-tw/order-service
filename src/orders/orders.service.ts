import { Inject, Injectable } from "@nestjs/common";
import { Order } from "./orders.entity";
import { OrderDto } from "./dto/order.dto";
import { ORDER_REPOSITORY } from "../constants";

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order
  ) {
  }

  async create(createOrdersDto: OrderDto): Promise<any> {
    return await this.orderRepository.create<Order>({ state: "PENDING", ...createOrdersDto });
    // TODO: Implement Transactional outbox pattern here. https://javascript.plainenglish.io/sequelize-transactions-4ca7b6491e86
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
        id
      }
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
