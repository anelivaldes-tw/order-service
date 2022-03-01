import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { microserviceConfig } from './microserviceConfig';
import { Client, ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client(microserviceConfig)
  client: ClientKafka;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
