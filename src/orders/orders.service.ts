import { Injectable } from "@nestjs/common";
import { Order } from "./models/orders.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateOrdersDto } from "./dto/create-orders.dto";
import { Client, ClientKafka } from "@nestjs/microservices";
import { microserviceConfig } from "../microserviceConfig";

@Injectable()
export class OrdersService {

  @Client(microserviceConfig)
  client: ClientKafka;

  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order
  ) {
  }

  async create(createOrdersDto: CreateOrdersDto): Promise<Order> {
    const order = await this.orderModel.create<Order>({ state: "PENDING", ...createOrdersDto });
    if(order.id){
      this.client.emit<string>('orders', JSON.stringify(order));
    }
    return order;
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
