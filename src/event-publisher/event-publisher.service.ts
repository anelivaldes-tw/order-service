import { Injectable } from "@nestjs/common";
import { Client, ClientKafka } from "@nestjs/microservices";
import { microserviceConfig } from "../microserviceConfig";

@Injectable()
export class EventPublisherService {
  @Client(microserviceConfig)
  client: ClientKafka;

  publish(topic, event) {
    this.client.emit<string>(topic, event);
  }
}
