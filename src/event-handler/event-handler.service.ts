import { Injectable } from '@nestjs/common';

@Injectable()
export class EventHandlerService {
  async handleEvent(topic, event, callback) {
    console.log('Received:', event);
    console.log('From:', topic);
    callback();
  }
}
