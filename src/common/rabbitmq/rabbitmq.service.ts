import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(
      RabbitmqService.configuration(Transport.RMQ),
    );
  }

  public send(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }

  static configuration(transport) {
    const user = process.env.RABBITMQ_USER;
    const password = process.env.RABBITMQ_PASSWORD;
    const host = process.env.RABBITMQ_HOST;
    const queueName = process.env.RABBITMQ_QUEUE_NAME;
    return {
      transport,
      options: {
        urls: [`amqp://${user}:${password}@${host}`],
        queue: queueName,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
