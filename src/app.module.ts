import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { EventPublisherModule } from './event-publisher/event-publisher.module';
import { EventHandlerModule } from './event-handler/event-handler.module';
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TerminusModule,
    HealthModule,
    OrdersModule,
    EventPublisherModule,
    EventHandlerModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
