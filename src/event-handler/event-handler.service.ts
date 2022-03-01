import { Injectable } from "@nestjs/common";

@Injectable()
export class EventHandlerService {
  constructor() {
  }
  async handleEvent(topic, event, callback) {
    console.log('Received:', JSON.stringify(event))
    console.log('From:', topic);
    callback();
  }
}
