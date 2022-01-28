import { Module } from '@nestjs/common';
import { RabbitmqModule } from './common/rabbitmq/rabbitmq.module';
import { PeopleModule } from './people/people.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), RabbitmqModule, PeopleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
