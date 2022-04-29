import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { EventPattern } from '@nestjs/microservices';
import { EventHandlerService } from '../event-handler/event-handler.service';
import {
  CustomerEvent,
  CustomerEventTypes,
} from '../event-publisher/models/events.model';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly eventHandlerService: EventHandlerService,
  ) {
  }

  @Post()
  create(@Body() createOrdersDto: OrderDto) {
    return this.orderService.createPendingOrder(createOrdersDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @EventPattern('customer')
  async handleCustomerEvents(payload: any) {
    this.eventHandlerService.handleEvent('customer', payload, () => {
      const customerEvent: CustomerEvent = payload.value;
      if (customerEvent.type === CustomerEventTypes.CREDIT_RESERVED) {
        this.orderService.approveOrder(customerEvent.orderId);
      }
      if (
        customerEvent.type === CustomerEventTypes.CUSTOMER_VALIDATION_FAILED ||
        customerEvent.type === CustomerEventTypes.CREDIT_RESERVATION_FAILED
      ) {
        this.orderService.rejectOrder(customerEvent.orderId);
      }
    });
  }
}
