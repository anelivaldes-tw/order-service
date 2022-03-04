import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { EventPublisherModule } from "../event-publisher/event-publisher.module";
import { EventPublisherService } from "../event-publisher/event-publisher.service";
import { EventHandlerModule } from "../event-handler/event-handler.module";
import { EventHandlerService } from "../event-handler/event-handler.service";
import { ordersProviders } from "./orders.providers";

@Module({
  imports: [
    EventPublisherModule, EventHandlerModule],
  providers: [OrdersService, ...ordersProviders,
    EventPublisherService,
    EventHandlerService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {
}
