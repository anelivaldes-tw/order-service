import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty()
  customerId: string;
  @ApiProperty()
  orderTotal: number;
}
