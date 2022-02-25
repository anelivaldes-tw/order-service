import { Injectable } from "@nestjs/common";
import { Order } from "./models/orders.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateOrdersDto } from "./dto/create-orders.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order
  ) {
  }

  create(createOrdersDto: CreateOrdersDto): Promise<Order> {
    return this.orderModel.create<Order>({ state: "PENDING", ...createOrdersDto });
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
