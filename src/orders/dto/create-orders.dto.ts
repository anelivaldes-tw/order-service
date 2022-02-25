import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrdersDto extends Model {
  @ApiProperty()
  customerId: string;
  @ApiProperty()
  orderTotal: number;
}
