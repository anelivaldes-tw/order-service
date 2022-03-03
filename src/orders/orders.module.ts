import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "./models/orders.model";
import { EventPublisherModule } from "../event-publisher/event-publisher.module";
import { EventPublisherService } from "../event-publisher/event-publisher.service";
import { EventHandlerModule } from "../event-handler/event-handler.module";
import { EventHandlerService } from "../event-handler/event-handler.service";
import { Outbox } from "./models/outbox.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Order, Outbox]),
    EventPublisherModule, EventHandlerModule],
  providers: [OrdersService, EventPublisherService, EventHandlerService],
  controllers: [OrdersController]
})
export class OrdersModule {
}
