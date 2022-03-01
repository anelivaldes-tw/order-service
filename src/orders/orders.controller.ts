import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrdersDto } from "./dto/create-orders.dto";
import { EventPattern } from "@nestjs/microservices";
import { EventHandlerService } from "../event-handler/event-handler.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orderService: OrdersService,
              private readonly eventHandlerService: EventHandlerService
  ) {
  }

  @Post()
  create(@Body() createOrdersDto: CreateOrdersDto) {
    return this.orderService.create(createOrdersDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderService.remove(id);
  }

  @EventPattern("customer")
  async handleCustomerEvents(payload: any) {
    this.eventHandlerService.handleEvent("customer", payload, () => {
      const msg = payload.value;
      console.log(msg);
      this.orderService.setStatus(msg.orderId, msg.type);
    });
  }
}
