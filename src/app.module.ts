import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { mysql } from './sequelize.config';
import { Order } from "./orders/models/orders.model";

@Module({
  imports: [
    TerminusModule,
    HealthModule,
    SequelizeModule.forRoot({...mysql, models: [Order]}),
    OrdersModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
