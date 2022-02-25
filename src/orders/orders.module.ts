import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/orders.model';

@Module({
  imports: [SequelizeModule.forFeature([Order])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
