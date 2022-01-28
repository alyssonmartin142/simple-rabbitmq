import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { RabbitmqService } from 'src/common/rabbitmq/rabbitmq.service';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService, RabbitmqService],
})
export class PeopleModule {}
