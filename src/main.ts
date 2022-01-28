import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RabbitmqService } from './common/rabbitmq/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.connectMicroservice<MicroserviceOptions>(
    RabbitmqService.configuration(Transport.RMQ),
  );
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
